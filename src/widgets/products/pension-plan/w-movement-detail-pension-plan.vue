<template>
	<section>
		<c-list-icon-item
			class="w-movement-detail-pension-plan__item"
			v-if="movement.id"
			:title="$t('MOVEMENT.ID')"
			:description="movement.id"
			icon="@icons/paper"
		/>

		<c-list-icon-item
			class="w-movement-detail-pension-plan__item"
			v-if="movement.operationDate"
			:title="$t('MOVEMENT.OPERATION_DATE')"
			:description="$d(new Date(movement.operationDate), 'numeric')"
			icon="@icons/calendar"
		/>

		<c-list-icon-item
			class="w-movement-detail-pension-plan__item"
			v-if="movement.valueDate"
			:title="$t('MOVEMENT.VALUE_DATE')"
			:description="$d(new Date(movement.valueDate), 'numeric')"
			icon="@icons/calendar"
		/>

		<c-list-icon-item
			class="w-movement-detail-pension-plan__item"
			v-if="movement.type"
			:title="$t('MOVEMENT.TYPE')"
			:description="movement.type.name"
			icon="@icons/paper"
		/>
	</section>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'w-movement-detail-pension-plan',

	components: {
		CListIconItem,
	},

	props: {
		movement: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-detail-pension-plan__item:not(:last-child) {
	margin-bottom: 18px;
}
</style>
