<template>
	<c-acrylic-sheet :dotted="true">
		<c-icon src="@icons/productReceipt" size="" slot="icon" />

		<span class="w-movement-sheet-account__row text-fixed-m-medium" v-if="movement.reason">
			{{ movement.reason }}
		</span>

		<span class="w-movement-sheet-account__row text-fixed-l-bold" v-if="movement.amount">
			{{ $nc(movement.amount) }}
		</span>

		<span
			data-testid="account-detail"
			class="w-movement-sheet-account__row text-m-medium"
			v-if="movement.accountName && movement.balance"
		>
			{{ movement.accountName.concat(': ') }} {{ $nc(movement.balance) }}
		</span>
	</c-acrylic-sheet>
</template>

<script>
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';

export default {
	name: 'w-movement-sheet-account',

	components: {
		CAcrylicSheet,
		CIcon,
	},

	props: {
		movement: { type: Object },
	},
};
</script>

<style lang="scss" scoped>
.w-movement-sheet-account__row:not(:last-child) {
	margin-bottom: 10px;
}
</style>
