<template>
	<div id="vuesoma">
		<img
			class="printable-logo media-screen-hide"
			src="@local-assets/img/logo-horizontal-alt.svg"
			alt=""
			aria-hidden="true"
		/>
		<span class="printable-margin-text media-screen-hide" aria-hidden="true">
			{{ legalIdentity }}
		</span>
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
import MConfirm from '@modals/m-confirm';
import { importLocale } from '@locales/setup';

const oneSecond = 1000;

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
			alertSessionTimeout: 0,

			// Minutos sin actividad de red para que una sesión expire:
			MAX_MINUTES_FOR_SESSION_EXPIRATION: 10,

			// Minutos sin actividad de red para alertar de la próxima expiración:
			MAX_MINUTES_FOR_SESSION_EXPIRATION_ALERT: 9,
		};
	},

	computed: {
		...mapState('authn', ['loggedIn']),
		...mapState('session', ['theme', 'lang']),
		...mapState('app', ['legalIdentity']),
		...mapState('loading', ['status']),
		...mapState('service', ['lastRequestTimestamp']),
		...mapState('device', ['isPWA']),

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
	},

	watch: {
		isPWA(value) {
			/* istanbul ignore else */
			if (value) {
				document.addEventListener(
					'contextmenu',
					(e) => {
						/* istanbul ignore next */
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
				clearInterval(this.alertSessionTimeout);

				/* istanbul ignore else */
				if (this.$route.name !== 'login') {
					this.$router.push({ name: 'login' });
				}
			} else {
				this.expiredSessionTimeOut = setInterval(this.checkForSessionExpiration, oneSecond);
				this.alertSessionTimeout = setInterval(this.alertForSessionAboutToExpire, oneSecond);
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

	methods: {
		async alertForSessionAboutToExpire() {
			const {
				$store: { dispatch },
				lastRequestTimestamp,
			} = this;
			const minutesFromLastRequest =
				(new Date(Date.now()).getTime() - lastRequestTimestamp) / 1000 / 60;

			/* istanbul ignore else */
			if (minutesFromLastRequest > this.MAX_MINUTES_FOR_SESSION_EXPIRATION_ALERT) {
				const props = {
					title: this.$t('INFO.SESSION_ABOUT_EXPIRE.TITLE'),
					text: this.$t('INFO.SESSION_ABOUT_EXPIRE.DESC'),
					acceptText: this.$t('ACTIONS.CONTINUE_SESSION'),
					cancelText: this.$t('ACTIONS.CLOSE_SESSION'),
				};

				clearInterval(this.alertSessionTimeout);
				const confirmation = await dispatch('modal/open', { component: MConfirm, props });

				// Si el usuario le da a "Continuar sesión" o cierra la modal, refresca la sesión
				if (confirmation || confirmation === null) {
					dispatch('authn/refresh');
					this.alertSessionTimeout = setInterval(this.alertForSessionAboutToExpire, oneSecond);
				} else {
					dispatch('authn/logout');
				}
			}
		},

		async checkForSessionExpiration() {
			const {
				$store: { dispatch },
				lastRequestTimestamp,
			} = this;
			const minutesFromLastRequest =
				(new Date(Date.now()).getTime() - lastRequestTimestamp) / 1000 / 60;

			/* istanbul ignore else */
			if (minutesFromLastRequest > this.MAX_MINUTES_FOR_SESSION_EXPIRATION) {
				dispatch('bugsnag/log', {
					type: 'log',
					title: 'Session expired after 10 mins of network inactivity',
				});
				dispatch('authn/passiveLogout');
			}
		},
	},

	created() {
		this.$router.afterEach((to, from) => {
			this.$store.dispatch('bugsnag/log', {
				type: 'navigation',
				title: 'Router push',
				from: from.path,
				to: to.path,
			});

			this.$nextTick(() => {
				window.dispatchEvent(
					new CustomEvent('bridge-router-nav', { detail: { name: to.name, fullPath: to.fullPath } })
				);
			});
		});
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

:not([tabindex='-1']):focus:focus-visible::before {
	content: '';
	display: block;
	position: absolute;
	border-radius: var(--focus-ring-radius, inherit);
	top: calc(-1 * var(--focus-ring-padding, 0px) - 1px);
	bottom: calc(-1 * var(--focus-ring-padding, 0px) - 1px);
	left: calc(-1 * var(--focus-ring-padding, 0px) - 1px);
	right: calc(-1 * var(--focus-ring-padding, 0px) - 1px);
	border: 1px solid RGB(var(--color-focus-ring));
	box-shadow: 0 0 0 1px RGB(var(--color-focus-ring));
}

@media (pointer: fine), (hover) {
	::-webkit-scrollbar {
		width: 16px;
	}

	::-webkit-scrollbar-thumb {
		border-radius: 10px;
		box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2),
			inset 0 0 0 30px RGBA(var(--color-text-primary), 0.3);
		border: 4px solid transparent;
	}

	::-webkit-scrollbar-thumb:window-inactive {
		visibility: hidden;
	}
}

.media-screen-hide {
	display: none !important;
}

@media print {
	body {
		--color-gradient-header: none;
		background: white !important;
	}

	.media-screen-hide {
		display: block !important;
	}

	.media-print-hide {
		display: none !important;
	}

	.printable-margin-text {
		position: fixed;
		z-index: 10;
		left: 0;
		top: 0;
		bottom: 0;
		text-align: center;
		writing-mode: vertical-rl;
		transform: rotate(-180deg);
		color: RGB(var(--color-text-primary));
		opacity: 0.6;
	}

	.printable-logo {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		height: 32px;
	}
}
</style>
