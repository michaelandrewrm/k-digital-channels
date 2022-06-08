<template>
	<l-details>
		<h1 slot="header" tabindex="-1">{{ $t('MOVEMENT.BROKER_COMPOSITION') }}</h1>

		<div class="v-investment-asset__header" slot="widget">
			<c-translide>
				<w-asset-sheet-investment-portfolio v-if="asset && !loading" :source="asset" />
			</c-translide>
		</div>

		<c-translide>
			<div class="v-investment-asset__limit" v-if="loading || asset || error">
				<transition name="placeholder" mode="out-in">
					<w-asset-detail-investment-portfolio
						v-if="asset && !loading"
						data-testid="investment-portfolio-detail"
						:source="asset"
					/>

					<div class="v-investment-asset__error" v-if="error" data-testid="detail-error">
						<c-icon class="v-investment-asset__error-icon" src="@icons/modalExclamation" />

						<p class="text-m-book v-investment-asset__error-text">
							{{ $t('MOVEMENT.DETAIL_ERROR') }}
							<a href="#" class="v-investment-asset__error-link" @click="fetch">
								{{ $t('RETRY') }}
							</a>
						</p>
					</div>

					<c-placeholder-item v-if="loading" key="placeholder" />
				</transition>

				<transition name="placeholder">
					<c-placeholder-item v-if="loading" />
				</transition>

				<transition name="placeholder">
					<c-placeholder-item v-if="loading" />
				</transition>
			</div>
		</c-translide>
	</l-details>
</template>

<script>
import CPlaceholderItem from '@components/c-placeholder-item';
import CTranslide from '@components/c-translide';
import CIcon from '@components/c-icon';
import LDetails from '@layouts/l-details';
import WAssetDetailInvestmentPortfolio from '@widgets/products/investment-portfolio/w-asset-detail-investment-portfolio';
import WAssetSheetInvestmentPortfolio from '@widgets/products/investment-portfolio/w-asset-sheet-investment-portfolio';

import moduleProducts from '@modules/products/m-products';

export default {
	name: 'v-investment-asset',

	modules: {
		products: moduleProducts,
	},

	components: {
		LDetails,
		CTranslide,
		CPlaceholderItem,
		CIcon,
		WAssetDetailInvestmentPortfolio,
		WAssetSheetInvestmentPortfolio,
	},

	data() {
		return {
			asset: null,
			loading: false,
			timerLoading: null,
			timerRefresh: null,
			error: false,
		};
	},

	props: {
		productId: { type: String, required: true },
		assetId: { type: String, required: true },
	},

	watch: {
		assetId: {
			immediate: true,
			handler() {
				const { productId, assetId, loading } = this;

				/* istanbul ignore else */
				if (productId && assetId && !loading) {
					clearTimeout(this.timerRefresh);
					this.timerRefresh = setTimeout(this.fetch, 50);
				}
			},
		},

		productId: {
			immediate: true,
			handler() {
				const { productId, assetId, loading } = this;

				/* istanbul ignore else */
				if (productId && assetId && !loading) {
					clearTimeout(this.timerRefresh);
					this.timerRefresh = setTimeout(this.fetch, 50);
				}
			},
		},
	},

	methods: {
		async fetch() {
			const { productId, assetId } = this;

			/* istanbul ignore next */
			if (!productId || !assetId) {
				return;
			}

			this.error = false;

			clearTimeout(this.timerLoading);
			this.timerLoading = setTimeout(() => {
				this.timerLoading = null;
				this.loading = true;
			}, 200);

			this.$store
				.dispatch('products/get', productId)
				.then((source) => {
					this.asset = source.assets.find(({ isin }) => isin === this.assetId);
				})
				.catch(() => {
					this.error = true;
				})
				.finally(() => {
					clearTimeout(this.timerLoading);
					this.timerLoading = null;
					this.loading = false;
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.v-investment-asset__header {
	margin-left: 20px;
	margin-right: 20px;
	max-width: 400px;
	flex-grow: 1;
	width: 100%;
}

.v-investment-asset__error {
	text-align: center;
	margin: 10px 0;
}

.v-investment-asset__limit {
	max-width: 400px;
	margin: 0 auto;
}

.v-investment-asset__error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.v-investment-asset__error-link {
	text-decoration: underline;
	display: block;
}

.placeholder-enter {
	opacity: 0;
	transform: translateY(-5px);
}

.placeholder-leave-active {
	opacity: 0;
	transform: translateY(40%);
}

.placeholder-enter-active {
	transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
}

.placeholder-leave-active {
	transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
	transition-delay: 400ms;
}

.placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 200ms;
}

.placeholder-leave-active ~ .placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 0ms;
}
</style>
