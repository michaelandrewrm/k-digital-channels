<template>
	<l-transfer-sheet class="w-transfer-fees">
		<div class="w-transfer-fees__header">
			<h2
				class="w-transfer-fees__title text-m-medium"
				tabindex="-1"
				aria-describedby="w-transfer-fees__desc"
			>
				{{ $t('TRANSFERS.OPERATION_FEES_TITLE') }}
				<span
					data-testid="iban-info"
					class="w-transfer-fees__label-icon text-l-medium"
					@click="openModalInfo"
				>
					<c-icon src="@icons/info" />
				</span>
			</h2>
			<p class="w-transfer-fees__desc text-m-light" id="w-transfer-fees__desc">
				{{ $t('TRANSFERS.OPERATION_FEES_DESC') }}
			</p>
		</div>

		<div class="w-transfer-fees__content">
			<div class="w-transfer-fees__row" v-if="fees && fees.fee">
				<div class="w-transfer-fees__row-title text-m-medium">
					{{ $t('TRANSFERS.FEES').concat(':') }}
				</div>
				<div class="w-transfer-fees__row-separator" />
				<div class="w-transfer-fees__row-amount text-m-medium">{{ $nc(fees.fee) }}</div>
			</div>
			<div class="w-transfer-fees__row" v-if="fees && fees.expense">
				<div class="w-transfer-fees__row-title text-m-medium">
					{{ $t('TRANSFERS.EXPENSES').concat(':') }}
				</div>
				<div class="w-transfer-fees__row-separator" />
				<div class="w-transfer-fees__row-amount text-m-medium">{{ $nc(fees.expense) }}</div>
			</div>

			<div class="text-s-medium color-text-error" data-testid="error-balance" v-if="exceedsBalance">
				{{
					$t('TRANSFERS.FEES.ERROR_BALANCE', {
						amount: $nc(fees.total),
						balance: $nc(model.origin.balance),
					})
				}}
			</div>

			<div class="w-transfer-fees__group">
				<div
					data-testid="radio-our"
					class="w-transfer-fees__row --two-columns"
					@click="chargeBearer = 'OUR'"
				>
					<c-transfer-radio name="fees-our" v-model="chargeBearer" value="OUR" />
					<div class="w-transfer-fees__radio-label text-m-medium">
						{{ $t('TRANSFERS.FEES.OUR') }}
					</div>
				</div>
				<div
					data-testid="radio-sha"
					class="w-transfer-fees__row --two-columns"
					@click="chargeBearer = 'SHA'"
				>
					<div class="w-trasnfer-fees__radio">
						<c-transfer-radio name="fees-sha" v-model="chargeBearer" value="SHA" />
					</div>
					<div class="w-transfer-fees__radio-label text-m-medium">
						{{ $t('TRANSFERS.FEES.SHA') }}
					</div>
				</div>
				<div
					data-testid="radio-ben"
					class="w-transfer-fees__row --two-columns"
					@click="chargeBearer = 'BEN'"
				>
					<div class="w-trasnfer-fees__radio">
						<c-transfer-radio name="fees-ben" v-model="chargeBearer" value="BEN" />
					</div>
					<div class="w-transfer-fees__radio-label text-m-medium">
						{{ $t('TRANSFERS.FEES.BEN') }}
					</div>
				</div>
			</div>

			<div class="text-s-light">{{ $t('TRANSFERS.FEES.WARNING') }}</div>
		</div>

		<c-button raised slot="buttons" @click="submit" data-testid="submit">
			{{ $t('ACTIONS.CONTINUE') }}
		</c-button>
	</l-transfer-sheet>
</template>

<script>
import LTransferSheet from '@layouts/l-transfer-sheet';
import CTransferRadio from '@components/c-transfer-radio';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon.vue';
import MTransferFeesInfo from '@modals/m-transfer-fees-info';

export default {
	name: 'w-transfer-fees',

	components: {
		LTransferSheet,
		CTransferRadio,
		CButton,
		CIcon,
	},

	model: {
		prop: 'model',
		event: 'update:model',
	},

	props: {
		model: { type: Object, required: true },
	},

	data() {
		return {
			chargeBearer: '',
			fees: null,
		};
	},

	computed: {
		localModel({ model, chargeBearer }) {
			return {
				...model,
				chargeBearer,
			};
		},

		exceedsBalance({ model, fees }) {
			return fees.total.amount > model.origin.balance.amount;
		},
	},

	methods: {
		submit() {
			this.$emit('update:model', this.localModel);
		},

		openModalInfo() {
			return this.$store.dispatch('modal/open', MTransferFeesInfo);
		},
	},

	created() {
		this.fees = this.model?.fees;
		this.chargeBearer = this.model?.chargeBearer || 'SHA';

		this.$emit('update:model', {
			...this.model,
			chargeBearer: null,
			favorite: null,
			alias: null,
			validated: false,
		});
	},
};
</script>

<style lang="scss" scoped>
.w-transfer-fees__header {
	margin: 0 20px;
}

.w-transfer-fees__title {
	display: inline-flex;
	align-items: center;
	padding-top: 30px;
}

.w-transfer-fees__content {
	padding: 0 0 20px;
	margin: 15px 20px 0;
}

.w-transfer-fees__desc {
	margin-top: 10px;
}

.w-transfer-fees__group {
	padding: 20px 10px;
}

.w-transfer-fees__row {
	display: grid;
	position: relative;
	max-width: 320px;
	color: RGB(var(--color-text-primary));
	grid-template-columns: min-content 1fr min-content;
	margin-bottom: 10px;
	align-items: center;
}

.w-transfer-fees__row.--two-columns {
	grid-template-columns: min-content 1fr;
	margin-bottom: 20px;
}

.w-transfer-fees__row-separator {
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
	margin: 10px;
}

.w-transfer-fees__label-icon {
	display: inline-flex;
	margin-left: 10px;
	@media (hover) {
		cursor: pointer;
	}
}
</style>
