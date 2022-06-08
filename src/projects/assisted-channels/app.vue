<template>
	<div id="vuesoma">
		<router-view :inert="inert" />
		<w-notification />
		<w-modal />
		<router-view name="modal" />
		<c-fullscreen-spinner v-if="status" data-testid="spinner" />
	</div>
</template>

<script>
import { mapState } from 'vuex';
import CFullscreenSpinner from '@components/c-fullscreen-spinner';
import WModal from '@widgets/w-modal';
import WNotification from '@widgets/w-notification';
import mq from '@utils/matchMedia';
import { onPWA } from '@theme';
import { importLocale } from '@locales/setup';

export default {
	name: 'app',

	components: {
		CFullscreenSpinner,
		WNotification,
		WModal,
	},

	data() {
		return {
			expiredSessionTimeOut: 0,
		};
	},

	computed: {
		inert({
			$store: {
				getters: {
					'modal/lastOpened': lastModalOpened = false,
					'dialog/lastOpened': lastDialogOpened = false,
				},
			},
		}) {
			return Boolean(lastModalOpened || lastDialogOpened);
		},

		isPWA: mq(onPWA),

		...mapState('agent', ['loggedIn']),
		...mapState('session', ['theme', 'lang']),
		...mapState('loading', ['status']),
	},

	watch: {
		isPWA(value) {
			if (value) {
				document.addEventListener(
					'contextmenu',
					(e) => {
						if (e.target.tagName.toLowerCase() !== 'input') {
							e.preventDefault();
						}
					},
					false
				);
			}
		},

		loggedIn(value) {
			if (!value) {
				clearInterval(this.expiredSessionTimeOut);
				/* istanbul ignore else */
				if (this.$route.name !== 'login') {
					this.$router.push({ name: 'login' });
				}
			} else {
				const oneSecond = 1000;
				this.expiredSessionTimeOut = setInterval(() => {
					const minutesFromLastRequest =
						(new Date() - this.$store.state.service.lastRequestTimestamp) / 1000 / 60;

					/* istanbul ignore else */
					if (minutesFromLastRequest > 10) {
						this.$store.dispatch('agent/passiveLogout');
					}
				}, oneSecond);
			}
		},

		theme: {
			immediate: true,
			handler(value) {
				document.documentElement.dataset.theme = value;
			},
		},

		lang(value) {
			importLocale(value);
		},
	},

	created() {
		window.dispatchEvent(new Event('ready-for-action'));

		this.$router.afterEach((to, from) => {
			this.$store.dispatch('bugsnag/log', {
				type: 'navigation',
				title: 'Router push',
				from: from.path,
				to: to.path,
			});
		});
	},

	mounted() {
		window.dispatchEvent(new CustomEvent('bridge-router-nav'));
	},
};
</script>

<style lang="scss" scoped>
#vuesoma {
	height: 100%;
	display: flex;
}

[inert] {
	overflow: hidden;
}
</style>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
@import '~@design/index.scss';

body {
	@extend %typo-m-book;
}

.v__internal-a11y-hide {
	position: absolute;
	clip: rect(1px, 1px, 1px, 1px);
	background: 0 0;
	color: transparent;
	width: 1px;
	height: 1px;
	overflow: hidden;
}
</style>
