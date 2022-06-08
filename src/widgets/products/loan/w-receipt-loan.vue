<template>
	<div class="w-receipt-loan__container">
		<span class="w-receipt-loan__title text-m-medium">{{ source.reason }}</span>
		<span class="w-receipt-loan__amount text-l-medium">
			{{ $nc(source.pendingAmount) }}
		</span>
		<span class="w-receipt-loan__date text-s-light">
			{{ $d(new Date(source.date), 'numeric') }}
		</span>
	</div>
</template>

<script>
export default {
	name: 'w-receipt-loan',

	props: {
		source: { type: Object },
	},
};
</script>

<style lang="scss" scoped>
.w-receipt-loan {
	display: block;
	width: 100%;
	border: 0;
	margin: 0;
	padding: 0;
	text-align: left;
	background: transparent;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.2);
	&:last-child {
		border-bottom: 1px solid RGBA(var(--color-text-primary), 0.2);
	}
}

.w-receipt-loan__container {
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content min-content;
	grid-gap: 10px;
	padding: 10px 0;
	color: RGB(var(--color-text-primary));
}

.w-receipt-loan__title {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.w-receipt-loan__amount {
	text-align: right;
	white-space: nowrap;
}

.w-receipt-loan__installment,
.w-receipt-loan__interest,
.w-receipt-loan__right-date {
	text-align: right;
}
</style>
