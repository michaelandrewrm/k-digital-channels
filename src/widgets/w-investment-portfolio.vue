<template>
	<div class="w-investment-portfolio">
		<transition name="placeholder" mode="out-in">
			<div v-if="source && !loading">
				<div v-for="assetType in group" :key="assetType.type">
					<w-asset-item
						data-testid="portfolio-composition"
						:product-id="productId"
						:type="type"
						:asset-type="assetType.type"
						:asset-balance="assetType.balance"
					></w-asset-item>
				</div>
			</div>

			<div class="w-investment-portfolio__error" v-if="error" data-testid="portfolio-detail-error">
				<c-icon class="w-investment-portfolio__error-icon" src="@icons/modalExclamation" />

				<p class="text-m-book w-investment-portfolio__error-text">
					{{ $t('MOVEMENT.DETAIL_ERROR') }}
					<a href="#" class="w-investment-portfolio__error-link" @click="fetch">
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
</template>

<script>
import CIcon from '@components/c-icon';
import CPlaceholderItem from '@components/c-placeholder-item';
import WAssetItem from '@widgets/products/investment-portfolio/w-asset-item-investment-portfolio';

import moduleProducts from '@modules/products/m-products';

export default {
	name: 'w-investment-portfolio',

	components: {
		CPlaceholderItem,
		CIcon,
		WAssetItem,
	},

	modules: {
		products: moduleProducts,
	},

	props: {
		type: { type: String },
		productId: { type: String, required: true },
	},

	data() {
		return {
			source: null,
			loading: false,
			timerLoading: null,
			error: false,
		};
	},

	computed: {
		group({ source }) {
			return source.assets.reduce((reducer, { productTypeCode, marketPrice, availableTitles }) => {
				if (reducer[productTypeCode]) {
					reducer[productTypeCode].balance.amount += availableTitles * marketPrice.amount; // eslint-disable-line no-param-reassign
				} else {
					// eslint-disable-next-line no-param-reassign
					reducer[productTypeCode] = {
						type: productTypeCode,
						balance: {
							currency: marketPrice.currency,
							amount: availableTitles * marketPrice.amount,
						},
					};
				}

				return reducer;
			}, {});
		},
	},

	watch: {
		productId: {
			immediate: true,
			handler: 'fetch',
		},
	},

	methods: {
		fetch() {
			this.error = false;

			clearTimeout(this.timerLoading);
			this.timerLoading = setTimeout(() => {
				this.timerLoading = null;
				this.loading = true;
			}, 200);

			this.$store
				.dispatch('products/get', this.productId)
				.then((product) => {
					/* istanbul ignore else */
					if (product) {
						this.source = product;
					}
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
.w-investment-portfolio__error {
	text-align: center;
	margin: 10px 0;
}

.w-investment-portfolio__error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.w-investment-portfolio__error-link {
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

.w-investment-portfolio__list.placeholder-leave-active {
	transform: translateY(0);
	transition: opacity 0s ease-in-out;
	transition-delay: 0ms;
}
</style>
