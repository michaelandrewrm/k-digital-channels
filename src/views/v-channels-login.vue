<template>
	<div class="v-channels-login">
		<div class="v-channels-login__wrapper">
			<header class="v-channels-login__header">
				<div class="v-channels-login__logo">
					<c-icon src="@icons/users" />
				</div>
				<h1 class="v-channels-login__title text-xl-bold">{{ $t('LOGIN.TITLE') }}</h1>
			</header>

			<form @submit.prevent="submit">
				<!-- Username text field starts -->
				<div v-if="!rememberToken" class="v-channels-login__username">
					<c-text-field
						type="text"
						v-model="username"
						:placeholder="$t('LOGIN.USERNAME')"
						ref="usernameInput"
						data-testid="username"
						:useNativeValidation="false"
						outlined
						:valid="
							!(
								(validation.username.dirty && validation.username.invalid) ||
								(validation.access.dirty && validation.access.invalid)
							)
						"
						aria-labelledby="label-username-input"
						aria-controls="username-validation"
						aria-describedby="username-validation"
					></c-text-field>
					<c-text-field-helper-text
						v-if="validation.username.dirty && validation.username.invalid"
						id="username-validation"
						data-testid="username-validation"
						validationMsg
					>
						{{ $t('FORM.FIELD.REQUIRED') }}
					</c-text-field-helper-text>
				</div>
				<!-- Username text field ends -->

				<!-- Password text field starts -->
				<div class="v-channels-login__password">
					<c-text-field
						:type="showPasswordValue ? 'text' : 'password'"
						:placeholder="$t('PASSWORD')"
						v-model="password"
						ref="passwordInput"
						data-testid="password"
						autocomplete="current-password"
						:useNativeValidation="false"
						outlined
						:valid="
							!(
								(validation.password.dirty && validation.password.invalid) ||
								(validation.access.dirty && validation.access.invalid)
							)
						"
						aria-controls="password-validation"
						aria-describedby="password-validation"
					>
						<c-text-field-icon
							@keypress.enter.space="showPasswordValue = !showPasswordValue"
							@click="showPasswordValue = !showPasswordValue"
							slot="trailingIcon"
						>
							<c-icon
								v-if="showPasswordValue"
								:aria-label="$t('FORM.FIELD.HIDE_PASSWORD')"
								src="@icons/eye"
							/>
							<c-icon v-else :aria-label="$t('FORM.FIELD.SHOW_PASSWORD')" src="@icons/eyeSlash" />
						</c-text-field-icon>
					</c-text-field>

					<c-text-field-helper-text
						v-if="validation.access.dirty && validation.access.invalid"
						id="password-validation"
						data-testid="password-validation"
						validationMsg
					>
						{{ $t('FORM.ERROR.INVALID_ACCESS') }}
					</c-text-field-helper-text>

					<c-text-field-helper-text
						v-else-if="validation.password.dirty && validation.password.invalid"
						id="password-validation"
						data-testid="password-validation"
						validationMsg
					>
						{{ $t('FORM.FIELD.REQUIRED') }}
					</c-text-field-helper-text>
				</div>
				<!-- Password text field ends -->

				<!-- Login action buttons starts -->
				<div class="v-channels-login__buttons">
					<c-button
						class="v-channels-login__button"
						data-testid="logInButton"
						unelevated
						type="submit"
						name="btnContinuar"
						raised
					>
						{{ $t('ACTIONS.ENTER') }}
					</c-button>
				</div>
				<!-- Login action buttons ends -->
			</form>
		</div>
	</div>
</template>

<script>
import moduleSession from '@modules/session/m-session';
import moduleAgent from '@assisted/store/modules/agent/m-agent';
import CIcon from '@components/c-icon';
import CButton from '@components/c-button';
import CTextField from '@components/c-text-field';
import CTextFieldIcon from '@components/c-text-field-icon';
import CTextFieldHelperText from '@components/c-text-field-helper-text';
import MNoInternet from '@modals/m-no-internet';
import mq from '@utils/matchMedia';
import { onMobile } from '@theme';

