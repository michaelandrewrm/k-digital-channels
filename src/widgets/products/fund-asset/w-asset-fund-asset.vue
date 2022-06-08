<template>
	<router-link
		tag="button"
		class="w-asset-fund-asset"
		:to="{
			name: 'asset',
			params: { productId, assetId: source.id, familyId },
		}"
	>
		<div class="w-asset-fund-asset__wrapper">
			<span class="text-m-medium w-asset-fund-asset__name">{{ source.name }}</span>
			<span class="text-l-medium w-asset-fund-asset__effective-value">
				<span
					data-testid="effective-value"
					v-if="source.effectiveValue.amount && source.effectiveValue.amount > 0"
				>
					{{ $nc(source.effectiveValue) }}
				</span>
			</span>
			<span class="text-s-book w-asset-fund-asset__quantity">
				{{ $t('MOVEMENT.ASSETS.PROFITABILITY.TITLE') }}
				<span class="text-s-medium w-asset-fund-asset__quantity-value">
					{{ $n(source.costEffectiveness, '%') }}
				</span>
				<span
					data-testid="info-icon"
					class="w-asset-fund-asset__quantity-info"
					@click.stop="openProfitabilityInfo"
				>
					<c-icon src="@icons/info" size="l" />
				</span>
			</span>
		</div>
	</router-link>
</template>

<script>
import CIcon from '@components/c-icon';
import MFundProfitability from '@modals/m-fund-profitability';

export default {
	name: 'w-asset-fund-asset',

	components: {
		CIcon,
	},

	props: {
		source: { type: Object },
		productId: { type: String },
		productFamily: { type: String },
	},

	computed: {
		familyId({ productFamily }) {
			return productFamily?.startsWith('managed-') ? productFamily : 'fund-asset';
		},
	},

	methods: {
		openProfitabilityInfo() {
			return this.$store.dispatch('modal/open', MFundProfitability);
		},
	},
};
</script>

<style lang="scss" scoped>
.w-asset-fund-asset {
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

.w-asset-fund-asset__wrapper {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content;
	grid-gap: 10px;
}

.w-asset-fund-asset__name {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.w-asset-fund-asset__effective-value {
	text-align: right;
	white-space: nowrap;
	&:empty {
		padding-top: 22px;
	}
}

.w-asset-fund-asset__quantity {
	display: inline-flex;
	grid-column-start: 1;
	grid-column-end: 3;
	padding-top: 10px;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	line-height: 1;
	align-items: center;
	justify-content: flex-end;
}

.w-asset-fund-asset__quantity-value,
.w-asset-fund-asset__quantity-info {
	display: inline-flex;
	margin-left: 8px;
}
</style>
