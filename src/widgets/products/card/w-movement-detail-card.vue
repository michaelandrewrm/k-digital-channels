<template>
	<section>
		<c-list-icon-item
			class="w-movement-detail-card__item"
			v-if="movement.id"
			:title="$t('MOVEMENT.ID')"
			:description="movement.id"
			icon="@icons/paper"
		/>

		<c-list-icon-item
			class="w-movement-detail-card__item media-screen-hide"
			v-if="movement.amount"
			:title="$t('MOVEMENT.AMOUNT')"
			:description="$nc(movement.amount)"
			icon="@icons/walletMoney"
		/>

		<c-list-icon-item
			class="w-movement-detail-card__item media-screen-hide"
			v-if="movement.reason"
			:title="$t('TRANSFERS.REASON')"
			:description="movement.reason"
			icon="@icons/paper"
		/>

		<c-list-icon-item
			class="w-movement-detail-card__item"
			v-if="movement.operationDate"
			:title="$t('MOVEMENT.OPERATION_DATE')"
			:description="$d(new Date(movement.operationDate), 'numeric')"
			icon="@icons/calendar"
		/>
	</section>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'w-movement-detail-card',

	components: {
		CListIconItem,
	},

	props: {
		movement: { type: Object },
	},
};
</script>

<style lang="scss" scoped>
.w-movement-detail-card__item {
	margin-bottom: 18px;
}
</style>
