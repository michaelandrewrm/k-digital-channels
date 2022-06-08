<template>
	<iframe
		v-if="session && session.url"
		ref="frame"
		class="v-sso-skyline"
		:class="{ '--is-show': active }"
		:src="session.url"
		name="skyline"
		frameborder="0"
	></iframe>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'v-sso-skyline',

	props: {
		session: Object,
		active: Boolean,
	},

	data() {
		return {
			loginTimer: null,
			checkingTimer: null,
			isClose: false,
		};
	},

	computed: {
		...mapState('secure', { agentUUID: 'uuid' }),
	},

	methods: {
		updateSession(userId, params) {
			this.$emit('update-session', userId, params);
		},

		closeSession(userId) {
			this.$emit('close-session', userId);
		},

		openNotification(text) {
			return this.$store.dispatch('notification/open', { text });
		},

		requestOptions({ userId, action }) {
			this.postMessage({
				name: 'request-option',
				userId,
				action,
			});
		},

		postMessage(message) {
			this.$el.contentWindow?.postMessage(message, this.session.url);
		},

		receiveMessage(event) {
			const { origin, data } = event;
			const { isMobile, session, agentUUID } = this;
			const userId = this.session.id;

			if (origin !== session?.url || (data?.userId && data.userId !== userId)) {
				return;
			}

			switch (data?.name) {
				case 'vuesoma-is-ready':
					/* istanbul ignore else */
					if (!session.userUUID) {
						clearTimeout(this.loginTimer);
						clearTimeout(this.checkingTimer);
						this.checkingTimer = setTimeout(() => {
							if (!this.isClose) {
								this.postMessage({
									name: 'create-session',
									userId,
									username: session.name,
									agentUUID,
								});
							}
						}, 3000);
					}
					break;
				case 'reload':
					if (session?.userUUID === data?.userUUID) {
						this.updateSession(userId, { userUUID: null, isLoading: true });
					}
					break;
				case 'session-is-ready':
					if (!session.userUUID) {
						this.updateSession(userId, { userUUID: data?.userUUID, isLoading: true });
						this.postMessage({ name: 'request-access', userId });

						clearTimeout(this.loginTimer);
						this.loginTimer = setTimeout(() => {
							if (!this.isClose && !session.isVisible) {
								this.openNotification('DASHBOARD.SOMETHING_WRONG');
							}
						}, 10000);
					}
					break;
				case 'show-frame':
					if (!session.isVisible) {
						clearTimeout(this.loginTimer);
						this.updateSession(userId, { isVisible: true, isLoading: false });
						this.postMessage({ name: 'get-notification-mode', userId });
						this.isDrawerClosed = isMobile;
					}
					break;
				case 'update-session':
					if (data?.userUUID === session?.userUUID) {
						this.updateSession(userId, { ...data?.payload });
					}
					break;
				case 'open-notification':
					if (data?.userUUID === session?.userUUID) {
						this.openNotification(this.$t(data?.text));
					}
					break;
				case 'error':
					if (data?.userUUID === session?.userUUID) {
						clearTimeout(this.loginTimer);
						this.closeSession(userId);
						this.openNotification(this.$t(data?.text));
					}
					break;
				case 'hide-frame':
					if (data?.userUUID === session?.userUUID) {
						this.closeSession(userId);
					}
					break;
				case 'sirvase-request':
					if (data?.userUUID === session?.userUUID) {
						this.session.sirvase.response = data.payload;
					}
					break;
			}
		},
	},

	watch: {
		'session.isClose': {
			immediate: true,
			handler(isClose) {
				this.isClose = isClose;
			},
		},

		'session.action': {
			immediate: true,
			handler(action) {
				if (action) {
					const userId = this.session.id;

					if (action === 'changeNotificationMode') {
						return this.postMessage({
							name: 'change-notification-mode',
							userId,
							smsByEmail: !this.session.isNotificationByEmail,
						});
					}

					if (action === 'sirvaseRequest') {
						const { request } = this.session.sirvase;

						this.postMessage({
							name: 'sirvase-request',
							userId,
							payload: {
								...request,
							},
						});
						return this.updateSession(userId, { action: null });
					}

					this.requestOptions({ userId, action });
					this.updateSession(userId, { action: null });
				}
			},
		},
	},

	mounted() {
		window.addEventListener('message', this.receiveMessage, false);

		this.loginTimer = setTimeout(() => {
			if (!this.session.isVisible) {
				this.openNotification(this.$t('DASHBOARD.SOMETHING_WRONG'));
				this.closeSession(this.session.id);
			}
		}, 10000);
	},

	beforeDestroy() {
		window.removeEventListener('message', this.receiveMessage, false);
	},
};
</script>

<style lang="scss" scoped>
.v-sso-skyline {
	position: relative;
	border-radius: 10px;
	width: 100%;
	height: 100%;
	opacity: 0;
	transition: opacity 250ms ease;
	z-index: -1;
}

.v-sso-skyline.--is-show {
	opacity: 1;
	z-index: 1;
}
</style>
