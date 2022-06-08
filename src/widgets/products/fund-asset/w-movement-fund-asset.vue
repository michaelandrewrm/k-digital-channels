<template>
	<router-link
		tag="button"
		:to="{
			name: 'movement',
			params: { productId, movementId: source.id, productType: 'fund-asset' },
		}"
		class="w-movement-fund-asset"
		data-testid="movement-fund-asset"
	>
		<div class="w-movement-fund-asset__container">
			<span class="w-movement-fund__reason text-m-medium">
				{{ source.reason }}
			</span>
			<span class="w-movement-fund-asset__value text-l-medium">{{ $nc(source.amount) }}</span>
			<span class="w-movement-fund-asset__date text-s-light">
				{{ $d(new Date(source.operationDate), 'numeric') }}
			</span>
			<span class="w-movement-fund-asset__unity-quantity text-s-book">
				{{
					$t('FUNDS.UNITY_QUANTITY', {
						value: $n(source.unityQuantity, { minimumFractionDigits: 6 }),
					})
				}}
			</span>
		</div>
	</router-link>
</template>

<script>
export default {
	name: 'w-movement-fund-asset',

	props: {
		source: { type: Object },
		productId: { type: String },
	},
};
</script>

<style lang="scss" scoped>
.w-movement-fund-asset {
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

.w-movement-fund-asset__container {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content min-content;
	grid-gap: 10px;
	padding: 10px 0;
	align-items: center;
}

.w-movement-fund-asset__value {
	text-align: right;
	white-space: nowrap;
}

.w-movement-fund-asset__title {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.w-movement-fund-asset__unity-quantity {
	width: fit-content;
	padding: 4px 6px;
	background-color: RGB(var(--color-surface-dark));
	border-radius: 4px;
	white-space: nowrap;
}
</style>
