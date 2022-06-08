<template>
	<section>
		<c-list-icon-item
			class="w-movement-detail-fund__item"
			v-if="movement.operationDate"
			:title="$t('MOVEMENT.OPERATION_DATE')"
			:description="$d(new Date(movement.operationDate), 'numeric')"
			icon="@icons/calendar"
		/>

		<c-list-icon-item
			class="w-movement-detail-fund__item"
			v-if="movement.unityQuantity"
			:title="$t('MOVEMENT.LIQUIDATION_VALUE')"
			:description="$nc(movement.liquidationValue)"
			icon="@icons/walletMoney"
		/>

		<c-list-icon-item
			class="w-movement-detail-fund__item"
			v-if="movement.effectiveValue"
			:title="$t('MOVEMENT.EFFECTIVE_VALUE')"
			:description="$nc(movement.effectiveValue)"
			icon="@icons/walletMoney"
		/>
	</section>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'w-movement-detail-fund',

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
.w-movement-detail-fund__item:not(:last-child) {
	margin-bottom: 18px;
}

.w-movement-detail__group {
	display: block;
	padding: 20px 0;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.w-movement-detail__group:empty {
	display: none;
}

.w-movement-detail__group > *:not(:last-child) {
	margin-bottom: 15px;
}
</style>
