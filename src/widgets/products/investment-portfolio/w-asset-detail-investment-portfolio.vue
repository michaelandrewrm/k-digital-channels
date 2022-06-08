<template>
	<div class="w-asset-detail-investment-portfolio">
		<c-list-icon-item
			v-if="detail.availableTitles"
			class="w-asset-detail-investment-portfolio__item"
			:title="$t('DETAIL.EQUITIES_QUANTITY_NUMBER')"
			:description="
				$tc('DETAIL.EQUITIES_QUANTITY', detail.availableTitles, { n: $n(detail.availableTitles) })
			"
			icon="@icons/accountUnit"
		/>

		<c-list-icon-item
			v-if="detail.blockedTitles"
			class="w-asset-detail-investment-portfolio__item"
			:title="$t('DETAIL.EQUITIES_BLOCKED_QUANTITY')"
			:description="
				$tc('DETAIL.EQUITIES_QUANTITY', detail.blockedTitles, { n: $n(detail.blockedTitles) })
			"
			icon="@icons/accountUnit"
		/>

		<c-list-icon-item
			v-if="detail.averageCost"
			class="w-asset-detail-investment-portfolio__item"
			:title="$t('DETAIL.AVERAGE_COST')"
			:description="$nc(detail.averageCost)"
			icon="@icons/walletMoney"
		/>

		<c-list-icon-item
			v-if="detail.marketPrice"
			class="w-asset-detail-investment-portfolio__item"
			:title="$t('DETAIL.MARKET_PRICE')"
			:description="$nc(detail.marketPrice)"
			icon="@icons/walletMoney"
		/>

		<c-list-icon-item
			v-if="detail.equivalentEur"
			class="w-asset-detail-investment-portfolio__item"
			:title="$t('DETAIL.EQUIVALENT_EUR')"
			:description="detail.equivalentEur"
			icon="@icons/wallet"
		/>

		<c-list-icon-item
			v-if="detail.plusMinus"
			class="w-asset-detail-investment-portfolio__item"
			:title="$t('DETAIL.PLUS_MINUS')"
			:description="$nc(detail.plusMinus)"
			icon="@icons/profitability"
		/>

		<c-list-icon-item
			v-if="detail.portfolioPercentage"
			class="w-asset-detail-investment-portfolio__item"
			:title="$t('DETAIL.PORTFOLIO_PERCENTAGE')"
			:description="$n(detail.portfolioPercentage / 100, '%')"
			icon="@icons/profitability"
		/>
	</div>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'w-asset-detail-investment-portfolio',

	props: {
		detail: { type: null },
	},

	components: {
		CListIconItem,
	},
};
</script>

<style lang="scss" scoped>
.w-asset-detail-investment-portfolio__item:not(:last-child) {
	margin-bottom: 18px;
}
</style>
