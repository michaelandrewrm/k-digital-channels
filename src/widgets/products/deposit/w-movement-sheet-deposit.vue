<template>
	<c-acrylic-sheet :dotted="true">
		<c-icon src="@icons/productReceipt" size="" slot="icon" />

		<span class="w-movement-sheet-deposit__reason text-fixed-m-medium" v-if="movement.reason">
			{{ movement.reason }}
		</span>

		<span class="text-fixed-l-bold" v-if="movement.amount">
			{{ $nc(movement.amount, { sign: true }) }}
		</span>

		<span class="text-fixed-l-bold" v-if="movement.impositionAmount">
			{{ $nc(movement.impositionAmount, { sign: true }) }}
		</span>

		<span class="w-movement-sheet-deposit__interest text-fixed-s-book" v-if="movement.typeInterest">
			{{ $t('DETAIL.INTEREST_TYPE').concat(':') }} {{ movement.typeInterest }}
		</span>

		<span class="w-movement-sheet-deposit__balance text-fixed-s-book" v-if="movement.balance">
			{{ $t('MOVEMENT.BALANCE').concat(':') }} {{ $nc(movement.balance) }}
		</span>
	</c-acrylic-sheet>
</template>

<script>
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';

export default {
	name: 'w-movement-sheet-deposit',

	components: { CAcrylicSheet, CIcon },

	props: { movement: Object },
};
</script>

<style lang="scss" scoped>
.w-movement-sheet-deposit__reason {
	margin-bottom: 10px;
}

.w-movement-sheet-deposit__balance,
.w-movement-sheet-deposit__interest {
	margin-top: 10px;
}
</style>
