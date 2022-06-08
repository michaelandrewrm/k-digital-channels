<template>
	<router-link
		tag="button"
		class="w-asset-item-investment-portfolio"
		:to="{ name: 'composition', params: { familyId: type, productId, type: assetType } }"
	>
		<div class="w-asset-item-investment-portfolio__wrapper">
			<span class="text-m-medium w-asset-item-investment-portfolio__name">
				{{ $t(`MY_PRODUCT.INVESTMENT-ACCOUNT.ASSET-TYPE.${assetType}`) }}
			</span>
			<span class="text-l-medium w-asset-item-investment-portfolio__effective-value">
				<span data-testid="effective-value">
					{{ $nc(assetBalance) }}
				</span>
			</span>
		</div>
	</router-link>
</template>

<script>
export default {
	name: 'w-asset-item-investment-portfolio',

	props: {
		productId: { type: String },
		type: { type: String },
		assetType: { type: String },
		assetBalance: { type: Object },
	},
};
</script>

<style lang="scss" scoped>
.w-asset-item-investment-portfolio {
	appearance: none;
	background: RGB(var(--color-surface-light));
	border: 0;
	padding: 25px 20px;
	display: block;
	width: 100%;
	text-align: left;
	border-radius: $border-radius-xs;
	box-shadow: 0 4px 8px -3px rgba(0, 0, 0, 0.07);
	margin: 10px 0;
	position: relative;
}

.w-asset-item-investment-portfolio__wrapper {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content;
	grid-gap: 10px;
}

.w-asset-item-investment-portfolio__name {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.w-asset-item-investment-portfolio__effective-value {
	text-align: right;
	white-space: nowrap;
	&:empty {
		padding-top: 22px;
	}
}

.w-asset-item-investment-portfolio__quantity {
	display: inline-flex;
	grid-column-start: 1;
	grid-column-end: 3;
	padding-top: 10px;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	line-height: 1;
	align-items: center;
	justify-content: flex-end;
}

.w-asset-item-investment-portfolio__quantity-value,
.w-asset-item-investment-portfolio__quantity-info {
	display: inline-flex;
	margin-left: 8px;
}
</style>
