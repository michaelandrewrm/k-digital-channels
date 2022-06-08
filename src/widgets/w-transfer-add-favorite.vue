<template>
	<div class="w-transfer-add-favorite">
		<section class="w-transfer-add-favorite__info" data-testid="section-email-info">
			<span class="w-transfer-add-favorite__divider" />

			<c-translide immediate appear>
				<div class="w-transfer-add-favorite__group">
					<c-checkbox
						data-testid="notify"
						v-model="notify"
						:label="$t('TRANSFERS.BENEFICIARY.NOTIFY_BENEFICIARY')"
						class="text-m-medium"
					/>

					<c-transfer-field
						data-testid="email-info"
						v-if="notify"
						v-model.trim="email"
						:placeholder="$t('TRANSFERS.BENEFICIARY.EMAIL.EXAMPLE')"
						:valid="!validations.email.error"
						@input="validationState.email.dirty = true"
					/>
					<c-transfer-field-helper-text
						v-if="validations.email.error"
						for="w-transfer-add-favorite__email"
					>
						{{ $t('TRANSFERS.BENEFICIARY.EMAIL.INVALID_ERROR') }}
					</c-transfer-field-helper-text>
				</div>
			</c-translide>
		</section>

		<section class="w-transfer-add-favorite__info" data-testid="section-favorite">
			<span class="w-transfer-add-favorite__divider" />

			<c-translide immediate appear>
				<div class="w-transfer-add-favorite__group">
					<c-checkbox
						data-testid="favorite"
						v-model="favorite"
						:label="$t('TRANSFERS.BENEFICIARY.ADD_TO_FAVORITES')"
						class="text-m-medium"
					/>

					<c-transfer-field
						data-testid="alias"
						v-if="favorite"
						v-model.trim="alias"
						:placeholder="$t('TRANSFERS.BENEFICIARY.ALIAS')"
						maxLength="25"
						:valid="!validations.alias.error"
					/>
					<c-transfer-field-helper-text
						v-if="validations.alias.error && !validations.alias.required"
						for="w-transfer-add-favorite__alias"
					>
						{{ $t('FORM.FIELD.REQUIRED') }}
					</c-transfer-field-helper-text>
					<c-transfer-field-helper-text
						v-if="validations.alias.error && !validations.alias.notBanned"
						for="w-transfer-add-favorite__alias"
					>
						{{ $t('TRANSFERS.BENEFICIARY.ALIAS.REPEATED_ERROR') }}
					</c-transfer-field-helper-text>
					<c-transfer-field-helper-text
						v-if="validations.alias.error && !validations.alias.onlyLetters"
						for="w-transfer-add-favorite__alias"
					>
						{{ $t('TRANSFERS.BENEFICIARY.ALIAS.INVALID_ERROR') }}
					</c-transfer-field-helper-text>
				</div>
			</c-translide>
		</section>
	</div>
</template>

<script>
import CTranslide from '@components/c-translide';
import CTransferField from '@components/c-transfer-field';
import CTransferFieldHelperText from '@components/c-transfer-field-helper-text';
import CCheckbox from '@components/c-checkbox';
import debounce from 'lodash/debounce';
import moveMoneyModule from '@modules/move-money/m-move-money';

import { elementScrollIntoView } from 'seamless-scroll-polyfill';

