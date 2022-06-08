<template>
	<div class="w-widget-composition">
		<c-acrylic-sheet @expand="$emit('expand')">
			<c-icon :src="icon" size="" slot="icon" />

			<span
				data-testid="type"
				class="w-widget-composition__title text-fixed-m-medium"
				v-if="source.type"
			>
				{{ $t(`MY_PRODUCT.INVESTMENT-ACCOUNT.ASSET-TYPE.${source.type}`) }}
			</span>
			<span
				data-testid="balance"
				class="w-widget-composition__balance text-fixed-l-bold"
				v-if="source.balance"
			>
				{{ $nc(source.balance) }}
			</span>
		</c-acrylic-sheet>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import iconIIC from '@icons/productBroker';
import iconPLP from '@icons/productPlans';
import iconRF from '@icons/productFunds';

export default {
	name: 'w-widget-composition',

	components: {
		CAcrylicSheet,
		CIcon,
	},

	props: {
		source: { type: Object },
		active: { type: Boolean },
	},

	computed: {
		icon({ source }) {
			return {
				IIC: iconIIC,
				PLP: iconPLP,
				RF: iconRF,
				RV: iconRF,
			}[source.type];
		},
	},
};
</script>

<style lang="scss" scoped>
.w-widget-composition {
	width: 300px;
}

.w-widget-composition__title {
	margin-bottom: 10px;
	margin-right: 30px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.w-widget-composition__balance {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}
</style>
