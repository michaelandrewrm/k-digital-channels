<template>
	<div class="v-linea-caminos">
		<iframe
			v-if="!isAppleVendor"
			class="v-linea-caminos__iframe"
			:class="{ '--is-active': !loading }"
			ref="iframe"
			frameborder="0"
			:key="action"
		></iframe>
		<div class="v-linea-caminos__default-section">
			<div class="v-linea-caminos__aqua-logo">
				<span class="v-linea-caminos__aqua-icon">
					<c-icon src="@icons/productCaminosEq" size="" />
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import { REQUEST_TIMEOUT } from '@modules/service/constants';
import MSomethingWrong from '@modals/m-something-wrong';
import MConfirmOpenWindow from '@modals/m-confirm-open-window';

const envDomainName =
	window.VUE_APP_CONFIG?.env === 'prd' ? 'www.lineacaminos.com' : 'integracion.grupocaminos.es';

export default {
	name: 'v-linea-caminos',

	components: { CIcon },

	props: {
		action: { type: String, default: 'InitPosicionGlobal' },
	},

	data() {
		return {
			loading: true,
			timer: null,
			siteURL: `https://${envDomainName}/uniscripts/mgrqispi.dll?APPNAME=eFIDES`,
			isAppleVendor: navigator.vendor && navigator.vendor.indexOf('Apple') > -1,
			isHybrid: navigator.userAgent.includes('Skybrid'),
		};
	},

	watch: {
		action: {
			immediate: true,
			async handler(action) {
				const { siteURL, isAppleVendor, isHybrid } = this;
				const target = isAppleVendor ? 'new' : 'iframe';
				const iframeURL = `${siteURL}&PRGNAME=PostMessage`;
				const sessionData = await this.getSessionData();

				if (!sessionData) {
					return;
				}

				const url = `${siteURL}&PRGNAME=${action}&ARGUMENTS=-A${sessionData.sessionID}`;
				const payload = { ...sessionData, url };

				if (isHybrid) {
					return window.dispatchEvent(
						new CustomEvent('open-new-window', { detail: { iframeURL, payload } })
					);
				}

				if (target === 'iframe') {
					this.$refs.iframe.src = '';
					const onIframeLoad = () => {
						this.$refs.iframe.removeEventListener('load', onIframeLoad);
						this.postMessage(this.$refs.iframe.contentWindow, payload);
					};
					this.$refs.iframe.addEventListener('load', onIframeLoad);
					this.$refs.iframe.src = iframeURL;
					this.timer = setTimeout(this.openSomethingWrongModal, 10000);
				} else {
					const confirmation = await this.$store.dispatch('modal/open', MConfirmOpenWindow);

					if (!confirmation) {
						return this.$router.back();
					}

					const newWindow = window.open(iframeURL, `linea_caminos_${action}`);
					/**
					 * Si no se configura el destino correctamente para permitir
					 * el acceso por cross-domain en el CSP no hay manera de saber
					 * cuándo se ha terminado de cargar la página para enviar el
					 * mensaje. Entonces, esperamos dos segundos y con suerte ya
					 * se habrá cargado la página 🤷‍♂️.
					 */
					setTimeout(this.postMessage, 2000, newWindow, payload);
				}
			},
		},
	},

	methods: {
		getSessionData() {
			this.loading = true;
			return this.$store
				.dispatch('user/ssoLogin')
				.then(({ data: { sessionId, cookie } }) => {
					return { sessionID: sessionId, cookie };
				})
				.catch((err) => {
					/* istanbul ignore else */
					if (err?.code !== REQUEST_TIMEOUT || err?.status >= 500) {
						this.openSomethingWrongModal();
					}
				});
		},

		postMessage(target, payload) {
			target.postMessage(payload, '*');

			clearTimeout(this.timer);
			this.timer = setTimeout(this.openSomethingWrongModal, 10000);
		},

		receiveMessage(event) {
			/* istanbul ignore else */
			if (event?.data?.status === 'ready') {
				clearTimeout(this.timer);
				this.loading = false;
			}
		},

		async openSomethingWrongModal() {
			await this.$store.dispatch('modal/open', MSomethingWrong);

			if (this.isHybrid) {
				return window.postMessage({ name: 'bridge-exit-app' }, '*');
			}

			return this.$router.back();
		},
	},

	beforeMount() {
		window.addEventListener('message', this.receiveMessage);
	},

	destroyed() {
		clearTimeout(this.timer);
		window.removeEventListener('message', this.receiveMessage);
	},
};
</script>

<style lang="scss" scoped>
.v-linea-caminos {
	width: 100%;
	height: 100%;
}

.v-linea-caminos__loading {
	display: flex;
	position: relative;
	width: 100%;
	height: 100%;
	background: RGB(var(--color-surface-dark));
}

.v-linea-caminos__iframe {
	width: 100%;
	height: 100%;
	background: RGB(var(--color-surface-dark));
	transition: opacity 400ms 200ms linear;
	opacity: 0;
	padding-bottom: var(--safe-area-bottom);
}

.v-linea-caminos__iframe.--is-active {
	opacity: 1;
	z-index: $layer-page-z-index;
}

.v-linea-caminos__default-section {
	display: flex;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background: RGB(var(--color-surface-dark));
	color: RGB(var(--color-text-primary));
	z-index: -1;
}

.v-linea-caminos__aqua-logo {
	opacity: 0.1;
	text-align: center;
	pointer-events: none;
	user-select: none;
}

.v-linea-caminos__aqua-icon {
	font-size: 120px;
}
</style>
