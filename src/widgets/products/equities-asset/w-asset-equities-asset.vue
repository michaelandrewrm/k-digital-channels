<template>
	<button class="w-asset-equities-asset" @click="openDetails">
		<div class="w-asset-equities-asset__wrapper">
			<span class="text-m-medium w-asset-equities-asset__name">{{ source.name }}</span>
			<span class="text-l-medium w-asset-equities-asset__balance">
				<span v-if="source.totalValue">{{ $nc(source.totalValue) }}</span>
			</span>
			<span class="text-s-light w-asset-equities-asset__id">{{ source.isin }}</span>
			<span class="text-s-light w-asset-equities-asset__quantity">
				{{
					$tc('DETAIL.EQUITIES_QUANTITY', source.unityQuantity, {
						n: $n(source.unityQuantity),
					})
				}}
			</span>
		</div>
	</button>
</template>

<script>
export default {
	name: 'w-asset-equities-asset',

	props: {
		source: { type: Object },
		productId: { type: String },
		productFamily: { type: String },
	},

	methods: {
		openDetails() {
			const { productId: id, source, productFamily } = this;
			const productId = `${id}/assets/${source.id}`;
			const productType = 'equities-asset';
			let familyId = productType;

			/* istanbul ignore else */
			if (productFamily?.startsWith('managed-')) {
				familyId = 'managed-equities-asset';
			}

			return this.$router.push({
				name: 'product-detail',
				params: { productId, familyId, productType },
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.w-asset-equities-asset {
	appearance: none;
	background: RGB(var(--color-surface-light));
	border: 0;
	padding: 10px;
	display: block;
	width: 100%;
	text-align: left;
	border-radius: $border-radius-xs;
	box-shadow: 0 4px 8px -3px rgba(0, 0, 0, 0.07);
	margin: 10px 0;
	position: relative;
}

.w-asset-equities-asset__wrapper {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content min-content;
	grid-gap: 10px;
}

.w-asset-equities-asset__name {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.w-asset-equities-asset__balance,
.w-asset-equities-asset__quantity {
	text-align: right;
	white-space: nowrap;
}

.w-asset-equities-asset__quantity {
	padding: 4px 6px;
	background-color: RGBA(var(--color-dark-surface), 0.1);
	border-radius: 4px;
	line-height: 1;
	display: inline-flex;
	align-items: center;
}
</style>
