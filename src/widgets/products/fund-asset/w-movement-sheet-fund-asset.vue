<template>
	<c-acrylic-sheet :dotted="true">
		<c-icon src="@icons/productReceipt" size="" slot="icon" />

		<span class="w-movement-sheet-fund-asset__reason text-m-medium">
			{{ movement.reason }}
		</span>

		<span class="w-movement-sheet-fund-asset__amount text-l-bold" v-if="movement.amount">
			{{ $nc(movement.amount) }}
		</span>

		<span class="w-movement-sheet-fund-asset__reason text-s-medium">{{ movement.name }}</span>

		<span class="w-movement-sheet-fund-asset__unity-quantity text-s-light">
			{{
				$t('FUNDS.UNITY_QUANTITY', {
					value: $n(movement.unityQuantity, { minimumFractionDigits: 6 }),
				})
			}}
		</span>
	</c-acrylic-sheet>
</template>

<script>
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';

export default {
	name: 'w-movement-sheet-fund-asset',

	components: {
		CAcrylicSheet,
		CIcon,
	},

	props: {
		movement: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-sheet-fund-asset__title,
.w-movement-sheet-fund-asset__amount,
.w-movement-sheet-fund-asset__reason {
	margin-bottom: 10px;
}

.w-movement-sheet-fund-asset__unity-quantity {
	display: inline-flex;
	width: fit-content;
	padding: 4px 6px;
	border-radius: $border-radius-l;
	background-color: RGBA(var(--color-text-primary-light), 0.17);
}
</style>
