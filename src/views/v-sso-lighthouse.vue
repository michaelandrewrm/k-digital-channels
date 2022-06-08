<template>
	<div class="v-sso-lighthouse">
		<iframe
			class="v-sso-lighthouse__iframe"
			:class="{ '--is-active': !loading }"
			ref="iframe"
			frameborder="0"
		></iframe>
		<div class="v-sso-lighthouse__default-section">
			<div class="v-sso-lighthouse__aqua-logo">
				<span class="v-sso-lighthouse__aqua-icon">
					<c-icon v-if="isBancofar" src="@icons/productBancofar" size="" />
					<c-icon v-else src="@icons/productLineaCaminos" size="" />
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import { mapState } from 'vuex';

export default {
	name: 'v-sso-lighthouse',

	components: {
		CIcon,
	},

	data() {
		return {
			loading: true,
		};
	},

	props: {
		productId: { type: String },
		operative: { type: String },
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

			const { operative, productId } = this;

			const method = 'GET';
			const url = `/products/${productId}/lighthouse-hybridization`;

			const response = await this.$store.dispatch('service/request', {
				service: { request: { url, method } },
				queryParams: { operative },
			});

			const onIframeLoad = () => {
				/* istanbul ignore else */
				if (this.$refs.iframe) {
					this.$refs.iframe.removeEventListener('load', onIframeLoad);
				}
				this.loading = false;
			};

			this.$refs.iframe.src = '';
			this.$refs.iframe.addEventListener('load', onIframeLoad);
			this.$refs.iframe.src = response.data.url;
		},
	},

	mounted() {
		this.getSessionData();
	},
};
</script>

<style lang="scss" scoped>
.v-sso-lighthouse {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.v-sso-lighthouse__iframe {
	width: 100%;
	height: calc(100% - 70px);
	background: RGB(var(--color-surface-dark));
	transition: opacity 400ms 200ms linear;
	opacity: 0;
	padding-bottom: var(--safe-area-bottom);
}

.v-sso-lighthouse__iframe.--is-active {
	opacity: 1;
	z-index: $layer-page-z-index;
}

.v-sso-lighthouse__default-section {
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

.v-sso-lighthouse__aqua-logo {
	opacity: 0.1;
	text-align: center;
	pointer-events: none;
	user-select: none;
}

.v-sso-lighthouse__aqua-icon {
	font-size: 120px;
}
</style>
