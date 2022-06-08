<template>
	<div class="w-position-endorsement" v-if="source">
		<c-list-icon-item
			v-if="source.guarantyAmount"
			:title="$t('DETAIL.AVAL_AMOUNT')"
			:description="$nc(source.guarantyAmount)"
			icon="@icons/calendar"
		/>

		<c-list-icon-item
			v-if="source.startingAmount"
			:title="$t('DETAIL.GRANTED_AMOUNT')"
			:description="$nc(source.startingAmount)"
			icon="@icons/walletMoney"
		/>

		<c-list-icon-item
			v-if="source.outstandingAmount"
			:title="$t('DETAIL.DISPOSED_AMOUNT')"
			:description="$nc(source.outstandingAmount)"
			icon="@icons/valueAccountUnit"
		/>
	</div>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'w-position-endorsement',

	props: {
		source: { type: Object },
	},

	components: {
		CListIconItem,
	},
};
</script>

<style lang="scss" scoped>
.w-position-endorsement > *:not(:last-child) {
	margin-bottom: 15px;
}
</style>
