<template>
	<l-transfer-sheet class="w-transfer-amount">
		<div class="w-transfer-amount__header">
			<h2 class="w-transfer-amount__title text-m-medium" tabindex="-1">
				{{ $t('TRANSFERS.FILL_DATA') }}
			</h2>
		</div>

		<div class="w-transfer-amount__content">
			<label class="w-transfer-amount__label text-m-medium">
				{{ $t('TRANSFERS.AMOUNT') }}
				<c-transfer-input-amount
					id="w-transfer-amount-value"
					data-testid="amount"
					class="w-transfer-amount__field"
					v-model="amount"
					:currency="currencyId"
					:placeholder="$t('TRANSFERS.AMOUNT')"
					:valid="!validations.amount.error"
					@input="validations.amount.dirty = true"
					autocomplete="transaction-amount"
				/>

				<c-transfer-field-helper-text
					for="w-transfer-amount-value"
					v-if="validations.amount.error && !validations.amount.positive"
				>
					{{ $t('TRANSFERS.AMOUNT_ERROR') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-transfer-amount-value"
					v-else-if="validations.amount.error && !validations.amount.underBalance"
				>
					{{ $t('TRANSFERS.BALANCE_ERROR') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-transfer-amount-value"
					v-else-if="validations.amount.error && !validations.amount.limitOperation"
				>
					{{ $t('TRANSFERS.LIMIT_ERROR') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-transfer-amount-value"
					v-else-if="validations.amount.error && !validations.amount.limitDaily"
				>
					{{ $t('TRANSFERS.DAILY_LIMIT_ERROR') }}
				</c-transfer-field-helper-text>
			</label>

			<div class="w-transfer-amount__periodicity" v-if="userCanChooseDate">
				<c-transfer-radio
					v-model="periodicity"
					value="today"
					type="button"
					name="periodicity"
					:label="$t('TRANSFERS.DATE.TODAY')"
					data-testid="periodicity-today"
				/>
				<c-transfer-radio
					v-model="periodicity"
					value="scheduled"
					type="button"
					name="periodicity"
					:label="$t('TRANSFERS.DATE.SPECIFIC')"
					data-testid="periodicity-scheduled"
				/>
				<c-transfer-radio
					v-model="periodicity"
					value="periodic"
					type="button"
					name="periodicity"
					:label="$t('TRANSFERS.DATE.PERIODIC')"
					data-testid="periodicity-periodic"
				/>
			</div>

			<div class="w-transfer-amount__label text-m-medium" v-if="periodicity === 'scheduled'">
				<c-transfer-date-picker
					key="scheduled-date"
					data-testid="date"
					v-model="date"
					:placeholder="$t('TRANSFERS.DATE.SELECT_THE_DAY')"
					:invalid="validations.date.error"
					:lang="$store.state.session.lang"
					:min-date="scheduledMinDate"
				/>
				<c-transfer-field-helper-text
					for="w-transfer-amount-date"
					v-if="validations.date.error && !validations.date.required"
				>
					{{ $t('TRANSFERS.DATE_REQUIRED_ERROR') }}
				</c-transfer-field-helper-text>
			</div>

			<div class="w-transfer-amount__label text-m-medium" v-if="periodicity === 'periodic'">
				<c-transfer-select-field
					id="w-transfer-amount-frequency"
					:label="$t('TRANSFERS.FREQUENCY')"
					:options="frequencies"
					v-model="frequency"
					:valid="!validations.frequency.error"
					@change="validations.frequency.dirty = true"
					data-testid="frequency"
				/>
				<c-transfer-field-helper-text
					for="w-transfer-amount-frequency"
					v-if="validations.frequency.error && !validations.frequency.required"
				>
					{{ $t('TRANSFERS.FREQUENCY_REQUIRED_ERROR') }}
				</c-transfer-field-helper-text>
			</div>

			<div class="w-transfer-amount__label text-m-medium" v-if="periodicity === 'periodic'">
				<c-transfer-date-picker
					key="periodic-date"
					data-testid="date"
					v-model="date"
					:placeholder="$t('TRANSFERS.DATE.INIT_DATE')"
					:invalid="validations.date.error"
					:min-date="today"
					:lang="$store.state.session.lang"
				/>
				<c-transfer-field-helper-text
					for="w-transfer-amount-date"
					v-if="validations.date.error && !validations.date.required"
				>
					{{ $t('TRANSFERS.DATE_REQUIRED_ERROR') }}
				</c-transfer-field-helper-text>
			</div>

			<div class="w-transfer-amount__label text-m-medium" v-if="periodicity === 'periodic'">
				<c-transfer-date-picker
					key="periodic-max-date"
					v-model="maxDate"
					:placeholder="$t('TRANSFERS.DATE.END_DATE').concat(' ', $t('TRANSFERS.DATE.OPTIONAL'))"
					:min-date="date || today"
					:lang="$store.state.session.lang"
					data-testid="max-date"
				/>
			</div>

			<label class="w-transfer-amount__label text-m-medium">
				{{ $t('TRANSFERS.REASON') }}
				<c-transfer-textarea
					id="w-transfer-amount-reason"
					class="w-transfer-amount__field"
					data-testid="reason"
					v-model.trim="reason"
					placeholder=""
					rows="5"
					max="10"
					:valid="!validations.reason.error"
					@input="validations.reason.dirty = true"
				/>
				<c-transfer-field-helper-text
					for="w-transfer-amount-reason"
					v-if="validations.reason.error && !validations.reason.maxLength"
				>
					{{ $t('TRANSFERS.REASON_LENGTH_ERROR') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-transfer-amount-reason"
					v-else-if="validations.reason.error && !validations.reason.onlyTheseCharacters"
				>
					{{ $t('TRANSFERS.REASON_ERROR') }}
				</c-transfer-field-helper-text>
			</label>
		</div>

		<c-button raised slot="buttons" @click="submit" data-testid="submit">
			{{ $t('ACTIONS.CONTINUE') }}
		</c-button>
	</l-transfer-sheet>
</template>

<script>
import moveMoneyModule from '@modules/move-money/m-move-money';
import LTransferSheet from '@layouts/l-transfer-sheet';
import CTransferFieldHelperText from '@components/c-transfer-field-helper-text';
import CTransferInputAmount from '@components/c-transfer-input-amount';
import CTransferTextarea from '@components/c-transfer-textarea';
import CTransferRadio from '@components/c-transfer-radio';
import CTransferSelectField from '@components/c-transfer-select-field';
import CTransferDatePicker from '@components/c-transfer-date-picker';
import CButton from '@components/c-button';
import frequencyTypes from '@modules/move-money/frequency-types';

export default {
	name: 'w-transfer-amount',

	modules: {
		'move-money': moveMoneyModule,
	},

	components: {
		LTransferSheet,
		CTransferFieldHelperText,
		CTransferInputAmount,
		CTransferTextarea,
		CTransferRadio,
		CTransferSelectField,
		CTransferDatePicker,
		CButton,
	},

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		value: { type: Object },
	},

	data() {
		return {
			transferId: null,
			limits: null,
			amount: null,
			reason: null,
			periodicity: null,
			date: null,
			frequency: null,
			maxDate: null,

			validationState: {
				amount: { dirty: false },
				reason: { dirty: false },
				frequency: { dirty: false },
				date: { dirty: false },
			},
		};
	},

	computed: {
		currencyId({ value }) {
			return value?.origin?.balance?.currency?.id || 'EUR';
		},

		transferMode({ value }) {
			const transferMode = value?.origin.transferMode;

			if (['INTERNAL', 'INTERNATIONAL', 'SEPA'].includes(transferMode)) {
				return transferMode;
			}

			return 'INTERNAL';
		},

		today() {
			return this.formatDate(new Date())['YYYY-MM-DD'];
		},

		scheduledMinDate() {
			const today = new Date();
			const nextDay = new Date();
			nextDay.setDate(today.getDate() + 1);
			return this.formatDate(nextDay)['YYYY-MM-DD'];
		},

		frequencies() {
			return Object.entries(frequencyTypes)
				.map(([id, { name }]) => ({
					id,
					label: this.$t(`TRANSFERS.FREQUENCY.${name}`),
				}))
				.sort((a, b) => a.id - b.id);
		},

		localModel({
			today,
			value,
			amount,
			currencyId,
			reason,
			periodicity,
			date,
			frequency,
			maxDate,
		}) {
			return {
				...value,
				amount: { amount, currency: { id: currencyId } },
				reason: reason || 'TRANSFERENCIA' /* concepto por defecto */,
				periodicity,
				date: periodicity === 'today' ? today : date,
				frequency: periodicity === 'periodic' ? frequency : null,
				maxDate: periodicity === 'periodic' ? maxDate : null,
			};
		},

		assessment({ value, limits, amount, transferMode, reason, periodicity, frequency, date }) {
			const maxAmount = value?.origin?.balance?.amount;
			const mode =
				transferMode === 'OWN' || transferMode === 'INTERNAL'
					? transferMode.toLowerCase()
					: 'external';

			return {
				amount: {
					positive: amount && amount > 0,
					limitOperation: !limits || (amount && amount <= limits[`${mode}OperationLimit`].amount),
					limitDaily: !limits || (amount && amount <= limits[`${mode}DailyLimit`].amount),
					underBalance: periodicity === 'today' ? amount && amount <= maxAmount : true,
				},
				reason: {
					maxLength: !reason || (reason && reason.length <= 70),
					onlyTheseCharacters:
						!reason || (reason && reason.match(/^[0-9a-zA-Z\s-/¿?:().,'+ºª\u00C0-\u00FF]*$/)),
				},
				frequency: {
					required: periodicity !== 'periodic' || Boolean(frequency),
				},
				date: {
					required: periodicity === 'today' || Boolean(date),
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

		userCanChooseDate({ transferId, transferMode }) {
			return !transferId && transferMode !== 'INTERNATIONAL';
		},
	},

	methods: {
		formatDate(date) {
			const d = new Date(date);
			const day = d.getDate();
			const month = d.getMonth() + 1;
			const year = d.getFullYear();
			const currentDay = day.toString().padStart(2, '0');
			const currentMonth = month.toString().padStart(2, '0');
			return {
				'YYYY-MM-DD': `${year}-${currentMonth}-${currentDay}`,
				'DD/MM/YYYY': `${currentDay}/${currentMonth}/${year}`,
			};
		},

		normalizeReason(str) {
			let reason = '';
			reason = str.replace(/ª/g, 'a');
			reason = reason.replace(/º/g, 'o');
			reason = reason.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			reason = reason.replace(/\n/g, ' ');

			return reason;
		},

		submit() {
			this.validationState.amount.dirty = true;
			this.validationState.reason.dirty = true;
			this.validationState.frequency.dirty = true;
			this.validationState.date.dirty = true;

			if (this.formHasError) {
				return;
			}

			this.localModel.reason = this.normalizeReason(this.localModel.reason);
			this.$emit('update:value', this.localModel);
		},
	},

	async created() {
		this.transferId = this.value.transferId;
		this.amount = this.value.amount?.amount;
		this.reason = this.value.reason;
		this.periodicity = this.value.periodicity ?? 'today';
		this.date = this.value.date;
		this.maxDate = this.value.maxDate;
		this.frequency = this.value.frequency;

		this.$emit('update:value', {
			...this.value,
			destination: null,
			amount: null,
			reason: null,
			periodicity: null,
			date: null,
			frequency: null,
			maxDate: null,
			fees: null,
			chargeBearer: null,
			favorite: null,
			alias: null,
			notify: null,
			email: null,
			validated: false,
			duplicatedOperation: false,
		});

		this.limits = await this.$store.dispatch('move-money/getLimits');
	},

	watch: {
		date() {
			const { maxDate, date } = this;

			if (maxDate && new Date(maxDate) < new Date(date)) {
				this.maxDate = null;
			}
		},

		periodicity(value) {
			const { date, today } = this;
			if (value === 'scheduled' && date === today) {
				this.date = null;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.w-transfer-amount__header {
	margin: 0 20px;
}

.w-transfer-amount__title {
	padding-top: 30px;
}

.w-transfer-amount__title::before {
	content: '3.' / '';
}

.w-transfer-amount__content {
	padding: 0 0 20px;
	margin: 15px 20px 0;
}

.w-transfer-amount__label {
	display: block;
}

.w-transfer-amount__label:not(:last-child) {
	margin-bottom: 20px;
}

.w-transfer-amount__field {
	margin-top: 10px;
}

.w-transfer-amount__periodicity {
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: 1fr;
	gap: 10px;
	margin-bottom: 20px;
}
</style>
