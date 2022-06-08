<template>
	<l-transfer-sheet class="w-correos-cash-amount">
		<div class="w-correos-cash-amount__header">
			<h2 class="w-correos-cash-amount__title text-m-medium" tabindex="-1">
				{{ $t('TRANSFERS.FILL_DATA') }}
			</h2>

			<p class="w-correos-cash-amount__desc text-m-light" id="w-correos-cash-amount__desc">
				{{ $t('TRANSFERS.CORREOS_CASH.AMOUNT') }}
			</p>
		</div>

		<div class="w-correos-cash-amount__content">
			<label class="w-correos-cash-amount__label text-m-medium">
				{{ $t('TRANSFERS.AMOUNT') }}
				<c-transfer-input-amount
					id="w-correos-cash-amount__value"
					class="w-correos-cash-amount__field"
					v-model="amount"
					:currency="maxAmount ? maxAmount.currency.id : 'EUR'"
					:placeholder="$t('TRANSFERS.AMOUNT')"
					:valid="!validations.amount.error"
					autocomplete="transaction-amount"
					@input="validations.amount.dirty = true"
					@keypress.enter="submit"
					data-testid="amount"
				/>

				<c-transfer-field-helper-text
					data-testid="amount-error"
					for="w-correos-cash-amount__value"
					v-if="validations.amount.error && !validations.amount.positive"
				>
					{{ $t('TRANSFERS.AMOUNT_ERROR') }}
				</c-transfer-field-helper-text>

				<c-transfer-field-helper-text
					data-testid="limit-error"
					for="w-correos-cash-amount__value"
					v-if="validations.amount.error && !validations.amount.overMaxAmount"
				>
					{{ $t('TRANSFERS.CORREOS_CASH.LIMIT_ERROR') }}
				</c-transfer-field-helper-text>

				<c-transfer-field-helper-text for="w-correos-cash-amount__value" persistent>
					{{ $t('TRANSFERS.CORREOS_CASH.LIMIT_AMOUNT') }}
				</c-transfer-field-helper-text>
			</label>
		</div>

		<c-button raised slot="buttons" @click="submit" data-testid="submit" :disabled="formHasError">
			{{ $t('ACTIONS.CONTINUE') }}
		</c-button>
	</l-transfer-sheet>
</template>

<script>
import LTransferSheet from '@layouts/l-transfer-sheet';
import CTransferFieldHelperText from '@components/c-transfer-field-helper-text';
import CTransferInputAmount from '@components/c-transfer-input-amount';
import CButton from '@components/c-button';

export default {
	name: 'w-correos-cash-amount',

	components: {
		LTransferSheet,
		CTransferFieldHelperText,
		CTransferInputAmount,
		CButton,
	},

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		maxAmount: { type: Object },
		value: { type: Object },
	},

	data() {
		return {
			amount: null,
			validationState: { amount: { dirty: false } },
		};
	},

	computed: {
		localModel({ value, amount, maxAmount }) {
			return {
				...value,
				amount: { amount, currency: { id: maxAmount?.currency?.id } },
			};
		},

		assessment({ amount, maxAmount }) {
			return {
				amount: {
					positive: amount && amount > 0,
					overMaxAmount: amount && amount <= maxAmount?.amount,
				},
			};
		},

		validations({ assessment }) {
			const { validationState } = this;

			return Object.keys(assessment).reduce((reducer, key) => {
				const validationField = { ...assessment[key] };

				Object.defineProperties(validationField, {
					invalid: { get: () => !Object.values(assessment[key]).every(Boolean) },
					error: { get: () => this.validations[key].dirty && this.validations[key].invalid },
					dirty: {
						get: () => validationState[key].dirty,
						set: (value) => {
							validationState[key].dirty = value;
						},
					},
				});

				return { ...reducer, [key]: validationField };
			}, {});
		},

		formHasError({ validations }) {
			return Object.values(validations).some(({ error }) => Boolean(error));
		},
	},

	methods: {
		submit() {
			this.validationState.amount.dirty = true;

			if (this.formHasError) {
				return;
			}

			this.$emit('update:value', this.localModel);
		},
	},

	async created() {
		this.transferId = this.value.transferId;
		this.amount = this.value.amount?.amount;

		this.$emit('update:value', {
			...this.value,
			amount: null,
		});
	},
};
</script>

<style lang="scss" scoped>
.w-correos-cash-amount__header {
	margin: 0 20px;
}

.w-correos-cash-amount__title {
	padding-top: 30px;
}

.w-correos-cash-amount__title::before {
	content: '2.' / '';
}

.w-correos-cash-amount__desc {
	margin-top: 10px;
}

.w-correos-cash-amount__content {
	padding: 0 0 20px;
	margin: 15px 20px 0;
}

.w-correos-cash-amount__label {
	display: block;
}

.w-correos-cash-amount__label:not(:last-child) {
	margin-bottom: 20px;
}

.w-correos-cash-amount__field {
	margin-top: 10px;
}
</style>
