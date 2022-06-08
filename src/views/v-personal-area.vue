<template>
	<l-page>
		<h1 slot="header" tabindex="-1">{{ $t('PERSONAL_AREA.TITLE') }}</h1>

		<c-acrylic-sheet
			data-testid="user-card"
			class="v-personal-area__item-header"
			slot="widget"
			actionable
			@expand="openPersonalDetails"
		>
			<c-icon src="@icons/userBig" size="" slot="icon" />

			<div class="v-personal-area__name">
				<span class="text-l-medium" v-if="userName">{{ userName }}</span>
			</div>
		</c-acrylic-sheet>

		<div class="v-personal-area__content text-m-light">
			<c-list-option class="v-personal-area__list">
				<div data-test-id="toggle-push" class="v-personal-area__button --border">
					<c-icon
						src="@icons/notificationPush"
						size="inherit"
						:class="{ 'color-text-accent': !hasPushEnabled }"
					/>
					<span class="text-m-medium" :class="{ 'color-text-accent': !hasPushEnabled }">
						<div class="v-persona-area__p">
							{{ $t(`PERSONAL_AREA.PUSH_NOTIFICATIONS.${pushNotificationStateLabel}_TITLE`) }}
						</div>
						<div class="text-s-book">
							<p class="v-persona-area__p">
								{{ $t(`PERSONAL_AREA.PUSH_NOTIFICATIONS.${pushNotificationStateLabel}_DESC_1`) }}
							</p>
							<p>
								{{ $t(`PERSONAL_AREA.PUSH_NOTIFICATIONS.${pushNotificationStateLabel}_DESC_2`) }}
							</p>
						</div>
					</span>
					<span class="text-m-medium" v-if="hasPushEnabled">
						<c-toggle
							data-test-id="toggle-push-radio"
							class="v-personal__toggle"
							v-model="hasPushEnabled"
						/>
					</span>
				</div>

				<button
					data-testid="language"
					class="v-personal-area__button"
					tag="button"
					@click="goto('language')"
				>
					<c-icon src="@icons/lang" size="inherit" />
					<span class="text-m-medium">{{ $t('LANGUAGE') }}</span>
				</button>

				<button
					data-testid="password-change"
					class="v-personal-area__button"
					tag="button"
					@click="goto('change-password')"
				>
					<c-icon src="@icons/lock" size="inherit" />
					<span class="text-m-medium">{{ $t('CHANGE_PASSWORD') }}</span>
				</button>

				<button
					data-test-id="toggle-theme"
					class="v-personal-area__button --border"
					@click="toggleTheme"
				>
					<c-icon src="@icons/moon" size="inherit" />
					<span class="text-m-medium">{{ $t('DARK_MODE') }}</span>
					<span class="text-m-medium">
						<c-toggle
							data-test-id="toggle-theme-radio"
							class="v-personal__toggle"
							:value="theme === 'dark'"
							readonly
							tabindex="-1"
						/>
					</span>
				</button>

				<button class="v-personal-area__button" data-test-id="logout-button" @click="logout">
					<c-icon src="@icons/exit" size="inherit" />
					<span class="text-m-medium">{{ $t('ACTIONS.CLOSE_SESSION') }}</span>
				</button>
			</c-list-option>
		</div>

		<div class="v-personal-area__last-access color-text-primary" slot="footer" v-if="lastLogin">
			<div class="v-personal-area__last-access-icon">
				<c-icon src="@icons/calendar" size="inherit" />
			</div>
			<div class="v-personal-area__last-access-description">
				<span class="text-m-medium">{{ $t('PERSONAL_AREA.LAST_ACCESS') }}</span>
				<span class="text-m-book">{{ $d(new Date(lastLogin), 'custom') }}</span>
			</div>
		</div>
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import LPage from '@layouts/l-page';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';
import CToggle from '@components/c-toggle';
import CListOption from '@components/c-list-option';
import SessionCache from '@modules/session/session-cache';
import moduleUserNotifications from '@modules/user/m-user-notifications';
import modalConfirmPushNotification from '@modals/m-confirm-push-notification';

export default {
	name: 'v-personal-area',

	modules: { userNotifications: moduleUserNotifications },

	components: {
		LPage,
		CAcrylicSheet,
		CIcon,
		CToggle,
		CListOption,
	},

	data() {
		return {
			hasPushEnabled: false,
		};
	},

	computed: {
		...mapState('session', ['theme', 'lastLogin', 'userName']),

		pushNotificationStateLabel({ hasPushEnabled }) {
			return hasPushEnabled ? 'ENABLED' : 'DISABLED';
		},
	},

	watch: {
		async hasPushEnabled(hasPushEnabled) {
			if (!hasPushEnabled) {
				const confirm = await this.$store.dispatch('modal/open', modalConfirmPushNotification);

				if (confirm) {
					this.$store.dispatch('userNotifications/setPushNotificationState', false).catch(() => {
						this.hasPushEnabled = true;
					});
				} else {
					this.hasPushEnabled = true;
				}
			}
		},
	},

	methods: {
		logout() {
			this.$store.dispatch('authn/activeLogout');
		},

		toggleTheme() {
			this.$store.dispatch('session/setTheme', this.theme === 'dark' ? 'light' : 'dark');
		},

		goto(name) {
			if (this.$route.name === name) {
				return;
			}
			// We create an empty state just once
			// with the main path (/main/personal-area in this case)
			// and replace the top state with this.$router.replace({ name })
			/* istanbul ignore else */
			if (this.$route.name !== 'personal-area') {
				window.history.pushState({}, '', this.$router.resolve({ name: 'personal-area' }).href);
			}

			return this.$router.push({ name }).catch(() => window.history.back());
		},

		openPersonalDetails() {
			return this.goto('personal-details');
		},
	},

	async mounted() {
		const cache = new SessionCache('user');

		// Respondemos primero con caché y después con el resultado de
		// la petición para que al cambiar de página o ver el detalle
		// del usuario no veamos el valor por defecto (false) sino el
		// valor de la última petición realizada.
		this.hasPushEnabled = Boolean(cache.get('push'));
		this.hasPushEnabled = await this.$store.dispatch('userNotifications/getPushNotificationState');
	},
};
</script>

<style lang="scss" scoped>
.v-personal-area__item-header {
	width: 300px;
}

.v-personal-area__item-desc {
	padding-top: 10px;
	@media (hover) {
		cursor: pointer;
	}
}

.v-personal-area__content {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.v-personal-area__list {
	display: flex;
	width: 100%;
	flex-direction: column;
	padding-bottom: var(--safe-area-bottom);
}

@media ($on-tablet) {
	.v-personal-area__list {
		padding-top: 80px;
		padding-bottom: 80px;
	}
}

.v-personal-area__last-access {
	display: flex;
	flex-direction: row;
	background-color: RGB(var(--color-surface-dark));
	padding: 20px;
	position: absolute;
	bottom: var(--safe-area-bottom);
	left: 0;
	right: 0;
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
}

.v-personal-area__last-access-icon {
	font-size: 16px;
	flex-shrink: 0;
	padding-top: 2px;
}

.v-personal-area__last-access-description {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	margin-left: 10px;
}

.v-personal-area__button {
	appearance: none;
	border: 0;
	user-select: none;
	background: transparent;
	text-align: left;
	color: inherit;
	position: relative;
}

.v-persona-area__p {
	margin-bottom: 10px;
}

.v-personal__toggle {
	height: 16px;
}

.v-personal-area__name {
	padding: 10px 0;
}
</style>
