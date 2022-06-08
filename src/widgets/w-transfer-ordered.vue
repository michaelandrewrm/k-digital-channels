<template>
	<div class="w-transfer-ordered">
		<router-link
			tag="button"
			class="w-transfer-ordered__button"
			:to="{
				name: 'transfer-detail',
				params: { type, transferId: source.id, productId },
			}"
		>
			<div class="w-transfer-ordered__wrapper">
				<div class="text-m-medium w-transfer-ordered__name">
					{{
						$t('TRANSFERS.STATUS', {
							status: $t(`TRANSFERS.STATUS.${source.status.id}`).toLowerCase(),
						})
					}}
				</div>
				<div class="text-l-medium w-transfer-ordered__amount">
					{{ $nc(source.amount) }}
				</div>
				<div class="text-s-light">
					{{ $d(new Date(source.date), 'numeric') }}
				</div>
				<div class="text-s-light w-transfer-ordered__status">
					{{ $t(`TRANSFERS.STATUS.${source.status.id}`) }}
				</div>
				<div class="text-s-light w-transfer-ordered__name">{{ source.reason }}</div>
			</div>
		</router-link>
	</div>
</template>

<script>
export default {
	name: 'w-transfer-ordered',

	props: { source: Object, type: String },

	computed: {
		productId({ source }) {
			return source?.orderer?.fromAccount?.id;
		},
	},
};
</script>

<style lang="scss" scoped>
.w-transfer-ordered {
	padding: 5px 0;
}

.w-transfer-ordered__button {
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

.w-transfer-ordered__wrapper {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content;
	grid-gap: 10px;
}

.w-transfer-ordered__name {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.w-transfer-ordered__amount {
	text-align: right;
	white-space: nowrap;
	align-self: center;
}

.w-transfer-ordered__status {
	text-align: right;
	white-space: nowrap;
}
</style>
