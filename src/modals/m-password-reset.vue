<template>
	<l-modal modal>
		<template v-slot:header>
			{{ $t('INFO.PASSWORD_RESET.TITLE') }}
		</template>

		<article class="m-password-reset">
			<p class="m-password-reset__desc">{{ $t('INFO.PASSWORD_RESET.DESC') }}</p>

			<div class="m-password-reset__field">
				<label class="m-password-reset__password-label text-m-medium">
					{{ $t('INFO.PASSWORD_RESET.TEMPORAL_PASSWORD') }}
				</label>
				<c-text-field
					id="m-password-reset__password"
					class="m-password-reset__password-input"
					v-model.trim="prevPassword"
					autocomplete="off"
					:type="showPrevPassword ? 'text' : 'password'"
					:valid="!validations.prevPassword.error"
					@input="validations.prevPassword.dirty = true"
					:useNativeValidation="false"
					required
					outlined
					one-border
					data-testid="prevPassword"
				>
					<c-text-field-icon
						@keypress.enter.space="showPrevPassword = !showPrevPassword"
						@click="showPrevPassword = !showPrevPassword"
						slot="trailingIcon"
					>
						<c-icon
							v-if="showPrevPassword"
							:aria-label="$t('FORM.FIELD.HIDE_PASSWORD')"
							src="@icons/eye"
						/>
						<c-icon v-else :aria-label="$t('FORM.FIELD.SHOW_PASSWORD')" src="@icons/eyeSlash" />
					</c-text-field-icon>
				</c-text-field>

				<c-text-field-helper-text
					v-if="validations.prevPassword.error && !validations.prevPassword.required"
					for="m-password-reset__password"
					class="text-s-book"
					validationMsg
				>
					{{ $t('FORM.FIELD.REQUIRED') }}
				</c-text-field-helper-text>
				<c-text-field-helper-text
					v-else-if="validations.prevPassword.error && !validations.prevPassword.isValid"
					for="m-password-reset__password"
					class="text-s-book"
					validationMsg
				>
					{{ $t('FORM.FIELD.INVALID_PASSWORD') }}
				</c-text-field-helper-text>
			</div>

			<w-password-change
				class="m-password-reset__widget"
				ref="passwordChangeWidget"
				@valid="isValidNextPassword = $event"
				@value="nextPassword = $event"
				@submit="submit"
			/>
		</article>

		<template v-slot:buttons>
			<c-button :disabled="isButtonDisabled" raised confirm @click="onSubmit" data-testid="confirm">
				{{ $t('ACTIONS.CHANGE_PWD') }}
			</c-button>
			<c-button
				class="m-password-reset__cancel text-m-medium"
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
import CIcon from '@components/c-icon';
import CButton from '@components/c-button';
import CTextField from '@components/c-text-field';
import CTextFieldIcon from '@components/c-text-field-icon';
import CTextFieldHelperText from '@components/c-text-field-helper-text';
import WPasswordChange from '@widgets/w-password-change';
import MError from '@modals/m-error.vue';
import MPasswordChangeSuccess from '@modals/m-password-change-success.vue';

export default {
	name: 'm-password-reset',

	data() {
		return {
			value: false,
			prevPassword: '',
			nextPassword: '',
			showPrevPassword: false,
			isValidNextPassword: false,
			bannedPasswordList: [],

			validationState: {
				prevPassword: { dirty: false },
			},
		};
	},

	components: {
		LModal,
		CIcon,
		CButton,
		CTextField,
		CTextFieldIcon,
		CTextFieldHelperText,
		WPasswordChange,
	},

	computed: {
		assessment({ prevPassword, bannedPasswordList }) {
			return {
				prevPassword: {
					required: Boolean(prevPassword),
					isValid: !bannedPasswordList.includes(prevPassword),
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

		isButtonDisabled({ prevPassword, isValidNextPassword, hasInvalidFields }) {
			return !prevPassword || hasInvalidFields || !isValidNextPassword;
		},
	},

	methods: {
		onSubmit() {
			this.validationState.prevPassword.dirty = true;

			const { prevPassword, nextPassword } = this;
			const { dispatch } = this.$store;

			this.$store
				.dispatch('user/resetPassword', {
					oldPassword: prevPassword,
					password: nextPassword,
				})
				.then(() =>
					dispatch('modal/open', {
						component: MPasswordChangeSuccess,
						props: { isConfirm: true },
					})
				)
				.then(() => dispatch('modal/closeAll'))
				.catch((err) => {
					if (err?.response?.data?.errorCode === 'C401000201') {
						this.bannedPasswordList.push(prevPassword);
					}

					return dispatch('modal/open', MError);
				})
				.finally(() => dispatch('loading/end'));
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
.m-password-reset {
	color: RGB(var(--color-text-primary));
	display: flex;
	min-height: 120px;
	margin: 0 auto;
	flex-direction: column;
	padding: 0 10px;
}

.m-password-reset__desc {
	margin-bottom: 20px;
}

.m-password-reset__field {
	padding-bottom: 20px;
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.m-password-reset__password-label {
	display: block;
	text-align: left;
	margin-bottom: 10px;
}

.m-password-reset__password-input {
	text-align: left;
}

.m-password-reset__widget /deep/ .w-password-change__password,
.m-password-reset__widget /deep/ .w-password-change__retry-password,
.m-password-reset__password-input {
	--background-color: RGB(var(--color-surface));
}

.m-password-reset__cancel.button:not(:disabled) {
	color: RGB(var(--color-text-primary));
}

.m-password-reset__cancel.button:active::after {
	opacity: 0;
}
</style>
