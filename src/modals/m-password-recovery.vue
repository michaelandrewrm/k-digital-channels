<template>
	<l-modal modal>
		<template v-slot:header>
			{{ $t('INFO.PASSWORD_RECOVERY.TITLE') }}
		</template>

		<article class="m-password-recovery">
			<p class="m-password-recovery__desc">{{ $t('INFO.PASSWORD_RECOVERY.DESC') }}</p>

			<div class="m-password-recovery__field">
				<c-transfer-field
					id="m-password-recovery__id-number"
					v-model="documentId"
					autocomplete="document-number"
					:placeholder="$t('INFO.PASSWORD_RECOVERY.ID_NUMBER.PLACEHOLDER')"
					:valid="!validations.documentId.error"
					@input="validations.documentId.dirty = true"
					@blur="documentId ? (documentId = documentId.toUpperCase()) : ''"
					data-testid="id-number"
				>
					<label for="m-password-recovery__id-number" class="text-m-medium">
						{{ $t('INFO.PASSWORD_RECOVERY.ID_NUMBER.LABEL') }}
					</label>
				</c-transfer-field>

				<c-transfer-field-helper-text
					for="m-password-recovery__id-number"
					v-if="validations.documentId.error && !validations.documentId.required"
				>
					{{ $t('FORM.FIELD.REQUIRED') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="m-password-recovery__id-number"
					v-else-if="validations.documentId.error && !validations.documentId.validCharacters"
				>
					{{ $t('FORM.FIELD.INVALID_CHARACTERS') }}
				</c-transfer-field-helper-text>
			</div>

			<div class="m-password-recovery__field">
				<c-transfer-field
					id="m-password-recovery__card-number"
					v-model.trim="panValue"
					:placeholder="$t('INFO.PASSWORD_RECOVERY.CARD_NUMBER.PLACEHOLDER')"
					:valid="!validations.pan.error"
					autocomplete="pan-number"
					@input="validations.pan.dirty = true"
					data-testid="card-number"
				>
					<label for="m-password-recovery__card-number" class="text-m-medium">
						{{ $t('INFO.PASSWORD_RECOVERY.CARD_NUMBER.LABEL') }}
					</label>
				</c-transfer-field>

				<c-transfer-field-helper-text
					for="m-password-recovery__card-number"
					v-if="validations.pan.error && !validations.pan.required"
				>
					{{ $t('FORM.FIELD.REQUIRED') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="m-password-recovery__card-number"
					v-else-if="validations.pan.error && !validations.pan.validCharacters"
				>
					{{ $t('FORM.FIELD.INVALID_CHARACTERS') }}
				</c-transfer-field-helper-text>
			</div>

			<div class="m-password-recovery__field">
				<c-transfer-field
					id="m-password-recovery__pin-number"
					v-model="pin"
					:placeholder="$t('INFO.PASSWORD_RECOVERY.PIN.PLACEHOLDER')"
					:valid="!validations.pin.error"
					autocomplete="new-password"
					maxlength="4"
					type="password"
					@input="validations.pin.dirty = true"
					data-testid="pin-number"
				>
					<label for="m-password-recovery__pin-number" class="text-m-medium">
						{{ $t('INFO.PASSWORD_RECOVERY.PIN.LABEL') }}
					</label>
				</c-transfer-field>

				<c-transfer-field-helper-text
					for="m-password-recovery__pin-number"
					v-if="validations.pin.error && !validations.pin.required"
				>
					{{ $t('FORM.FIELD.REQUIRED') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="m-password-recovery__pin-number"
					v-else-if="validations.pin.error && !validations.pin.validCharacters"
				>
					{{ $t('FORM.FIELD.INVALID_CHARACTERS') }}
				</c-transfer-field-helper-text>
			</div>
		</article>

		<template v-slot:buttons>
			<c-button :disabled="isButtonDisabled" raised confirm @click="onSubmit" data-testid="confirm">
				{{ $t('ACTIONS.RECOVER_PASSWORD') }}
			</c-button>
			<c-button
				class="m-password-recovery__cancel text-m-medium"
				href="#"
				@click.prevent="onCancel"
				data-testid="cancel"
			>
				{{ $t('ACTIONS.CANCEL') }}
			</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CTransferField from '@components/c-transfer-field';
import CTransferFieldHelperText from '@components/c-transfer-field-helper-text';
import MError from '@modals/m-error';
import MPasswordReset from '@modals/m-password-reset';

export default {
	name: 'm-password-recovery',

	data() {
		return {
			value: false,
			documentId: '',
			pan: '',
			pin: '',

			validationState: {
				documentId: { dirty: false },
				pan: { dirty: false },
				pin: { dirty: false },
			},
		};
	},

	components: {
		LModal,
		CButton,
		CTransferField,
		CTransferFieldHelperText,
	},

	computed: {
		panValue: {
			get() {
				return this.pan;
			},

			set(value) {
				this.pan = value.replace(/\s+/g, '');
			},
		},

		assessment({ documentId, pan, pin }) {
			return {
				documentId: {
					required: Boolean(documentId),
					validCharacters: documentId && documentId.match(/^[0-9A-Za-z]*$/g),
				},
				pan: {
					required: Boolean(pan),
					validCharacters: pan && pan.match(/^[0-9]*$/g),
				},
				pin: {
					required: Boolean(pin),
					validCharacters: pin && pin.match(/^[0-9]*$/g),
				},
			};
		},

		validations({ assessment }) {
			return Object.entries(assessment).reduce((reducer, [key, props]) => {
				const validationProperties = { ...props };

				Object.defineProperties(validationProperties, {
					invalid: { get: () => !Object.values(assessment[key]).every(Boolean) },
					error: { get: () => this.validations[key].dirty && this.validations[key].invalid },
					dirty: {
						get: () => this.validationState[key].dirty,
						set: (value) => {
							this.validationState[key].dirty = value;
						},
					},
				});

				return { ...reducer, [key]: validationProperties };
			}, {});
		},

		hasInvalidFields({ validations }) {
			return Object.values(validations).some(({ error }) => Boolean(error));
		},

		isButtonDisabled({ documentId, pan, pin, hasInvalidFields }) {
			return (
				(!documentId, !pan, !pin) ||
				(documentId && pan && pin && hasInvalidFields) ||
				(documentId && pan && pin && pin.length < 4)
			);
		},
	},

	methods: {
		onSubmit() {
			this.validationState.documentId.dirty = true;
			this.validationState.pan.dirty = true;
			this.validationState.pin.dirty = true;

			if (this.hasInvalidFields) {
				return;
			}

			const { documentId, pan, pin } = this;
			const { dispatch } = this.$store;

			dispatch('user/recoverPassword', { documentId, pan, pin })
				.then(() => dispatch('modal/open', MPasswordReset))
				.catch(() =>
					dispatch('modal/open', MError)
						.then(() => dispatch('secure/removeSession'))
						.then(() => dispatch('loading/end'))
				)
				.finally(() => dispatch('modal/closeAll'));
		},

		onCancel() {
			this.$emit('close');
			this.$store.dispatch('secure/removeSession');
			this.$store.dispatch('loading/end');
		},
	},
};
</script>

<style lang="scss" scoped>
.m-password-recovery {
	color: RGB(var(--color-text-primary));
	display: flex;
	min-height: 120px;
	margin: 0 auto;
	flex-direction: column;
	padding: 0 10px;
}

.m-password-recovery__field {
	text-align: left;
}

.m-password-recovery__field label {
	display: block;
	margin: 20px 0 10px;
}

.m-password-recovery__field /deep/ .c-transfer-field__input {
	background-color: RGB(var(--color-surface));
	height: 48px;
}

.m-password-recovery__cancel.button:not(:disabled) {
	color: RGB(var(--color-text-primary));
}

.m-password-recovery__cancel.button:active::after {
	opacity: 0;
}
</style>
