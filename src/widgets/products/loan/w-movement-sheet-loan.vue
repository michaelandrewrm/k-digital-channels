<template>
	<c-acrylic-sheet :dotted="true">
		<c-icon src="@icons/productReceipt" size="" slot="icon" />

		<span class="w-movement-sheet-loan__reason text-fixed-m-medium" v-if="movement.reason">
			{{ loanReason }}
		</span>

		<span class="text-fixed-l-bold" v-if="movement.amount">
			{{ $nc(movement.amount) }}
		</span>
	</c-acrylic-sheet>
</template>

<script>
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';

export default {
	name: 'w-movement-sheet-loan',

	components: {
		CAcrylicSheet,
		CIcon,
	},

	props: {
		movement: {
			type: Object,
		},
	},

	computed: {
		loanReason({ movement }) {
			const { reason } = movement;

			const types = [
				'ORIGINATION',
				'LIQUIDATION',
				'CANCELATION',
				'REPAYMENT',
				'LIMIT_INCREASE',
				'LIMIT_REDUCTION',
				'PARTIAL_DISPOSAL',
				'TAX_CHARGE',
			];

			if (!types.includes(reason)) {
				return reason;
			}

			return this.$t(`LOAN.TYPE.${reason}`);
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-sheet-loan__reason {
	margin-bottom: 10px;
}
</style>