export default {
	name: 'v-channels-login',

	modules: {
		session: moduleSession,
		agent: moduleAgent,
	},

	components: {
		CTextField,
		CTextFieldIcon,
		CTextFieldHelperText,
		CButton,
		CIcon,
	},

	data() {
		return {
			inputUsername: '',
			password: '',
			showPasswordValue: false,
			rememberToken: false,
			validation: {
				username: {
					dirty: false,
					invalid: true,
				},

				password: {
					dirty: false,
					invalid: true,
				},

				access: {
					dirty: false,
					invalid: true,
				},
			},
		};
	},

	computed: {
		isMobile: mq(onMobile),

		username: {
			get() {
				return this.inputUsername;
			},
			set(value) {
				this.inputUsername = value.toUpperCase();
			},
		},
	},

	methods: {
		submit() {
			const { username, password, rememberToken } = this;

			this.validation.username.dirty = true;
			this.validation.password.dirty = true;

			if (this.validation.username.invalid && this.$refs.usernameInput) {
				this.$refs.usernameInput.focus();
				return;
			}

			if (this.validation.password.invalid && this.$refs.passwordInput) {
				this.$refs.passwordInput.focus();
				return;
			}

			this.$store
				.dispatch('agent/login', {
					rememberToken,
					username,
					password,
				})
				.then(this.onLoginSuccess)
				.catch(this.onLoginFailure);
		},

		async reset() {
			this.username = '';
			await this.$nextTick();
			this.validation.username.dirty = false;
		},

		async resetPassword() {
			this.password = '';
			await this.$nextTick();
			this.validation.password.dirty = false;
		},

		async onLoginSuccess({ username: userName, lastLogin }) {
			await this.$store.dispatch('session/setUserSession', {
				userName,
				lastLogin,
			});

			await this.$router.push({ name: 'dashboard' });
		},

		async onLoginFailure({ status, BAD_USER, BAD_PASSWORD, BAD_CREDENTIALS }) {
			if (!status) {
				await this.$store.dispatch('modal/open', MNoInternet);
				await this.resetPassword();
				this.$store.dispatch('loading/end');
			}

			const isBadUser = Boolean(status & BAD_USER);
			const isBadPassword = Boolean(status & BAD_PASSWORD);
			const isBadCredentials = Boolean(status & BAD_CREDENTIALS);

			if (isBadUser) {
				await this.reset();
				this.$refs.usernameInput.focus();
			}

			/* istanbul ignore else */
			if (isBadPassword) {
				await this.resetPassword();
				this.$refs.passwordInput.focus();
			}

			this.validation.access.invalid = isBadCredentials;
			this.validation.access.dirty = true;
		},
	},

	watch: {
		username(value) {
			this.validation.access.dirty = false;
			this.validation.username.dirty = true;
			this.validation.username.invalid = value.length < 1;
		},

		password(value) {
			this.validation.access.dirty = false;
			this.validation.password.dirty = true;
			this.validation.password.invalid = value.length < 1;
		},
	},
};
</script>

<style lang="scss" scoped>
.v-channels-login {
	width: 100%;
	height: 100%;
	background: linear-gradient(
		to bottom,
		RGB(var(--color-secondary)) 0%,
		RGB(var(--color-secondary-dark)) 100%
	);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 15px;
}

.v-channels-login__wrapper {
	width: 100%;
	max-width: 400px;
	padding: 30px;
	background: RGB(var(--color-surface));
	color: RGB(var(--color-text-primary));
	border-radius: 15px;
	margin-left: auto;
	margin-right: auto;
	box-shadow: 0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 20px 31px 3px rgba(0, 0, 0, 0.14),
		0px 8px 38px 7px rgba(0, 0, 0, 0.12);
}

.v-channels-login__logo {
	--bg-color: RGB(var(--color-text-primary));
	color: white;
	text-align: center;
	margin-bottom: 40px;
	background: var(--bg-color);
	font-size: 50px;
	width: 70px;
	height: 70px;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	border-radius: 50%;
	overflow: hidden;
	border: 10px solid var(--bg-color);
	box-sizing: border-box;
	margin: auto;
}

.v-channels-login__title {
	margin-top: 10px;
}

.v-channels-login__header {
	text-align: center;
	margin-bottom: 30px;
	padding: 20px;
}

.v-channels-login__password {
	margin-top: 20px;
}

.v-channels-login__buttons {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
}
.v-channels-login__button {
	width: 100%;
}
</style>
