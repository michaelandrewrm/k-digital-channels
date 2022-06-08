<template>
	<div class="w-bizum-selae-detail">
		<section data-testid="content">
			<c-list-icon-item
				class="w-bizum-selae-detail__item"
				v-if="source.date"
				:title="$t('DETAIL.ORDER_DATE')"
				:description="$d(new Date(source.date), 'numeric')"
				data-testid="date"
				icon="@icons/calendar"
			/>

			<c-list-icon-item
				class="w-bizum-selae-detail__item"
				v-if="source.amount"
				:title="$t('TRANSFERS.AMOUNT')"
				:description="$nc(source.amount)"
				data-testid="amount"
				icon="@icons/valueAccountUnit"
			/>

			<c-list-icon-item
				class="w-bizum-selae-detail__item"
				v-if="source.reason"
				:title="$t('TRANSFERS.REASON')"
				:description="source.reason"
				data-testid="reason"
				icon="@icons/paper"
			/>
		</section>
	</div>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'w-bizum-selae-detail',

	components: {
		CListIconItem,
	},

	props: {
		source: { type: Object, required: true },
	},
};
</script>

<style lang="scss" scoped>
.w-bizum-selae-detail {
	display: flex;
	flex-direction: column;
}

.w-bizum-selae-detail__item {
	margin-bottom: 15px;
	text-align: left;
}

.w-bizum-selae-detail_description {
	text-align: left;
	padding: 0 0 10px;
}

.w-bizum-selae-detail__alert {
	display: block;
	width: 100%;
	max-width: 800px;
	margin: 0 auto 20px;
	text-decoration: none;
	border-radius: 2px;
	@media (hover) {
		cursor: pointer;
	}
}
</style>
