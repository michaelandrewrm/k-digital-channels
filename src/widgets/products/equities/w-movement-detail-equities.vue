<template>
	<section>
		<c-list-icon-item
			class="w-movement-detail-equities__item media-screen-hide"
			v-if="movement.amount"
			:title="$t('MOVEMENT.AMOUNT')"
			:description="$nc(movement.amount)"
			icon="@icons/walletMoney"
		/>

		<c-list-icon-item
			class="w-movement-detail-equities__item media-screen-hide"
			v-if="movement.reason"
			:title="$t('TRANSFERS.REASON')"
			:description="movement.reason"
			icon="@icons/paper"
		/>

		<c-list-icon-item
			class="w-movement-detail-equities__item media-screen-hide"
			v-if="movement.isin"
			:title="$t('DETAIL.ISIN')"
			:description="`${movement.isin} / ${movement.name}`"
			icon="@icons/paper"
		/>

		<c-list-icon-item
			class="w-movement-detail-equities__item"
			v-if="movement.operationDate"
			:title="$t('MOVEMENT.OPERATION_DATE')"
			:description="$d(new Date(movement.operationDate), 'numeric')"
			icon="@icons/calendar"
		/>

		<c-list-icon-item
			class="w-movement-detail-equities__item"
			v-if="movement.unityQuantity"
			:title="$t('MOVEMENT.EQUITIES_NUMBER')"
			:description="$n(movement.unityQuantity)"
			icon="@icons/accountUnit"
		/>

		<c-list-icon-item
			class="w-movement-detail-equities__item"
			v-if="movement.originMovementAmount"
			:title="$t('MOVEMENT.PRICE')"
			:description="$nc(movement.originMovementAmount)"
			icon="@icons/wallet"
		/>

		<c-list-icon-item
			class="w-movement-detail-equities__item"
			v-if="movement.price"
			:title="$t('MOVEMENT.PRICE')"
			:description="$nc(movement.price)"
			icon="@icons/wallet"
		/>

		<c-list-icon-item
			class="w-movement-detail-equities__item"
			v-if="movement.change"
			:title="$t('MOVEMENT.PRICE')"
			:description="`${$nc(movement.change)} / ${$nc({ amount: 1, currency: { id: 'EUR' } })}`"
			icon="@icons/wallet"
		/>

		<c-list-icon-item
			class="w-movement-detail-equities__item"
			v-if="movement.liquidAmount"
			:title="$t('MOVEMENT.LIQUID_AMOUNT')"
			:description="$nc(movement.liquidAmount)"
			icon="@icons/walletMoney"
		/>

		<c-list-icon-item
			class="w-movement-detail-equities__item"
			v-if="movement.comisionsRetentions"
			:title="$t('MOVEMENT.COMMISSIONS')"
			:description="$nc(movement.comisionsRetentions)"
			icon="@icons/valueAccountUnit"
		/>
	</section>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'w-movement-detail-equities',

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
.w-movement-detail-equities__item:not(:last-child) {
	margin-bottom: 18px;
}
</style>
