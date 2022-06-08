<template>
	<router-link
		tag="button"
		:to="{
			name: 'movement',
			params: { movementId: source.id, productType: 'fund' },
		}"
		class="w-movement-fund"
	>
		<div class="w-movement-fund__container">
			<span class="w-movement-fund__reason text-m-medium">
				{{ source.reason }}
			</span>
			<span class="w-movement-fund__value text-l-medium">{{ $nc(source.amount) }}</span>
			<span class="w-movement-fund__title text-m-medium">{{ source.name }}</span>
			<span class="w-movement-fund__effective-value text-s-light">
				{{ $nc(source.effectiveValue) }}
			</span>
			<span class="w-movement-fund__date text-s-light">
				{{ $d(new Date(source.operationDate), 'numeric') }}
			</span>
		</div>
	</router-link>
</template>

<script>
export default {
	name: 'w-movement-fund',

	props: {
		source: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-fund {
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

.w-movement-fund__container {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content min-content min-content;
	grid-gap: 10px;
	padding: 10px 0;
}

.w-movement-fund__effective-value,
.w-movement-fund__value {
	text-align: right;
	white-space: nowrap;
}

.w-movement-fund__title {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
