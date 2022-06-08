<template>
	<c-acrylic-sheet :dotted="true">
		<c-icon src="@icons/productReceipt" size="" slot="icon" />

		<span class="w-movement-sheet-card__reason text-fixed-m-medium" v-if="movement.reason">
			{{ movement.reason }}
		</span>

		<span class="text-fixed-l-bold" v-if="movement.amount">
			{{ $nc(movement.amount) }}
		</span>
	</c-acrylic-sheet>
</template>

<script>
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';

export default {
	name: 'w-movement-sheet-card',

	components: {
		CAcrylicSheet,
		CIcon,
	},

	props: {
		movement: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-sheet-card__reason {
	margin-bottom: 10px;
}
</style>
