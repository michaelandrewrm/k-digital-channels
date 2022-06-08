<template>
	<section>
		<c-list-icon-item
			class="w-movement-detail-investment-portfolio__item"
			v-if="movement.operationDate"
			:title="$t('MOVEMENT.OPERATION_DATE')"
			:description="$d(new Date(movement.operationDate), 'numeric')"
			icon="@icons/calendar"
		/>

		<c-list-icon-item
			class="w-movement-detail-investment-portfolio__item"
			v-if="movement.titles"
			:title="$t('MOVEMENT.EQUITIES_NUMBER')"
			:description="$n(movement.titles)"
			icon="@icons/accountUnit"
		/>

		<c-list-icon-item
			class="w-movement-detail-investment-portfolio__item"
			v-if="movement.originMovementAmount"
			:title="$t('MOVEMENT.PRICE')"
			:description="$nc(movement.originMovementAmount)"
			icon="@icons/wallet"
		/>

		<c-list-icon-item
			class="w-movement-detail-investment-portfolio__item"
			v-if="movement.netPrice"
			:title="$t('MOVEMENT.PRICE')"
			:description="$nc(movement.netPrice)"
			icon="@icons/wallet"
		/>
	</section>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'w-movement-detail-investment-portfolio',

	components: {
		CListIconItem,
	},

	props: {
		movement: { type: Object },
	},
};
</script>

<style lang="scss" scoped>
.w-movement-detail-investment-portfolio__item:not(:last-child) {
	margin-bottom: 18px;
}
</style>
