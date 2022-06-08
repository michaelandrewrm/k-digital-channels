<template>
	<div class="w-detail-fund-asset">
		<div class="w-detail-fund-asset__group">
			<w-interveners v-if="detail.interveners" :interveners="detail.interveners" />
		</div>

		<div class="w-detail-fund-asset__group">
			<c-list-icon-item
				v-if="detail.connectedAccount && detail.connectedAccount.value"
				:title="$t('DETAIL.ASSOCIATED_ACCOUNT')"
				:description="$pn(detail.connectedAccount, 'format')"
				icon="@icons/wallet"
				copyable
			/>

			<c-list-icon-item
				v-if="detail.isin"
				:title="$t('DETAIL.ISIN')"
				:description="detail.isin"
				icon="@icons/paper"
				copyable
			/>
		</div>

		<div class="w-detail-fund-asset__group">
			<c-list-icon-item
				v-if="detail.unityQuantity"
				:title="$t('DETAIL.UNITY_QUANTITY')"
				:description="$n(detail.unityQuantity, { minimumFractionDigits: 6 })"
				icon="@icons/accountUnit"
			/>

			<c-list-icon-item
				v-if="detail.liquidationValueDate"
				:title="$t('DETAIL.NET_ASSET_DATE')"
				:description="$d(new Date(detail.liquidationValueDate), 'numeric')"
				icon="@icons/calendar"
			/>

			<c-list-icon-item
				v-if="detail.liquidationValue"
				:title="$t('DETAIL.LIQUIDATION_VALUE')"
				:description="$nc(detail.liquidationValue, { minimumFractionDigits: 6 })"
				icon="@icons/valueAccountUnit"
			/>

			<c-list-icon-item
				v-if="detail.effectiveValue"
				:title="$t('DETAIL.ASSESSMENT_VALUE')"
				:description="$nc(detail.effectiveValue)"
				icon="@icons/walletMoney"
			/>
		</div>

		<div
			v-if="detail.costEffectiveness"
			class="w-detail-fund-asset__group w-detail-fund-asset__prof"
		>
			<c-list-icon-item
				v-if="detail.costEffectiveness"
				:title="$t('DETAIL.PROFITABILITY_FROM_BEGINNING')"
				:description="$n(detail.costEffectiveness, '%')"
				icon="@icons/profitability"
			/>
			<c-icon-button
				class="w-detail-fund-asset__prof-icon"
				icon="@icons/info"
				size="l"
				@click="openProfitabilityInfo"
				data-testid="profitability"
			/>
		</div>

		<p
			v-if="detail.yearCostEffectiveness || detail.monthCostEffectiveness"
			class="w-detail-fund-asset__profitability text-m-medium"
		>
			{{ $t('DETAIL.PRODUCT_PROFITABILITY') }}
		</p>

		<div class="w-detail-fund-asset__group">
			<c-list-icon-item
				v-if="detail.yearCostEffectiveness"
				:title="$t('DETAIL.CURRENT_YEAR')"
				:description="$n(detail.yearCostEffectiveness, '%')"
				icon="@icons/calendar"
			/>

			<c-list-icon-item
				v-if="detail.monthCostEffectiveness"
				:title="$t('DETAIL.LAST_12_MONTH')"
				:description="$n(detail.monthCostEffectiveness, '%')"
				icon="@icons/calendarTime"
			/>
		</div>
	</div>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';
import WInterveners from '@widgets/w-interveners';
import CIconButton from '@components/c-icon-button';
import MFundProfitability from '@modals/m-fund-profitability';

export default {
	name: 'w-detail-fund-asset',

	props: {
		detail: { type: null },
	},

	components: { WInterveners, CListIconItem, CIconButton },

	methods: {
		openProfitabilityInfo() {
			return this.$store.dispatch('modal/open', MFundProfitability);
		},
	},
};
</script>

<style lang="scss" scoped>
.w-detail-fund-asset__group {
	display: block;
	border-top: 1px solid RGBA(var(--color-primary-surface), 0.2);
	padding: 20px;
	--c-list-icon-item-icon-color: #{RGB(var(--color-text-secondary-light))};
}

.w-detail-fund-asset__group:empty {
	display: none;
}

.w-detail-fund-asset__group > *:not(:last-child) {
	margin-bottom: 15px;
}

.w-detail-fund-asset__profitability {
	padding-bottom: 8px;
}

.w-detail-fund-asset__prof {
	position: relative;
}

.w-detail-fund-asset__prof-icon {
	position: absolute;
	top: 10px;
	right: -10px;
}
</style>
