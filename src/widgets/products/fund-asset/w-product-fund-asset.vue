<template>
	<div class="w-product-fund-asset">
		<c-acrylic-sheet :actionable="active" @expand="openDetails">
			<c-icon src="@icons/productFunds" size="" slot="icon" />

			<span class="w-product-fund-asset__title text-fixed-m-medium" v-if="product.alias">
				{{ product.alias }}
			</span>

			<span class="w-product-fund-asset__balance text-fixed-l-bold" v-if="product.balance">
				{{ $nc(product.balance) }}
			</span>

			<span v-if="product.unityQuantity" class="w-product-fund-asset__unity-quantity text-s-light">
				{{
					$t('FUNDS.UNITY_QUANTITY', {
						value: $n(product.unityQuantity, { minimumFractionDigits: 6 }),
					})
				}}
			</span>

			<span
				v-if="product.liquidationValue"
				data-testid="liquidation-value"
				class="w-product-fund-asset__liquidation-value text-s-medium"
			>
				{{
					$t('FUNDS.LIQUIDATION_VALUE', {
						value: $nc(product.liquidationValue, { minimumFractionDigits: 6 }),
					})
				}}
			</span>

			<div
				slot="footer"
				class="w-product-fund-asset__quantity text-m-book"
				:tabindex="active - 1"
				data-testid="info-icon"
				@click="openProfitabilityInfo"
				@keypress.enter="openProfitabilityInfo"
			>
				<div class="w-product-fund-asset__quantity_input">
					{{ $t('MOVEMENT.ASSETS.PROFITABILITY.TITLE') }}
					{{ $n(product.costEffectiveness, '%') }}
					<c-icon src="@icons/info" class="w-product-fund-asset__quantity_icon" size="l" />
				</div>
			</div>
		</c-acrylic-sheet>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import MFundProfitability from '@modals/m-fund-profitability';

import { subtypesById } from '@modules/products/product-subtypes';

export default {
	name: 'w-product-fund-asset',

	components: {
		CAcrylicSheet,
		CIcon,
	},

	props: {
		product: { type: Object },
		active: { type: Boolean },
	},

	methods: {
		openProfitabilityInfo() {
			return this.$store.dispatch('modal/open', MFundProfitability);
		},

		openDetails() {
			const { product } = this;
			const productId = `${product.productId}/assets/${product.id}`;
			let { productFamily } = product;

			/* istanbul ignore next */
			if (productFamily === 'managed-product') {
				productFamily = subtypesById[(product.productSubtype?.id)];
			}

			return this.$router.push({
				name: 'product-detail',
				params: { productId, familyId: `${productFamily}-asset` },
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.w-product-fund-asset {
	width: 300px;
}

.w-product-fund-asset__title {
	margin-bottom: 10px;
	margin-right: 30px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.w-product-fund-asset__balance {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
}

.w-product-fund-asset__subtitle {
	display: flex;
	align-items: flex-end;
}

.w-product-fund-asset__unity-quantity {
	display: inline-flex;
	width: fit-content;
	margin-bottom: 10px;
	padding: 4px 6px;
	border-radius: $border-radius-l;
	background-color: RGBA(var(--color-text-primary-light), 0.17);
}

.w-product-fund-asset__quantity {
	position: relative;
	padding: 10px;
	border-bottom-left-radius: $border-radius-l;
	border-bottom-right-radius: $border-radius-l;
	background-color: RGBA(var(--color-primary), 0.9);
}

.w-product-fund-asset__quantity_input {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	text-align: right;
	overflow: hidden;
}

.w-product-fund-asset__quantity_icon {
	margin-left: 10px;
	@media (hover) {
		& {
			cursor: pointer;
		}
	}
}
</style>
