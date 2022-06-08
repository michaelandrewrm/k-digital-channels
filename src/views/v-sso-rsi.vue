<template>
	<div class="v-sso-rsi">
		<iframe
			class="v-sso-rsi__iframe"
			:class="{ '--is-active': !loading }"
			ref="iframe"
			frameborder="0"
		></iframe>
		<div class="v-sso-rsi__default-section">
			<div class="v-sso-rsi__aqua-logo">
				<span class="v-sso-rsi__aqua-icon">
					<c-icon v-if="isBancofar" class="v-sso-rsi__mini-icon" src="@icons/productBancofar" />
					<c-icon v-else class="v-sso-rsi__mini-icon" src="@icons/productLineaCaminos" />
				</span>
			</div>
		</div>
		<w-legacy-toolbar-for-bancofar v-if="!isBancofar || (isBancofar && !isPrd)" />
	</div>
</template>

<script>
import { mapState } from 'vuex';
import CIcon from '@components/c-icon';
import WLegacyToolbarForBancofar from '@widgets/w-legacy-toolbar-for-bancofar';

const isPrd = window?.VUE_APP_CONFIG?.env === 'prd';

export default {
	name: 'v-sso-rsi',

	components: {
		CIcon,
		WLegacyToolbarForBancofar,
	},

	data() {
		return {
			loading: true,
			isPrd,
		};
	},

	computed: {
		...mapState('app', ['companyId']),

		isBancofar({ companyId }) {
			return companyId === 'BF';
		},
	},

	methods: {
		async getSessionData() {
			this.loading = true;

			const method = 'GET';
			const url = '/products/sso/rsi';

			const response = await this.$store.dispatch('service/request', {
				service: { request: { url, method } },
			});

			const { coreEBUserId, tokenSSO, usuarioAgente = '' } = response.data;

			const onIframeLoad = () => {
				/* istanbul ignore else */
				if (this.$refs.iframe) {
					this.$refs.iframe.removeEventListener('load', onIframeLoad);
				}
				this.loading = false;
			};

			this.$refs.iframe.src = '';
			this.$refs.iframe.addEventListener('load', onIframeLoad);
			this.$refs.iframe.src = `/sso-rsi-form/${coreEBUserId}/${tokenSSO}/${usuarioAgente}`;
		},
	},

	mounted() {
		this.getSessionData();
	},
};
</script>

<style lang="scss" scoped>
.v-sso-rsi {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.v-sso-rsi__iframe {
	width: 100%;
	height: calc(100% - 70px);
	background: RGB(var(--color-surface-dark));
	transition: opacity 400ms 200ms linear;
	opacity: 0;
	padding-bottom: var(--safe-area-bottom);
}

.v-sso-rsi__iframe.--is-active {
	opacity: 1;
	z-index: $layer-page-z-index;
}

.v-sso-rsi__default-section {
	display: flex;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background: RGB(var(--color-surface));
	color: RGB(var(--color-text-primary));
	z-index: -1;
}

.v-sso-rsi__aqua-logo {
	opacity: 0.1;
	text-align: center;
	pointer-events: none;
	user-select: none;
}

.v-sso-rsi__aqua-icon {
	font-size: 120px;
}
</style>
