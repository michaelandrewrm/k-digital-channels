<template>
	<div class="w-signature-list-item">
		<button class="w-signature-list-item__button" role="listitem" data-testid="list-item">
			<span class="text-m-medium w-signature-list-item__title">
				{{ source.operationDescription }}
			</span>
			<span
				v-if="source.data && source.data.amount && source.data.currency"
				class="text-l-medium w-signature-list-item__amount"
			>
				{{
					$nc({
						amount: source.data.amount,
						currency: { id: source.data.currency },
					})
				}}
			</span>
			<span class="w-signature-list-item__date text-s-light">
				{{ $d(new Date(source.creationDate), 'numeric') }}
			</span>
			<span class="w-signature-list-item__status text-s-light">
				{{ $t(`SIGNATURES.STATUS.${source.status}`) }}
			</span>
		</button>
	</div>
</template>

<script>
export default {
	name: 'w-signature-list-item',

	props: {
		source: { type: Object, required: true },
	},
};
</script>

<style lang="scss" scoped>
.w-signature-list-item {
	padding: 5px 0;
}

.w-signature-list-item__button {
	color: RGB(var(--color-text-primary));
	appearance: none;
	display: grid;
	position: relative;
	width: 100%;
	border: none;
	border-radius: $border-radius-m;
	padding: 15px;
	grid-template-columns: 1fr 1fr;
	row-gap: 10px;
	background-color: RGB(var(--color-surface-light));
	line-height: 1.6;
	box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 0.3);
}

.w-signature-list-item__date,
.w-signature-list-item__status {
	grid-row: 2 / 2;
}

.v-pending-operations__card.--signed {
	background-color: RGB(var(--color-surface-dark));
}

.w-signature-list-item__title,
.w-signature-list-item__date {
	text-align: left;
}

.w-signature-list-item__amount,
.w-signature-list-item__status {
	text-align: right;
}
</style>
