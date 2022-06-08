<template>
	<div class="w-product-pending-movements">
		<c-acrylic-sheet>
			<c-icon src="@icons/plane" size="" slot="icon" />

			<span v-if="product.alias" class="w-product-pending-movements__title text-fixed-m-medium">
				{{ product.alias }}
			</span>
			<span v-if="product.balance" class="w-product-pending-movements__balance text-fixed-l-bold">
				{{ $nc(product.balance) }}
			</span>
		</c-acrylic-sheet>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import CAcrylicSheet from '@components/c-acrylic-sheet';

export default {
	name: 'w-product-pending-movements',

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
.w-product-pending-movements {
	width: 300px;
}

.w-product-pending-movements__title {
	margin-bottom: 10px;
	margin-right: 30px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.w-product-pending-movements__balance {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}
</style>
