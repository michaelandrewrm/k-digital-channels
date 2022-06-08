<template>
	<router-link
		tag="button"
		:to="{ name: 'movement', params: { movementId: source.id, productType: 'loan' } }"
		class="w-movement-loan"
	>
		<div class="w-movement-loan__container" v-bind="$attrs">
			<span class="w-movement-loan__title text-m-medium">{{ loanType }}</span>
			<span class="w-movement-loan__value text-l-medium">{{ $nc(source.amount) }}</span>
			<span class="w-movement-loan__date text-s-light">
				{{ $d(new Date(source.operationDate), 'numeric') }}
			</span>
		</div>
	</router-link>
</template>

<script>
export default {
	name: 'w-movement-loan',

	computed: {
		loanType({ source }) {
			const { type } = source;

			const types = [
				'ORIGINATION',
				'LIQUIDATION',
				'CANCELATION',
				'REPAYMENT',
				'LIMIT_INCREASE',
				'LIMIT_REDUCTION',
				'PARTIAL_DISPOSAL',
				'TAX_CHARGE',
			];

			if (!types.includes(type)) {
				return type;
			}

			return this.$t(`LOAN.TYPE.${type}`);
		},
	},

	props: {
		source: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-loan {
	appearance: none;
	background: transparent;
	border: 0;
	margin: 0;
	padding: 0;
	display: block;
	width: 100%;
	text-align: left;
	position: relative;
}

.w-movement-loan__container {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content min-content;
	grid-gap: 10px;
	padding: 10px 0;
}

.w-movement-loan__value {
	text-align: right;
	white-space: nowrap;
}

.w-movement-loan__title {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
