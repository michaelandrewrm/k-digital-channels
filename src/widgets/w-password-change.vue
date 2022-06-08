<template>
	<form id="w-password-change">
		<!-- New password text field starts -->
		<div class="w-password-change__password">
			<label class="w-password-change__password-label text-m-medium">
				{{ $t('PASSWORD_CHANGE.LABEL.NEW_PASSWORD') }}
			</label>
			<c-text-field
				:type="showPassword ? 'text' : 'password'"
				v-model.trim="password"
				autocomplete="new-password"
				required
				:valid="!validations.password.error"
				@input="validations.password.dirty = true"
				:useNativeValidation="false"
				aria-controls="password-validation"
				aria-describedby="password-validation"
				outlined
				one-border
				data-testid="input-change-password"
			>
				<c-text-field-icon
					@keypress.enter.space="showPassword = !showPassword"
					@click="showPassword = !showPassword"
					slot="trailingIcon"
				>
					<c-icon
						v-if="showPassword"
						:aria-label="$t('FORM.FIELD.HIDE_PASSWORD')"
						src="@icons/eye"
					/>
					<c-icon v-else :aria-label="$t('FORM.FIELD.SHOW_PASSWORD')" src="@icons/eyeSlash" />
				</c-text-field-icon>
			</c-text-field>

			<c-text-field-helper-text
				v-if="validations.password.error && !validations.password.required"
				id="password-validation"
				class="text-s-book"
				validationMsg
			>
				{{ $t('FORM.FIELD.REQUIRED') }}
			</c-text-field-helper-text>
		</div>
		<!-- New password text field ends -->

		<!-- Strength component starts -->
		<div
			class="w-password-change__password-strength"
			v-if="validations.password.required"
			data-testid="password-strength"
			:data-strength="strength"
			:class="isPasswordStrengthExpanded"
		>
			<p
				v-if="!validations.password.isNotTooLarge"
				class="password-strength__helper-text text-s-book --invalid"
			>
				{{ $t(`PASSWORD_CHANGE.ERROR.INVALID_PASSWORD`) }}
				<span class="helper-text__info-icon" @click="expandPasswordStrength">
					<c-icon size="m" src="@icons/info" v-if="!passwordStrengthExpanded" />
				</span>
			</p>
			<p class="password-strength__helper-text text-s-book" v-else>
				{{ $t(`PASSWORD_CHANGE.STRENGTH.HELPER_TEXT`) }}
				<i
					class="helper-text__level text-s-medium"
					:class="{ '--high': strength === 'HIGH_PASS' }"
					@click="expandPasswordStrength"
				>
					{{ $t(`PASSWORD_CHANGE.STRENGTH.${strength}`) }}
				</i>
				<span class="helper-text__info-icon" @click="expandPasswordStrength">
					<c-icon
						size="l"
						src="@icons/info"
						v-if="!passwordStrengthExpanded && strength !== 'HIGH_PASS'"
					/>
				</span>
				<span class="helper-text__check-icon">
					<c-icon size="m" src="@icons/check" v-if="strength === 'HIGH_PASS'" />
				</span>
			</p>

			<ul
				class="password-strength__requirements text-s-book"
				data-testid="password-strength-requirements"
				v-if="passwordStrengthExpanded && strength !== 'HIGH_PASS'"
			>
				<div class="requirements__indicators">
					<span
						class="indicators__item"
						:class="{
							'--used': strength === 'LOW_PASS' || strength === 'MEDIUM_PASS',
						}"
					></span>
					<span class="indicators__item" :class="{ '--used': strength === 'MEDIUM_PASS' }"></span>
					<span class="indicators__item" :class="{ '--used': strength === 'HIGH_PASS' }"></span>
				</div>

				<li
					class="requirements__item"
					:class="{
						'--used': strength === 'LOW_PASS' || strength === 'MEDIUM_PASS',
					}"
				>
					{{ $t('PASSWORD_CHANGE.REQUIREMENT.MINIMUM') }}
				</li>
				<li class="requirements__item" :class="{ '--used': strengthValidation.oneNumber }">
					{{ $t('PASSWORD_CHANGE.REQUIREMENT.ONE_NUMBER') }}
				</li>
				<li class="requirements__item" :class="{ '--used': strengthValidation.uppercaseLetter }">
					{{ $t('PASSWORD_CHANGE.REQUIREMENT.UPPERCASE_LETTER') }}
				</li>
			</ul>
			<button
				v-if="passwordStrengthExpanded && strength !== 'HIGH_PASS'"
				class="password-strength__close-button"
				:title="$t('MODAL.CLOSE')"
				:aria-label="$t('MODAL.CLOSE')"
				@click="expandPasswordStrength"
			>
				<!-- eslint-disable-line vue-i18n/no-raw-text -->
				&times;
			</button>
		</div>
		<!-- Strength component ends -->

		<!-- Retry new password text field starts -->
		<div class="w-password-change__retry-password">
			<label class="w-password-change__retry-password-label text-m-medium">
				{{ $t('PASSWORD_CHANGE.LABEL.RETRY_NEW_PASSWORD') }}
			</label>
			<c-text-field
				:type="showRetryPassword ? 'text' : 'password'"
				v-model.trim="retryPassword"
				ref="retryPasswordInput"
				autocomplete="new-password"
				required
				:valid="!validations.retryPassword.error"
				@input="validations.retryPassword.dirty = true"
				:useNativeValidation="false"
				aria-controls="retry-password-validation"
				aria-describedby="retry-password-validation"
				outlined
				one-border
				data-testid="input-change-retry-password"
				@keypress.enter="retryPassword && !formHasError ? $emit('submit') : null"
			>
				<c-text-field-icon
					@keypress.enter.space="showRetryPassword = !showRetryPassword"
					@click="showRetryPassword = !showRetryPassword"
					slot="trailingIcon"
				>
					<c-icon
						v-if="showRetryPassword"
						:aria-label="$t('FORM.FIELD.HIDE_PASSWORD')"
						src="@icons/eye"
					/>
					<c-icon v-else :aria-label="$t('FORM.FIELD.SHOW_PASSWORD')" src="@icons/eyeSlash" />
				</c-text-field-icon>
			</c-text-field>

			<c-text-field-helper-text
				v-if="validations.retryPassword.error && !validations.retryPassword.required"
				id="retry-password-validation"
				class="text-s-book"
				validationMsg
			>
				{{ $t('FORM.FIELD.REQUIRED') }}
			</c-text-field-helper-text>
			<c-text-field-helper-text
				v-else-if="validations.retryPassword.error && !validations.retryPassword.equalPasswords"
				id="retry-password-validation"
				class="text-s-book"
				validationMsg
			>
				{{ $t('PASSWORD_CHANGE.ERROR.NOT_EQUALS_PASSWORDS') }}
			</c-text-field-helper-text>
		</div>
		<!-- Retry new password text field ends -->
	</form>
