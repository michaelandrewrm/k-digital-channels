<template>
	<div class="c-print-receipt-item media-print-hide" @click="print">
		<c-list-icon-item :title="title" :description="description" icon="@icons/print" />
	</div>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'c-print-receipt-item',

	components: {
		CListIconItem,
	},

	props: {
		title: { type: String },
		description: { type: String },
	},

	methods: {
		/* istanbul ignore next */
		print() {
			window.print();
		},
	},
};
</script>

<style lang="scss" scoped>
.c-print-receipt-item {
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
	padding-top: 20px;
	padding-bottom: 20px;
	margin-top: 20px;
	margin-bottom: 20px;
}

@media (hover) {
	.c-print-receipt-item {
		cursor: pointer;
	}
}
</style>
