<template>
	<div class="w-position-caminos-equities" v-if="source">
		<c-list-icon-item
			v-if="source.totalValue"
			:title="$t('DETAIL.TOTAL_VALUE')"
			:description="$nc(source.totalValue)"
			icon="@icons/wallet"
		/>

		<c-list-icon-item
			v-if="source.unityValue"
			:title="$t('DETAIL.NOMINAL_VALUE')"
			:description="$nc(source.unityValue)"
			icon="@icons/walletMoney"
		/>

		<c-list-icon-item
			v-if="source.unityQuantity"
			:title="$t('DETAIL.EQUITIES_QUANTITY_NUMBER')"
			:description="$n(source.unityQuantity)"
			icon="@icons/accountUnit"
		/>

		<c-list-icon-item
			v-if="source.effectiveUnityValue"
			:title="$t('DETAIL.UNIT_PRICE')"
			:description="$nc(source.effectiveUnityValue)"
			icon="@icons/wallet"
		/>

		<c-list-icon-item
			v-if="source.lastValueDate"
			:title="$t('DETAIL.LAST_VALUE_DATE')"
			:description="$d(new Date(source.lastValueDate), 'numeric')"
			icon="@icons/calendar"
		/>
	</div>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'w-position-caminos-equities',

	props: {
		source: { type: Object },
	},

	components: {
		CListIconItem,
	},
};
</script>

<style lang="scss" scoped>
.w-position-caminos-equities > *:not(:last-child) {
	margin-bottom: 15px;
}
</style>