export default {
	name: 'w-transfer-add-favorite',

	modules: {
		'move-money': moveMoneyModule,
	},

	model: {
		prop: 'model',
		event: 'update:model',
	},

	props: {
		model: { type: Object, required: true },
	},

	components: {
		CTranslide,
		CTransferField,
		CTransferFieldHelperText,
		CCheckbox,
	},

	data() {
		return {
			notify: false,
			email: '',
			alias: '',
			favorite: false,
			aliasesWhiteList: [],
			bannedAliases: [],
			loading: false,
			debouncedValidation: null,
			validationState: {
				alias: { dirty: false },
				email: { dirty: false },
			},
		};
	},

	computed: {
		localModel({ favorite, alias, model, notify, email }) {
			return {
				...model,
				favorite,
				alias,
				notify,
				email,
			};
		},

		assessment({ model: { favorite, alias, notify, email }, bannedAliases, isExternallyValid }) {
			// from: https://ui.dev/validate-email-address-javascript/
			const reEmailValid = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

			return {
				alias: {
					required: Boolean(!favorite || alias),
					onlyLetters:
						!favorite || Boolean(alias && alias.match(/^[0-9A-ZÀ-ÖØ-öø-ÿ\s:()¿?.,_-]*$/i)),
					notBanned: !bannedAliases.includes(alias),
				},
				aliasExternal: {
					externallyValidated: !favorite || isExternallyValid,
				},
				email: {
					required: Boolean(!notify || email),
					valid: !notify || Boolean(email && email.match(reEmailValid)),
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

		isAliasPendingForValidation({
			alias,
			validations: {
				alias: { invalid },
			},
		}) {
			return !invalid && alias;
		},

		isExternallyValid({ favorite, aliasesWhiteList, alias }) {
			return !favorite || aliasesWhiteList.includes(alias);
		},

		formIsInvalid({ validations }) {
			return Object.values(validations).some(({ invalid }) => Boolean(invalid));
		},
	},

	watch: {
		'localModel.alias': function modelAlias() {
			const { favorite } = this.model;

			this.$emit('update:model', this.localModel);

			if (favorite) {
				this.validations.alias.dirty = true;
			}
		},

		'isAliasPendingForValidation': function isAliasPendingForValidation(pending) {
			if (pending) {
				this.validateAlias();
			}
		},

		'localModel.favorite': function modelFavorite(favorite) {
			if (!favorite) {
				this.alias = '';
				this.validations.alias.dirty = false;
			}

			this.$emit('update:model', this.localModel);
		},

		'localModel.notify': function modelNotify(value) {
			if (!value) {
				this.email = '';
				this.validationState.email.dirty = false;
			}

			this.$emit('update:model', this.localModel);
		},

		'localModel.email': function modelEmail(value) {
			if (!value) {
				this.validationState.email.dirty = false;
			}

			this.$emit('update:model', this.localModel);
		},

		'favorite': function favorite(isSelected) {
			if (isSelected) {
				this.scrollDown();
			}
		},

		'notify': function notify(isSelected) {
			if (isSelected) {
				this.scrollDown();
			}
		},

		'formIsInvalid': function formIsInvalid(value) {
			if (value) {
				this.$emit('error');
			} else {
				this.$emit('success');
			}
		},
	},

	methods: {
		validateAlias() {
			if (!this.aliasesWhiteList.includes(this.alias)) {
				this.loading = true;

				this.debouncedValidation();
			} else {
				this.debouncedValidation.cancel();
			}
		},

		externallyValidateAlias() {
			const { alias } = this;

			this.$store
				.dispatch('move-money/validateFavorite', this.model)
				.then(() => true)
				.catch(() => false)
				.then((status) => {
					this.loading = false;

					if (status) {
						this.aliasesWhiteList.push(alias);
					} else {
						this.bannedAliases.push(alias);
					}
				});
		},

		scrollDown() {
			const target = this.$el.querySelector('label');

			if (target) {
				target.focus({ preventScroll: true });
				setTimeout(() => {
					elementScrollIntoView(target, { behavior: 'smooth' });
				}, 500);
			}
		},
	},

	created() {
		this.favorite = this.model.favorite;
		this.alias = this.model.alias;
		this.notify = this.model.notify;
		this.email = this.model.email;
		this.debouncedValidation = debounce(this.externallyValidateAlias, 500);
	},

	mounted() {
		this.$nextTick(this.scrollDown);
	},
};
</script>

<style lang="scss" scoped>
.w-transfer-add-favorite {
	display: flex;
	position: relative;
	flex-direction: column;
	flex-grow: 1;
	flex-shrink: 1;
	padding: 0 10px 40px;
}

.w-transfer-add-favorite__group {
	margin: 10px 10px 0;

	& > :not(:last-child) {
		margin-bottom: 10px;
	}
}

.w-transfer-add-favorite__divider {
	display: flex;
	position: relative;
	height: 8px;
	margin: 0 10px;
}
</style>
