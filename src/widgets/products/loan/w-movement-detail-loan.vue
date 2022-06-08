<template>
	<section>
		<c-list-icon-item
			class="w-movement-detail-loan__item"
			v-if="movement.operationDate"
			:title="$t('MOVEMENT.OPERATION_DATE')"
			:description="$d(new Date(movement.operationDate), 'numeric')"
			icon="@icons/calendar"
		/>

		<c-list-icon-item
			class="w-movement-detail-loan__item"
			v-if="movement.amount"
			:title="$t('DETAIL.INVOICED_AMOUNT')"
			:description="$nc(movement.amount)"
			icon="@icons/wallet"
		/>
		<c-list-icon-item
			class="w-movement-detail-loan__item"
			v-if="movement.pendingAmount"
			:title="$t('DETAIL.PENDING_AMOUNT')"
			:description="$nc(movement.pendingAmount)"
			icon="@icons/walletMoney"
		/>
		<c-list-icon-item
			class="w-movement-detail-loan__item"
			v-if="movement.installmentAmount"
			:title="$t('DETAIL.INSTALLMENT_AMOUNT')"
			:description="$nc(movement.installmentAmount)"
			icon="@icons/wallet"
		/>
		<c-list-icon-item
			class="w-movement-detail-loan__item"
			v-if="movement.interesAmount"
			:title="$t('DETAIL.INTEREST_AMOUNT')"
			:description="$nc(movement.interesAmount)"
			icon="@icons/wallet"
		/>
		<c-list-icon-item
			class="w-movement-detail-loan__item"
			v-if="movement.expensesAmount"
			:title="$t('DETAIL.EXPENSES_AMOUNT')"
			:description="$nc(movement.expensesAmount)"
			icon="@icons/wallet"
		/>
	</section>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'w-movement-detail-loan',

	components: {
		CListIconItem,
	},

	props: {
		movement: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-detail-loan__item:not(:last-child) {
	margin-bottom: 18px;
}
</style>
