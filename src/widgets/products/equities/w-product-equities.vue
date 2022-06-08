<template>
	<div class="w-product-equities">
		<c-acrylic-sheet :actionable="active" @expand="$emit('expand')">
			<c-icon src="@icons/productBroker" size="" slot="icon" />

			<span class="w-product-equities__title text-fixed-m-medium" v-if="product.alias">
				{{ product.alias }}
			</span>
			<span class="w-product-equities__balance text-fixed-l-bold" v-if="product.balance">
				{{ $nc(product.balance) }}
			</span>
		</c-acrylic-sheet>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import CAcrylicSheet from '@components/c-acrylic-sheet';

export default {
	name: 'w-product-equities',

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
.w-product-equities {
	width: 300px;
}

.w-product-equities__title {
	margin-bottom: 10px;
	margin-right: 30px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.w-product-equities__balance {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}
</style>
