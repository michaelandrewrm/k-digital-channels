<template>
	<l-transfer-sheet class="w-transfer-destination">
		<div class="w-transfer-edit-beneficiary__header">
			<h2
				class="w-transfer-edit-beneficiary__title text-l-medium"
				tabindex="-1"
				aria-describedby="w-transfer-destination__desc"
			>
				{{ $t('TRANSFERS.BENEFICIARY.EDIT') }}
			</h2>
		</div>

		<div class="w-transfer-edit-beneficiary__group">
			<c-transfer-field
				id="w-transfer-edit-beneficiary__input"
				class="w-transfer-edit-beneficiary__input"
				data-testid="beneficiary"
				v-model.trim="beneficiary"
				maxlength="40"
				:valid="!(validationCode.dirty && validationCode.invalid)"
				required
				:placeholder="$t('TRANSFERS.BENEFICIARY.NAME')"
			>
				<label
					for="w-transfer-edit-beneficiary__input"
					class="w-transfer-edit-beneficiary__label text-m-medium"
				>
					{{ $t('TRANSFERS.BENEFICIARY.TITLE') }}
				</label>
			</c-transfer-field>
			<span
				v-if="validationCode.dirty && validationCode.invalid"
				class="w-transfer-edit-beneficiary__helper text-m-medium"
				data-testid="beneficiary-validation"
			>
				{{ $t('TRANSFERS.BENEFICIARY.INVALID') }}
			</span>
		</div>

		<c-button
			raised
			slot="buttons"
			:disabled="validationCode.invalid"
			@click="close"
			data-testid="close-button"
		>
			{{ $t('ACTIONS.CONTINUE') }}
		</c-button>
	</l-transfer-sheet>
</template>

<script>
import LTransferSheet from '@layouts/l-transfer-sheet';
import CButton from '@components/c-button';
import CTransferField from '@components/c-transfer-field';

export default {
	name: 'w-transfer-edit-beneficiary',

	components: {
		LTransferSheet,
		CButton,
		CTransferField,
	},

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		value: { type: Object, required: true },
	},

	watch: {
		beneficiary: {
			immediate: false,
			handler(newVal) {
				const { validationCode } = this;

				validationCode.dirty = true;

				const MIN_LENGTH = 1;
				this.validationCode.invalid = newVal.trim().length < MIN_LENGTH;
			},
		},
	},

	data() {
		return {
			beneficiary: null,
			validationCode: {
				dirty: false,
				invalid: false,
			},
		};
	},

	methods: {
		close() {
			const localModel = { ...this.value };
			localModel.destination.name = this.beneficiary;
			localModel.validated = null;

			this.$emit('update:value', localModel);
		},
	},

	created() {
		this.beneficiary = this.value.destination.name;
	},
};
</script>

<style>
.w-transfer-edit-beneficiary__header {
	margin: 0 20px;
}

.w-transfer-edit-beneficiary__title {
	padding-top: 30px;
}

.w-transfer-edit-beneficiary__label {
	padding-bottom: 5px;
}

.w-transfer-edit-beneficiary__group {
	display: flex;
	flex-direction: column;
	padding-top: 20px;
	margin: 0 20px;
	width: 100%;
	gap: 5px;
}

.w-transfer-edit-beneficiary__helper {
	color: RGB(var(--color-accent-error));
}
</style>
