<template>
	<router-link
		@click.native.capture="handleClick"
		tag="button"
		:to="{ name: 'movement', params: { movementId: source.id, productType: 'card' } }"
		class="w-movement-card"
	>
		<c-list-item
			:title="source.reason"
			:amount="$nc(source.amount)"
			:info="$d(new Date(source.operationDate), 'numeric')"
			:comment="commentText"
			:ariaTitle="source.reason.concat(':')"
			:ariaDate="'. '.concat($d(new Date(source.operationDate), 'a11ydate'))"
		/>
	</router-link>
</template>

<script>
import CListItem from '@components/c-list-item.vue';

export default {
	name: 'w-movement-card',
	components: {
		CListItem,
	},
	props: { source: Object },

	computed: {
		commentText() {
			const { comment } = this.source;

			if (!comment || comment?.comment === '') {
				return '';
			}

			return `:  ${comment.comment}`;
		},
	},

	methods: {
		handleClick(event) {
			if (this.source.id === '000-0000000') {
				event.stopPropagation();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-card {
	appearance: none;
	background: transparent;
	border: 0;
	margin: 0;
	padding: 0;
	display: block;
	width: 100%;
	text-align: left;
	position: relative;
}

.w-movement-card__item {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: min-content min-content;
	grid-gap: 10px;
	padding: 10px 0;
}

.w-movement-card__title,
.w-movement-card__amount {
	grid-row: 2 / 2;
}

.w-movement-card__amount,
.w-movement-card__balance {
	text-align: right;
	white-space: nowrap;
}

.w-movement-card__title {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
