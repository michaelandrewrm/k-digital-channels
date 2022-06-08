<template>
	<l-transfer-sheet class="w-transfer-new-destination">
		<div class="w-transfer-new-destination__header">
			<c-icon-button
				v-if="closable"
				class="w-transfer-new-destination__close-icon"
				@click="$emit('close')"
				@keypress.enter="$emit('close')"
				icon="@icons/close"
			/>

			<h2 class="w-transfer-new-destination__title text-m-medium" tabindex="-1">
				{{ $t('TRANSFERS.FILL_DATA') }}
			</h2>
		</div>

		<div class="w-transfer-new-destination__content">
			<div class="w-transfer-new-destination__group">
				<c-transfer-field
					id="w-transfer-new-destination__name"
					data-testid="name"
					ref="name"
					v-model.trim="name"
					required
					:placeholder="$t('TRANSFERS.BENEFICIARY.NAME')"
					:valid="!validations.name.error"
					@input="validations.name.dirty = true"
					@blur="name ? (name = name.toUpperCase()) : ''"
					:maxLength="MAX_NAME_LENGTH"
				>
					<label for="w-transfer-new-destination__name" class="w-transfer-new-destination__label">
						{{ $t('TRANSFERS.BENEFICIARY.NAME') }}
					</label>
				</c-transfer-field>

				<c-transfer-field-helper-text
					for="w-transfer-new-destination__name"
					v-if="validations.name.error && !validations.name.required"
				>
					{{ $t('FORM.FIELD.REQUIRED') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-transfer-new-destination__name"
					v-else-if="validations.name.error && !validations.name.allowedCharacters"
				>
					{{ $t('TRANSFERS.REASON_ERROR') }}
				</c-transfer-field-helper-text>
			</div>

			<div class="w-transfer-new-destination__group">
				<c-transfer-field
					id="w-transfer-new-destination__iban"
					class="w-transfer-new-destination__iban"
					data-testid="iban"
					ref="iban"
					v-model.trim="iban"
					required
					:placeholder="$t('TRANSFERS.BENEFICIARY.IBAN.EXAMPLE')"
					:valid="!validations.iban.error"
					@input="validations.iban.dirty = true"
					@blur="formatIBAN"
					maxLength="42"
				>
					<label for="w-transfer-new-destination__iban" class="w-transfer-new-destination__label">
						{{ $t('TRANSFERS.BENEFICIARY.IBAN') }}
						<span
							data-testid="iban-info"
							class="w-transfer-new-destination__label-icon text-l-medium"
							@click="openIBANInfo"
						>
							<c-icon src="@icons/info" />
						</span>
					</label>
				</c-transfer-field>

				<c-transfer-field-helper-text
					for="w-transfer-new-destination__iban"
					v-if="validations.iban.error && !validations.iban.required"
				>
					{{ $t('FORM.FIELD.REQUIRED') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-transfer-new-destination__iban"
					v-else-if="validations.iban.error && !validations.iban.isNotOrigin"
				>
					{{ $t('TRANSFERS.BENEFICIARY.IBAN_SAME_AS_ORIGIN') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-transfer-new-destination__iban"
					v-else-if="validations.iban.error && !validations.iban.isValid"
				>
					{{ $t('TRANSFERS.BENEFICIARY.INVALID_IBAN') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-transfer-new-destination__iban"
					v-else-if="validations.iban.error && !validations.iban.allowedCharacters"
				>
					{{ $t('TRANSFERS.REASON_ERROR') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text for="w-transfer-new-destination__iban" persistent>
					{{ $t('TRANSFERS.BENEFICIARY.IBAN.HELPER') }}
				</c-transfer-field-helper-text>
			</div>

			<div
				class="w-transfer-new-destination__group"
				v-if="isInternationalOrSEPA && !validations.iban.error"
			>
				<label class="w-transfer-new-destination__label">
					{{ $t('TRANSFERS.INTERNATIONAL_TITLE') }}
				</label>

				<p class="text-s-light">
					{{ $t('TRANSFERS.INTERNATIONAL_DESC') }}
				</p>
			</div>

			<div
				class="w-transfer-new-destination__group"
				v-if="isInternationalOrSEPA && !validations.iban.error"
			>
				<c-transfer-field
					id="w-transfer-new-destination__bic"
					class="w-transfer-new-destination__bic"
					data-testid="bic"
					ref="bic"
					v-model.trim="bic"
					required
					:placeholder="$t('TRANSFERS.BENEFICIARY.BIC.EXAMPLE')"
					:valid="!validations.bic.error"
					maxLength="42"
					@blur="bic ? (bic = bic.toUpperCase()) : ''"
				>
					<label for="w-transfer-new-destination__bic" class="w-transfer-new-destination__label">
						{{ $t('TRANSFERS.BENEFICIARY.BIC') }}
						<span
							data-testid="bic-info"
							class="w-transfer-new-destination__label-icon text-l-medium"
							@click="openBICInfo"
						>
							<c-icon src="@icons/info" />
						</span>
					</label>
				</c-transfer-field>

				<c-transfer-field-helper-text
					for="w-transfer-new-destination__bic"
					v-if="validations.bic.error && !validations.bic.required"
				>
					{{ $t('FORM.FIELD.REQUIRED') }}
				</c-transfer-field-helper-text>

				<c-transfer-field-helper-text
					for="w-transfer-new-destination__bic"
					v-if="validations.bic.error && !validations.bic.isValid"
				>
					{{ $t('TRANSFERS.BENEFICIARY.BIC.INVALID_ERROR') }}
				</c-transfer-field-helper-text>
			</div>

			<span class="w-transfer-new-destination__divider" />

			<div class="w-transfer-new-destination__group" v-if="false">
				<c-checkbox
					data-testid="favorite"
					v-model="favorite"
					:label="$t('TRANSFERS.BENEFICIARY.ADD_TO_FAVORITES')"
					class="text-m-medium"
				/>
			</div>

			<div class="w-transfer-new-destination__group" v-if="false">
				<c-transfer-field
					data-testid="favname"
					v-if="favorite"
					v-model.trim="alias"
					id="w-transfer-new-destination__alias"
					:placeholder="$t('TRANSFERS.BENEFICIARY.NAME')"
				/>
			</div>
		</div>

		<c-button raised slot="buttons" @click="submit" data-testid="submit">
			{{ $t('ACTIONS.CONTINUE') }}
		</c-button>
	</l-transfer-sheet>
</template>

<script>
import IBAN from 'iban';
import moveMoneyModule from '@modules/move-money/m-move-money';
import LTransferSheet from '@layouts/l-transfer-sheet';
import CTransferFieldHelperText from '@components/c-transfer-field-helper-text';
import CTransferField from '@components/c-transfer-field';
import CCheckbox from '@components/c-checkbox';
import CIconButton from '@components/c-icon-button';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon.vue';

import MTransferIBANInfo from '@modals/m-transfer-iban-info';
import MTransferBICInfo from '@modals/m-transfer-bic-info';

export default {
	name: 'w-transfer-new-destination',

	modules: {
		'move-money': moveMoneyModule,
	},

	components: {
		LTransferSheet,
		CTransferFieldHelperText,
		CTransferField,
		CCheckbox,
		CIconButton,
		CButton,
		CIcon,
	},

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		value: { type: Object, required: true },
		closable: { type: Boolean },
	},

	data() {
		return {
			rawName: '',
			rawIBAN: '',
			rawBIC: '',
			alias: '',
			favorite: false,
			loading: false,
			transferMode: 'INTERNAL',
			bannedIBANList: [],
			MAX_NAME_LENGTH: 40,

			validationState: {
				name: { dirty: false },
				iban: { dirty: false },
				bic: { dirty: false },
				alias: { dirty: false },
			},
		};
	},

	watch: {
		// Si el usuario cambia de una internacional a nacional
		// aseguramos que la información extra
		// para internacionales es reseteada
		isInternationalOrSEPA(value) {
			if (!value && this.bic) {
				this.bic = '';
			}
		},
	},

	computed: {
		name: {
			get() {
				return this.rawName;
			},
			set(value) {
				this.rawName = value;
			},
		},

		bic: {
			get() {
				return this.rawBIC;
			},
			set(value) {
				this.rawBIC = value;
			},
		},

		iban: {
			get() {
				return this.rawIBAN;
			},
			set(value) {
				if (IBAN.isValidBBAN('ES', value)) {
					this.rawIBAN = IBAN.toBBAN(IBAN.fromBBAN('ES', value));
				} else {
					this.rawIBAN = value ?? '';
				}
			},
		},

		isIBAN({ iban }) {
			return iban.length >= 2 && iban.match(/^[A-Z]{2}/i);
		},

		isLocalIBAN({ iban, isIBAN }) {
			return isIBAN && iban.toUpperCase().startsWith('ES');
		},

		isInternationalOrSEPA({ isIBAN, isLocalIBAN }) {
			return isIBAN && !isLocalIBAN;
		},

		originIBAN({ localModel: { origin } }) {
			return origin?.productNumber?.value;
		},

		localModel({ value, name, iban, bic, favorite, transferMode }) {
			const rawIBAN = IBAN.electronicFormat(iban);
			const isCCC = IBAN.isValidBBAN('ES', iban);

			return {
				...value,
				destination: {
					account: {
						type: isCCC ? 'CCC' : 'IBAN',
						id: rawIBAN,
						bic: bic?.toUpperCase(),
					},
					transferMode,
					name,
					favorite,
					view: {
						name,
						id: this.$pn({
							value: rawIBAN,
							format: { id: 'IBAN' },
						}),
					},
				},
			};
		},

		assessment({
			name,
			iban,
			bic,
			isInternationalOrSEPA,
			bannedIBANList,
			originIBAN,
			MAX_NAME_LENGTH,
		}) {
			const rawIBAN = IBAN.electronicFormat(iban);
			const isCCC = IBAN.isValidBBAN('ES', iban);

			return {
				name: {
					required: Boolean(name),
					maxLength: name && name.length <= MAX_NAME_LENGTH,
					allowedCharacters: Boolean(
						name && name.match(/^[0-9A-Z\s-/¿?:().,'+ºª\u00C0-\u00FF]*$/i)
					),
				},
				iban: {
					required: Boolean(iban),
					isValid: !bannedIBANList.includes(rawIBAN) || isCCC,
					isNotOrigin: originIBAN !== rawIBAN,
					allowedCharacters: Boolean(iban && iban.match(/^[0-9A-Z\s]*$/i)),
				},
				bic: {
					required: !isInternationalOrSEPA || Boolean(bic),
					isValid:
						!bic ||
						(bic.length >= 8 && bic.length <= 11 && bic.substr(4, 2) === rawIBAN.substr(0, 2)),
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
		formatIBAN() {
			const { iban } = this;

			if (iban && iban.match(/^[A-Z]/i)) {
				this.rawIBAN = IBAN.printFormat(iban);
			}
		},

		openIBANInfo() {
			return this.$store.dispatch('modal/open', MTransferIBANInfo);
		},

		openBICInfo() {
			return this.$store.dispatch('modal/open', MTransferBICInfo);
		},

		normalizeName(str) {
			let name = '';
			name = str.replace(/ª/g, 'a');
			name = name.replace(/º/g, 'o');
			name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

			return name;
		},

		submit() {
			this.validationState.name.dirty = true;
			this.validationState.iban.dirty = true;
			this.validationState.bic.dirty = true;
			this.validationState.alias.dirty = true;

			const { iban, bic } = this;

			const rawIBAN = IBAN.electronicFormat(iban);

			if (
				(this.isIBAN && !IBAN.isValid(rawIBAN)) ||
				(!this.isIBAN && !IBAN.isValidBBAN('ES', rawIBAN))
			) {
				/* istanbul ignore else */
				if (!this.bannedIBANList.includes(rawIBAN)) {
					this.bannedIBANList.push(rawIBAN);
				}
			}

			if (this.formHasError) {
				return;
			}

			const { destination } = this.localModel;

			this.$store
				.dispatch('move-money/validateXBAN', {
					iban: rawIBAN,
					type: destination.account.type,
					bic,
					origin: this.value.origin?.id,
				})
				.then(([{ transferMode }]) => {
					this.transferMode = transferMode;
					this.name = this.normalizeName(destination.name)?.toUpperCase();
					this.$emit('update:value', this.localModel);
				})
				.catch(() => {
					this.bannedIBANList.push(rawIBAN);
				});
		},
	},

	created() {
		this.name = this.value.destination?.name;
		this.iban = this.value.destination?.account?.id;
		this.bic = this.value.destination?.account?.bic;
		this.favorite = Boolean(this.value.destination?.favorite);

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
			validated: false,
			duplicatedOperation: false,
		});
	},
};
</script>

<style lang="scss" scoped>
.w-transfer-new-destination__header {
	margin: 0 20px;
	padding-top: 30px;
}

.w-transfer-new-destination__close-icon {
	position: absolute;
	top: 0;
	right: 0;
	margin-top: 20px;
	margin-right: 20px;
	user-select: none;
	outline: none;
}

.w-transfer-new-destination__title::before {
	content: '2.' / '';
}

.w-transfer-new-destination__desc {
	margin-top: 10px;
}

.w-transfer-new-destination__content {
	margin: 0 20px;
	padding-bottom: 30px;
}

.w-transfer-new-destination__group {
	display: block;
	position: relative;
	width: 100%;
	padding-top: 20px;
}

.w-transfer-new-destination__label {
	display: inline-flex;
	align-items: center;
	padding-bottom: 10px;
	@extend %typo-m-medium;
}

.w-transfer-new-destination__label-icon {
	display: inline-flex;
	margin-left: 10px;
	@media (hover) {
		cursor: pointer;
	}
}

.w-transfer-new-destination__iban {
	font-variant: tabular-nums;
}

.w-transfer-new-destination__divider:not(:last-child) {
	display: flex;
	position: relative;
	height: 18px;
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}
</style>
