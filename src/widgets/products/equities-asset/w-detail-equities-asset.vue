<template>
	<div class="w-detail-equities-asset">
		<div class="w-detail-equities-asset__group">
			<c-list-icon-item
				v-if="detail.isin"
				:title="$t('DETAIL.ISIN')"
				:description="detail.isin"
				icon="@icons/paper"
				copyable
			/>
		</div>

		<div class="w-detail-equities-asset__group">
			<c-list-icon-item
				v-if="detail.market"
				:title="$t('DETAIL.MARKET_TYPE')"
				:description="detail.market"
				icon="@icons/profitability"
			/>

			<c-list-icon-item
				v-if="detail.unityQuantity"
				:title="$t('DETAIL.EQUITIES_QUANTITY_NUMBER')"
				:description="$n(detail.unityQuantity)"
				icon="@icons/accountUnit"
			/>

			<c-list-icon-item
				v-if="detail.lastTotalValue"
				:title="$t('DETAIL.EQUITIES_LAST_VALUE')"
				:description="$nc(detail.lastTotalValue)"
				icon="@icons/valueAccountUnit"
			/>

			<c-list-icon-item
				v-if="detail.lastValueDate"
				:title="$t('DETAIL.EQUITIES_LAST_VALUE_DATE')"
				:description="$d(new Date(detail.lastValueDate), 'numeric')"
				icon="@icons/calendar"
			/>

			<c-list-icon-item
				v-if="detail.balance"
				:title="$t('DETAIL.EQUITIES_BALANCE')"
				:description="$nc(detail.balance)"
				icon="@icons/walletMoney"
			/>
		</div>

		<div class="w-detail-equities-asset__group">
			<c-list-icon-item
				v-if="detail.blockedTitles"
				:title="$t('DETAIL.EQUITIES_BLOCKED_QUANTITY')"
				:description="$n(detail.blockedTitles)"
				icon="@icons/accountUnit"
			/>
		</div>
	</div>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'w-detail-equities-asset',

	props: { detail: { type: null } },

	components: { CListIconItem },
};
</script>

<style lang="scss" scoped>
.w-detail-equities-asset__group {
	border-top: 1px solid RGB(var(--color-primary-surface), 0.2);
	padding: 20px;
	--c-list-icon-item-icon-color: #{RGB(var(--color-text-secondary-light))};
}

.w-detail-equities-asset__group:empty {
	display: none;
}

.w-detail-equities-asset__group > *:not(:last-child) {
	margin-bottom: 15px;
}
</style>
