<template>
	<div class="w-product-investment-account-portfolio">
		<c-acrylic-sheet :actionable="active" @expand="$emit('expand')">
			<c-icon src="@icons/productFunds" size="" slot="icon" />

			<span
				data-testid="alias"
				class="w-product-investment-account-portfolio__title text-fixed-m-medium"
				v-if="product.alias"
			>
				{{ product.alias }}
			</span>
			<span
				data-testid="balance"
				class="w-product-investment-account-portfolio__balance text-fixed-l-bold"
				v-if="product.balance"
			>
				{{ $nc(product.balance) }}
			</span>
			<span
				data-testid="product-number"
				class="w-product-investment-account-portfolio__balance text-fixed-m-book"
			>
				{{ $pn(product.productNumber) }}
			</span>
		</c-acrylic-sheet>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import CAcrylicSheet from '@components/c-acrylic-sheet';

export default {
	name: 'w-product-investment-portfolio',

	components: {
		CAcrylicSheet,
		CIcon,
	},

	props: {
		product: { type: Object },
		active: { type: Boolean },
	},
};
</script>

<style lang="scss" scoped>
.w-product-investment-account-portfolio {
	width: 300px;
}

.w-product-investment-account-portfolio__title {
	margin-bottom: 10px;
	margin-right: 30px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.w-product-investment-account-portfolio__balance {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}
</style>
