<template>
	<div class="w-movement-pending-movements" v-bind="$attrs" tabindex="0">
		<span class="w-movement-pending-movements__title text-m-medium">{{ source.reason }}</span>
		<span class="w-movement-pending-movements__value text-l-medium">
			{{ $nc(source.amount) }}
		</span>

		<span class="w-movement-pending-movements__title text-m-medium">
			{{ source.originFund.name }}
		</span>
		<span class="w-movement-pending-movements__product-title text-s-light">
			{{ $d(new Date(source.operationDate), 'numeric') }}
		</span>

		<span class="w-movement-pending-movements__title text-m-medium">
			{{ source.originFund.id }}
		</span>

		<span class="w-movement-pending-movements__stocks text-s-light"></span>
	</div>
</template>

<script>
export default {
	name: 'w-movement-pending-movements',

	props: {
		source: { type: Object },
	},
};
</script>

<style lang="scss" scoped>
.w-movement-pending-movements {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content min-content min-content;
	grid-gap: 10px;
	padding: 10px 0;
	position: relative;
}

.w-movement-pending-movements__value,
.w-movement-pending-movements__product-title {
	text-align: right;
}

.w-movement-pending-movements__title {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.w-movement-pending-movements__stocks {
	grid-column: span 2;
	background-color: RGB(var(--color-surface-dark));
	border-radius: 4px;
	line-height: 1;
	display: flex;
	align-items: center;
}

.w-movement-pending-movements__stock-unit {
	padding: 4px 6px;
	background-color: RGBA(var(--color-primary), 0.05);
	border-radius: 4px;
	text-align: left;
}

.w-movement-pending-movements__stock-label {
	padding: 2px;
	text-align: right;
	flex-grow: 1;
}
</style>
