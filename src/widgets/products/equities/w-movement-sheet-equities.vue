<template>
	<c-acrylic-sheet :dotted="true">
		<c-icon src="@icons/productReceipt" size="" slot="icon" />

		<span class="w-movement-sheet-equities__reason text-fixed-m-medium" v-if="movement.reason">
			{{ movement.reason }}
		</span>

		<span class="text-fixed-l-bold" v-if="movement.amount">
			{{ $nc(movement.amount) }}
		</span>

		<span class="w-movement-sheet-equities__name text-fixed-s-medium" v-if="movement.name">
			{{ movement.name }}
		</span>

		<span class="text-fixed-s-light" v-if="movement.isin">
			{{ movement.isin }}
		</span>
	</c-acrylic-sheet>
</template>

<script>
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';

export default {
	name: 'w-movement-sheet-equities',

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
.w-movement-sheet-equities__reason {
	margin-bottom: 10px;
}

.w-movement-sheet-equities__name {
	margin-top: 6px;
	margin-bottom: 4px;
}
</style>
