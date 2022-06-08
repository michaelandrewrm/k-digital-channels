<template>
	<div class="w-transfer-scheduled">
		<router-link
			tag="button"
			class="w-transfer-scheduled__button"
			:to="{ name: 'transfer-detail', params: { type, transferId: source.id } }"
		>
			<div class="w-transfer-scheduled__wrapper">
				<div class="text-m-medium w-transfer-scheduled__name">
					{{ $t('TRANSFERS.SCHEDULED') }}
				</div>
				<div class="text-l-medium w-transfer-scheduled__amount">
					{{ $nc(source.amount) }}
				</div>
				<div class="text-s-light">
					{{ $d(new Date(source.nextExecutionDate), 'numeric') }}
				</div>
				<div
					class="text-s-light w-transfer-scheduled__status"
					v-if="source.periodicity && source.periodicity.frequency"
				>
					{{ $t(`TRANSFERS.FREQUENCY.${frequency}`) }}
				</div>
				<div class="text-s-light w-transfer-scheduled__status" v-else>
					{{ $t(`TRANSFERS.FREQUENCY.PUNCTUAL`) }}
				</div>
				<div class="text-s-light">
					{{ source.reason }}
				</div>
			</div>
		</router-link>
	</div>
</template>

<script>
import frequencyTypes from '@modules/move-money/frequency-types';

export default {
	name: 'w-transfer-scheduled',

	props: {
		source: { type: Object },
		type: { type: String },
	},

	computed: {
		frequency({ source }) {
			return frequencyTypes[(source?.periodicity?.frequency)]?.name;
		},
	},
};
</script>

<style lang="scss" scoped>
.w-transfer-scheduled {
	padding: 5px 0;
}

.w-transfer-scheduled__button {
	appearance: none;
	background: RGB(var(--color-surface-light));
	border: 0;
	padding: 15px;
	display: block;
	width: 100%;
	text-align: left;
	border-radius: $border-radius-xs;
	box-shadow: 0 4px 8px -3px rgba(0, 0, 0, 0.07);
	position: relative;
}

.w-transfer-scheduled__wrapper {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content;
	grid-gap: 10px;
}

.w-transfer-scheduled__name {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.w-transfer-scheduled__amount {
	text-align: right;
	white-space: nowrap;
	align-self: center;
}

.w-transfer-scheduled__status {
	text-align: right;
	white-space: nowrap;
}
</style>
