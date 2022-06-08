<template>
	<c-acrylic-sheet :dotted="true" class="w-asset-sheet-investment-portfolio">
		<c-icon src="@icons/productReceipt" size="" slot="icon" />

		<span
			class="w-asset-sheet-investment-portfolio__row text-fixed-m-medium"
			v-if="source.isinDescription"
		>
			{{ source.isinDescription }}
		</span>

		<span class="w-asset-sheet-investment-portfolio__row text-fixed-l-bold" v-if="source.isin">
			{{ source.isin }}
		</span>
	</c-acrylic-sheet>
</template>

<script>
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';

export default {
	name: 'w-asset-sheet-investment-portfolio',

	components: {
		CAcrylicSheet,
		CIcon,
	},

	props: {
		source: { type: Object },
	},
};
</script>

<style lang="scss" scoped>
.w-asset-sheet-investment-portfolio__row:not(:last-child) {
	margin-bottom: 10px;
}
</style>
