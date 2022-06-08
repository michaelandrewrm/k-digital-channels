<template>
	<div class="w-product-endorsement">
		<c-acrylic-sheet :actionable="active" @expand="$emit('expand')">
			<c-icon src="@icons/productAval" size="" slot="icon" />

			<span class="w-product-endorsement__title text-s-book" v-if="product.alias">
				{{ product.alias }}
			</span>
			<span class="w-product-endorsement__sub-title text-m-medium" v-if="product.name">
				{{ product.name }}
			</span>
			<span class="w-product-endorsement__balance text-l-bold" v-if="product.balance">
				{{ $nc(product.balance) }}
			</span>
			<span class="w-product-endorsement__balance-title text-s-book" v-if="product.balance">
				{{ $t('DETAIL.GRANTED') }}
			</span>
			<!-- <span v-if="product.id" class="w-product-endorsement__number text-fixed-s-medium">
				{{ $t('DETAIL.PRODUCT_ENDORSEMENT_NUMBER', { value: $n(product.id) }) }}
			</span> -->
		</c-acrylic-sheet>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import CAcrylicSheet from '@components/c-acrylic-sheet';

export default {
	name: 'w-product-endorsement',

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
.w-product-endorsement {
	width: 300px;
}

.w-product-endorsement__title,
.w-product-endorsement__sub-title {
	margin-right: 30px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.w-product-endorsement__sub-title {
	margin-bottom: 10px;
}

.w-product-endorsement__balance {
	display: flex;
	align-items: center;
}

.w-product-endorsement__number {
	display: inline-flex;
	width: fit-content;
	margin: 10px 0;
	padding: 4px 6px;
	border-radius: $border-radius-l;
	background-color: RGBA(var(--color-text-primary-light), 0.17);
}
</style>
