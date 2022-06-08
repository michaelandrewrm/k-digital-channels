<template>
	<div class="w-correos-cash-deposit">
		<button class="w-correos-cash-deposit__button" data-testid="list-item">
			<div class="w-correos-cash-deposit__col1">
				<div
					v-if="source && source.beneficiary && source.beneficiary.productNumber"
					class="w-correos-cash-deposit__title text-m-medium"
				>
					{{ $pn({ value: source.beneficiary.productNumber, format: { id: 'IBAN' } }) }}
				</div>

				<div
					v-if="source && source.operationDate"
					class="w-correos-cash-deposit__title text-s-light"
				>
					{{ $d(new Date(source.operationDate), 'numeric') }}
				</div>
			</div>

			<div class="w-correos-cash-deposit__col2">
				<div
					v-if="source && source.totalAmount"
					class="w-correos-cash-deposit__amount text-l-medium"
				>
					{{ $nc({ amount: source.totalAmount, currency: { id: 'EUR' } }) }}
				</div>
			</div>
		</button>
	</div>
</template>

<script>
export default {
	name: 'w-correos-cash-deposit',

	props: {
		source: { type: Object, required: true },
	},
};
</script>

<style lang="scss" scoped>
.w-correos-cash-deposit {
	padding: 5px;
}

.w-correos-cash-deposit__button {
	appearance: none;
	border: 0;
	width: 100%;
	position: relative;
	background-color: RGB(var(--color-surface-light));
	color: RGB(var(--color-text-primary));
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	padding: 15px 20px;
	min-height: 75px;
	border-radius: $border-radius-l;
	box-shadow: 0 4px 8px -3px rgba(0, 0, 0, 0.07);
	text-decoration: none;
	text-align: left;
}

.w-correos-cash-deposit__col1 {
	flex-grow: 1;
	flex-shrink: 1;
	display: flex;
	flex-direction: column;
}

.w-correos-cash-deposit__col2 {
	flex-shrink: 0;
	flex-grow: 0;
	width: 100px;
	display: flex;
	flex-direction: column;
	text-align: right;
}

.w-correos-cash-deposit__title:first-child {
	margin-bottom: 10px;
}

.w-correos-cash-deposit__amount {
	margin-bottom: 10px;
}
</style>
