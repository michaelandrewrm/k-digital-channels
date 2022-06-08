<template>
	<router-link
		tag="button"
		:to="{ name: 'movement', params: { movementId: source.id, productType: 'account' } }"
		class="w-movement-account"
	>
		<c-list-item
			:title="source.reason"
			:amount="$nc(source.amount)"
			:info="$d(new Date(source.operationDate), 'numeric')"
			:balance="$nc(source.balance)"
			:comment="commentText"
		/>
	</router-link>
</template>

<script>
import CListItem from '@components/c-list-item';

export default {
	name: 'w-movement-account',

	components: { CListItem },

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
};
</script>

<style lang="scss" scoped>
.w-movement-account {
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
</style>
