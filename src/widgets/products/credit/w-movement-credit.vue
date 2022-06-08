<template>
	<router-link
		tag="button"
		:to="{ name: 'movement', params: { movementId: source.id, productType: 'credit' } }"
		class="w-movement-credit"
	>
		<c-list-item
			:title="source.reason"
			:amount="$nc(source.amount)"
			:info="$d(new Date(source.operationDate), 'numeric')"
			:balance="$nc(source.balance)"
		/>
	</router-link>
</template>

<script>
import CListItem from '@components/c-list-item';

export default {
	name: 'w-movement-credit',

	components: {
		CListItem,
	},

	props: {
		source: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-credit {
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
