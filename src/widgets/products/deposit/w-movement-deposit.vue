<template>
	<router-link
		tag="button"
		:to="{
			name: movementDetailRouteTarget,
			params: { movementId: source.id, productType: 'deposit' },
		}"
		class="w-movement-deposit"
	>
		<div class="w-movement-deposit__container" v-if="source.state">
			<span class="w-movement-deposit__title text-m-medium">{{ source.reason }}</span>
			<span class="w-movement-deposit__value text-l-medium">{{ $nc(source.amount) }}</span>
			<span class="w-movement-deposit__date text-s-light">
				{{ $d(new Date(source.operationDate), 'numeric') }}
			</span>
			<span class="w-movement-deposit__state text-s-light">{{ source.state.name }}</span>
		</div>
		<c-list-item
			v-else
			:title="source.reason"
			:amount="$nc(source.amount, { sign: true })"
			:info="$d(new Date(source.operationDate), 'numeric')"
			:balance="$nc(source.balance)"
			:comment="commentText"
		/>
	</router-link>
</template>

<script>
import CListItem from '@components/c-list-item';

export default {
	name: 'w-movement-deposit',

	components: {
		CListItem,
	},

	props: {
		source: {
			type: Object,
		},
	},

	computed: {
		movementDetailRouteTarget({ source }) {
			return source?.state ? 'imposition' : 'movement';
		},

		commentText() {
			const { comment } = this.source;

			if (!comment || comment?.comment === '') {
				return '';
			}

			return `:  ${comment.comment}`;
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-deposit {
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

.w-movement-deposit__container {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content min-content min-content;
	grid-gap: 10px;
	padding: 10px 0;
}

.w-movement-deposit__state,
.w-movement-deposit__value {
	text-align: right;
	white-space: nowrap;
}

.w-movement-deposit__title {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
