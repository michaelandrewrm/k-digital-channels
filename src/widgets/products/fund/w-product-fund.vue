<template>
	<div class="w-product-fund">
		<c-acrylic-sheet :actionable="active" @expand="$emit('expand')">
			<c-icon src="@icons/productFunds" size="" slot="icon" />

			<span class="w-product-fund__title text-fixed-m-medium" v-if="product.alias">
				{{ product.alias }}
			</span>

			<span class="w-product-fund__balance text-fixed-l-bold" v-if="product.balance">
				{{ $nc(product.balance) }}
			</span>

			<span
				class="w-product-fund__subtitle text-fixed-s-medium"
				v-if="product.productNumber"
				aria-hidden="true"
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
	name: 'w-product-fund',

	components: {
		CAcrylicSheet,
		CIcon,
	},

	props: {
		product: {
			type: Object,
		},

		active: {
			type: Boolean,
		},
	},
};
</script>

<style lang="scss" scoped>
.w-product-fund {
	width: 300px;
}

.w-product-fund__title {
	margin-bottom: 10px;
	margin-right: 30px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.w-product-fund__balance {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
}

.w-product-fund__subtitle {
	display: flex;
	align-items: flex-end;
}
</style>