</template>

<script>
import CIcon from '@components/c-icon';
import CTextField from '@components/c-text-field';
import CTextFieldIcon from '@components/c-text-field-icon';
import CTextFieldHelperText from '@components/c-text-field-helper-text';

export default {
	name: 'w-password-change',

	data() {
		return {
			password: '',
			retryPassword: '',
			showPassword: false,
			showRetryPassword: false,
			passwordStrengthExpanded: false,
			validationState: {
				password: { dirty: false },
				retryPassword: { dirty: false },
			},
		};
	},

	components: {
		CIcon,
		CTextField,
		CTextFieldIcon,
		CTextFieldHelperText,
	},

	computed: {
		strengthValidation({ password }) {
			const numbers = '0123456789';
			const abc = 'abcdefghijklmnñopqrstuvwxyz';
			const consecutiveChars = numbers.concat(abc);

			return {
				charactersLength: password.length > 5 && password.length < 11,
				noRepeated: !password.split('').every((char, i, arr) => i === 0 || arr[0] === char),
				noConsecutive: !consecutiveChars.includes(password),
				uppercaseLetter: password.replace(/[^A-Z]/g, '').length > 0,
				oneNumber: /\d/.test(password),
			};
		},

		assessment({ password, retryPassword, strengthValidation }) {
			return {
				password: {
					required: password.length > 0,
					minimumStrengthLevel:
						strengthValidation.charactersLength &&
						strengthValidation.noRepeated &&
						strengthValidation.noConsecutive,
					isNotTooLarge: password.length <= 10,
				},
				retryPassword: {
					required: retryPassword.length > 0,
					equalPasswords: password === retryPassword,
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

		strength({
			strengthValidation: {
				charactersLength,
				noRepeated,
				noConsecutive,
				oneNumber,
				uppercaseLetter,
			},
		}) {
			const low = charactersLength && noRepeated && noConsecutive;
			const medium = low && (oneNumber || uppercaseLetter);
			const high = medium && oneNumber && uppercaseLetter;

			if (high) {
				return 'HIGH_PASS';
			}
			if (medium) {
				return 'MEDIUM_PASS';
			}
			if (low) {
				return 'LOW_PASS';
			}
			return 'TOO_LOW_PASS';
		},

		isPasswordStrengthExpanded({ passwordStrengthExpanded, strength }) {
			return { '--expanded': passwordStrengthExpanded && strength !== 'HIGH_PASS' };
		},
	},

	watch: {
		validations: {
			deep: true,
			immediate: true,
			handler(validations) {
				const isInvalid = Object.values(validations).some(({ invalid }) => Boolean(invalid));
				this.$emit('valid', !isInvalid);
				this.$emit('value', this.password);
			},
		},
	},

	methods: {
		expandPasswordStrength() {
			this.passwordStrengthExpanded = !this.passwordStrengthExpanded;
		},

		reset() {
			this.password = '';
			this.retryPassword = '';
			this.showPassword = false;
			this.showRetryPassword = false;
			this.validationState.password.dirty = false;
			this.validationState.retryPassword.dirty = false;
		},

		submit() {
			this.validationState.password.dirty = true;
			this.validationState.retryPassword.dirty = true;

			if (this.formHasError) {
				return;
			}

			return this.$store.dispatch('user/changePassword', this.password);
		},
	},
};
</script>

<style lang="scss" scoped>
.w-password-change__password,
.w-password-change__retry-password {
	margin-top: 20px;
	text-align: left;
}

.w-password-change__password-label,
.w-password-change__retry-password-label {
	display: block;
	margin-bottom: 10px;
}

.w-password-change__password-strength {
	display: flex;
	position: relative;
	width: 100%;
	margin-top: 10px;
	margin-bottom: 10px;
	border-radius: $border-radius-m;
	flex-direction: column;
}

.w-password-change__password-strength.--expanded {
	padding: 10px;
	box-shadow: 0px 2px 4px 1px RGBA(var(--color-dark-surface), 0.15);
	background-color: RGB(var(--color-surface-light));
}

.password-strength__helper-text {
	display: inline-flex;
	height: 22px;
	align-items: center;
}

.password-strength__helper-text.--invalid {
	color: RGB(var(--color-accent-error));
}

.password-strength__helper-text .helper-text__level {
	margin-left: 3.5px;
	color: RGB(var(--color-accent-error));
	font-style: normal;
	text-decoration: underline;

	&.--high {
		color: RGB(var(--color-accent-success));
	}
	&.--high ~ .helper-text__check-icon .c-icon {
		color: RGB(var(--color-accent-success));
	}
}

.password-strength__helper-text span {
	display: flex;
	height: 100%;
	align-items: center;
	.c-icon {
		cursor: pointer;
		margin-left: 10px;
		color: RGB(var(--color-accent-error));
	}
}

.password-strength__requirements {
	display: inline-flex;
	flex-direction: column;
	text-align: left;
}

.requirements__indicators {
	display: inline-flex;
	width: 100%;
	height: 15px;
	align-items: center;
	justify-content: space-between;
}

.indicators__item {
	width: calc(100% / 3);
	height: 4px;
	border-radius: 1px;
	background-color: RGB(var(--color-accent-error));
	&:not(:last-child) {
		margin-right: 5px;
	}
	&.--used {
		background-color: RGB(var(--color-accent-icon));
	}
}

.requirements__item {
	display: inline-flex;
	margin-top: 4px;
	color: RGB(var(--color-accent-error));
	&.--used {
		color: RGB(var(--color-text-primary));
	}
}

.password-strength__close-button {
	display: inline-flex;
	position: absolute;
	height: 26px;
	width: 26px;
	top: 0;
	right: 0;
	background: transparent;
	color: RGB(var(--color-text-primary));
	padding: 1px;
	border: 0;
	font-family: sans-serif;
	font-size: 26px;
	font-weight: 100;
	line-height: 1;
	justify-content: center;
	align-items: center;
	box-sizing: content-box;
}
</style>
