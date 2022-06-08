<template>
	<router-link
		tag="button"
		:to="{
			name: 'imposition',
			params: { movementId: source.id, productType: 'deposit' },
		}"
		class="w-imposition-deposit"
	>
		<div class="w-imposition-deposit__container">
			<span class="w-imposition-deposit__title text-m-medium">{{ source.reason }}</span>
			<span v-if="source.impositionAmount" class="w-imposition-deposit__value text-l-medium">
				{{ $nc(source.impositionAmount) }}
			</span>
			<span v-if="source.creationDate" class="w-imposition-deposit__date text-s-light">
				{{ $d(new Date(source.creationDate), 'numeric') }}
			</span>
			<span
				v-if="source.state && source.state.name"
				class="w-imposition-deposit__state text-s-light"
			>
				{{ source.state.name }}
			</span>
		</div>
	</router-link>
</template>

<script>
export default {
	name: 'w-imposition-deposit',

	props: { source: Object },
};
</script>

<style lang="scss" scoped>
.w-imposition-deposit {
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

.w-imposition-deposit__container {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content min-content min-content;
	grid-gap: 10px;
	padding: 10px 0;
}

.w-imposition-deposit__state,
.w-imposition-deposit__value {
	text-align: right;
	white-space: nowrap;
}

.w-imposition-deposit__title {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
