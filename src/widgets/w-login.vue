<template>
	<div class="w-login">
		<div class="w-login__header" :class="{ '--hide': hideLogotype }">
			<div class="w-login__logotype">
				<img src="@assets/img/logo-kukentok.svg" class="w-login__logotype-icon" />
			</div>
		</div>

		<div class="w-login__content">
			<div class="w-login__suggestions-button">
				<c-icon-button
					v-if="isMobile"
					:class="{ '--collapse': hideLogotype }"
					:aria-label="$t('LOGIN.SECURITY_SUGGESTIONS')"
					icon="@icons/shield"
					@click="openSecuritySuggestions"
					data-testid="suggestions-button"
				/>
			</div>

			<form class="w-login__form" :class="{ '--collapse': hideLogotype }" @submit.prevent="submit">
				<div v-if="isUserRemember" class="w-login__form-group">
					<!-- this hidden input cancel browser autofill -->
					<input type="password" name="password" autocomplete="new-password" hidden />

					<div class="w-login__remembered-user" data-testid="remembered-user">
						<h1 class="text-xl-bold">{{ $t('LOGIN.HELLO', { name: userName }) }}</h1>

						<a
							href="#"
							class="w-login__stop-remember-user text-m-medium"
							@click.prevent="reset"
							data-testid="stop-remembered-user"
						>
							{{ $t('LOGIN.NOT_ME', { name: userName }) }}
						</a>
					</div>
				</div>

				<div v-if="!isUserRemember" class="w-login__form-group">
					<c-text-field
						id="w-login__username"
						ref="usernameInput"
						v-model="username"
						:placeholder="$t('FORM.PLACEHOLDER.USERNAME')"
						:useNativeValidation="false"
						:valid="!validations.username.error && !error"
						type="email"
						autocomplete="dni"
						@focus="isUsernameFocus = true"
						@blur="isUsernameFocus = false"
						@input="onUsernameInput"
						aria-labelledby="w-login__username-label"
						aria-controls="w-login__username-label"
						aria-describedby="w-login__username-label"
						data-testid="username"
					/>
					<c-text-field-helper-text
						v-if="validations.username.error && !validations.username.required"
						id="w-login__username-label"
						for="w-login__username"
						data-testid="username-label"
						validationMsg
					>
						{{ $t('FORM.ERROR.REQUIRED') }}
					</c-text-field-helper-text>
				</div>

				<div class="w-login__form-group">
					<c-text-field
						id="w-login__password"
						ref="passwordInput"
						v-model="password"
						:placeholder="$t('FORM.PLACEHOLDER.PASSWORD')"
						:useNativeValidation="false"
						:valid="!validations.password.error && !error"
						:type="showPasswordValue ? 'text' : 'password'"
						maxlength="10"
						autocomplete="current-password"
						@focus="isPasswordFocus = true"
						@blur="isPasswordFocus = false"
						@input="onPasswordInput"
						aria-controls="w-login__password-label"
						aria-describedby="w-login__password-label"
						data-testid="password"
					>
						<c-text-field-icon
							@keypress.enter.space="showPasswordValue = !showPasswordValue"
							@click="showPasswordValue = !showPasswordValue"
							slot="trailingIcon"
						>
							<c-icon
								v-if="showPasswordValue"
								:aria-label="$t('LOGIN.HIDE_PASSWORD')"
								src="@icons/eye"
							/>
							<c-icon v-else :aria-label="$t('LOGIN.SHOW_PASSWORD')" src="@icons/eyeSlash" />
						</c-text-field-icon>
					</c-text-field>

					<c-text-field-helper-text
						v-if="validations.password.error && !validations.password.required"
						id="w-login__password-label"
						for="w-login__password"
						data-testid="password-label"
						validationMsg
					>
						{{ $t('FORM.ERROR.REQUIRED') }}
					</c-text-field-helper-text>

					<c-text-field-helper-text
						v-else-if="error"
						id="w-login__password-label"
						for="w-login__password-label"
						data-testid="password-label"
						validationMsg
					>
						{{ $t('FORM.ERROR.INVALID_ACCESS') }}
					</c-text-field-helper-text>
				</div>

				<div class="w-login__form-group">
					<a
						class="w-login__remember-password text-m-book"
						href="#"
						@keypress.enter.space="openPasswordRecovery"
						@click.prevent="openPasswordRecovery"
						aria-haspopup="dialog"
						data-testid="remember-password"
					>
						{{ $t('LOGIN.REMEMBER_PASSWORD') }}
					</a>
				</div>

				<div v-if="!isUserRemember" class="w-login__form-group">
					<c-checkbox
						id="w-login__remember-user"
						class="w-login__remember-user text-m-book"
						v-model="isUserRemember"
						:label="$t('LOGIN.IS_MY_DEVICE')"
						@click.native.capture="openRememberUser"
						@keydown.native.capture.space="openRememberUser"
						data-testid="remember-user"
					/>
				</div>

				<div class="w-login__actions" :class="{ '--collapse': hideLogotype }">
					<c-button
						class="w-login__submit"
						type="submit"
						raised
						:disabled="isButtonDisabled"
						data-testid="confirm-button"
					>
						{{ $t('ACTIONS.ENTER') }}
					</c-button>

					<c-button
						class="w-login__register"
						outlined
						:href="onboardingUrl"
						data-testid="register-button"
					>
						{{ $t('ACTIONS.BECOME_A_CUSTOMER') }}
					</c-button>

					<a
						v-if="!isMobile"
						class="w-login__suggestions-link text-m-book"
						href="#"
						@keypress.enter.space="openSecuritySuggestions"
						@click.prevent="openSecuritySuggestions"
						aria-haspopup="dialog"
						data-testid="suggestions-link"
					>
						{{ $t('LOGIN.SECURITY_SUGGESTIONS') }}
					</a>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import CIcon from '@components/c-icon';
import CButton from '@components/c-button';
import CIconButton from '@components/c-icon-button';
import CCheckbox from '@components/c-checkbox';
import CTextField from '@components/c-text-field';
import CTextFieldIcon from '@components/c-text-field-icon';
import CTextFieldHelperText from '@components/c-text-field-helper-text';
import sessionModule from '@modules/session/m-session';
import authnModule from '@skyline/store/modules/authn/m-authn';
import productsModule from '@modules/products/m-products';
import MSecuritySuggestions from '@modals/m-security-suggestions';
import MEnableRememberUser from '@modals/m-enable-remember-user';
import MNoInternet from '@modals/m-no-internet';
import MPasswordRecovery from '@modals/m-password-recovery';
import MSomethingWrong from '@modals/m-something-wrong';
import mq from '@utils/matchMedia';
import { onMobile } from '@theme';
import { cypherSha256 } from '@modules/secure/cypher';

export default {
	name: 'w-login',

	components: {
		CTextField,
		CTextFieldIcon,
		CTextFieldHelperText,
		CCheckbox,
		CIconButton,
		CButton,
		CIcon,
	},

	modules: {
		session: sessionModule,
		authn: authnModule,
		products: productsModule,
	},

	data() {
		return {
			loading: false,
			error: false,
			isUserRemember: false,
			isUsernameFocus: false,
			username: '',
			password: '',
			showPasswordValue: false,
			rememberTermsAccepted: false,

			validationState: {
				username: { dirty: false },
				password: { dirty: false },
			},
		};
	},

	computed: {
		isMobile: mq(onMobile),

		...mapState('app', ['onboardingUrl']),
		...mapState('session', ['rememberToken', 'userName']),

		hideLogotype({ isMobile, isUsernameFocus }) {
			return isMobile && isUsernameFocus;
		},

		assessment({ username, password }) {
			return {
				username: {
					required: Boolean(username),
				},
				password: {
					required: Boolean(password),
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

		isButtonDisabled({ hasInvalidFields, loading, error }) {
			return hasInvalidFields || (loading || error);
		},
	},

	methods: {
		onUsernameInput() {
			if (this.username) {
				this.validationState.username.dirty = true;
				this.error = false;
				this.loading = false;
			}
		},

		onPasswordInput() {
			if (this.password) {
				this.validationState.password.dirty = true;
				this.error = false;
				this.loading = false;
			}
		},

		openSecuritySuggestions() {
			return this.$store.dispatch('modal/open', MSecuritySuggestions);
		},

		openPasswordRecovery() {
			const { dispatch } = this.$store;

			dispatch('authn/loginAnonymous')
				.then(() => dispatch('loading/start'))
				.then(() => dispatch('modal/open', MPasswordRecovery))
				.catch(() => dispatch('modal/open', MSomethingWrong).then(() => dispatch('loading/end')))
				.finally(() => {
					this.isPasswordRecoveryOpened = false;
				});
		},

		openNoInternet() {
			return this.$store.dispatch('modal/open', MNoInternet);
		},

		async openRememberUser(e) {
			/* istanbul ignore else */
			if (!this.rememberTermsAccepted) {
				e.stopPropagation();
				e.preventDefault();

				const response = await this.$store.dispatch('modal/open', MEnableRememberUser);
				this.rememberTermsAccepted = response;
				this.isUserRemember = response;
			}
		},

		async reset() {
			await this.$store.dispatch('session/removeUserSession');

			this.username = '';
			this.password = '';
			this.validationState.username.dirty = false;
			this.validationState.password.dirty = false;
		},

		async setUserSession({ username: userName, lastLogin }) {
			await this.$store.dispatch('session/setUserSession', { userName, lastLogin });
		},

		async rememberUserSession({ username: userName, lastLogin, rememberToken }) {
			if (this.isUserRemember) {
				await this.$store.dispatch('session/rememberUserSession', {
					userName,
					lastLogin,
					rememberToken,
				});
			}
		},

		async createFingerprint() {
			const products = await this.$store.dispatch('products/fetch');
			/**
			 * The fingerprint is the union of all products id,
			 * with this string chain we'll know what action to take
			 */
			const fingerprint = products.reduce((reducer, { id }) => reducer + id, '');
			const hashedFingerprint = await cypherSha256(fingerprint);
			const FINGERPRINT_TOKEN = 'fingerprintToken';
			const prevSession = window.sessionStorage.getItem(FINGERPRINT_TOKEN);

			window.sessionStorage.setItem(FINGERPRINT_TOKEN, hashedFingerprint);

			if (this.$route.query.redirect && hashedFingerprint === prevSession) {
				return this.$router.replace(this.$route.query.redirect);
			}

			return this.$router.push({ name: 'home' });
		},

		submit() {
			const { username, password, rememberToken } = this;

			this.validationState.username.dirty = true;
			this.validationState.password.dirty = true;
			this.loading = true;

			if (this.hasInvalidFields) {
				return;
			}

			this.$store
				.dispatch('authn/login', {
					rememberToken,
					username,
					password,
				})
				.then((data) => {
					this.setUserSession(data);
					this.rememberUserSession(data);
					this.createFingerprint();
				})
				.catch((error) => {
					this.error = true;
					this.reset();

					if (!error.status) {
						this.openNoInternet();
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.w-login {
	display: grid;
	width: 100%;
	height: 100%;
	grid-template-rows: 40px min-content;
	row-gap: 20px;
}

.w-login__header {
	display: block;
	position: relative;
	will-change: transform;
	transform-origin: top;
	transition: transform 200ms ease-in;
}

.w-login__logotype {
	text-align: center;
}

.w-login__header.--hide {
	transform: scale(0);
}

.w-login__logotype-icon {
	height: 40px;
	max-width: 180px;
}

.w-login__suggestions-button {
	color: RGB(var(--color-secondary));
	display: flex;
	position: relative;
	justify-self: flex-end;
}

.w-login__content {
	display: grid;
	position: relative;
	grid-template-rows: auto;
	width: 100%;
	height: 100%;
	row-gap: 20px;
}

.w-login__form-group {
	color: RGB(var(--color-text-primary-light));
	display: block;
	position: relative;
	width: 100%;
}

.w-login__actions,
.w-login__submit,
.w-login__register {
	display: flex;
	position: relative;
	width: 100%;
	flex-direction: column;
}

.w-login__submit,
.w-login__register:not(:last-child),
.w-login__suggestions-link:not(:last-child) {
	margin-bottom: 10px;
}

.w-login__suggestions-link {
	color: RGB(var(--color-text-secondary));
	display: flex;
	line-height: 1.14;
	letter-spacing: 0;
	padding: 0 15px 0 15px;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	min-width: 64px;
	height: 48px;
	border: none;
	outline: none;
}

.w-login__form {
	display: grid;
	grid-template-rows: min-content;
	row-gap: 20px;
	transform: translateY(0px);
	transition: transform 200ms ease-in;
	will-change: transform;
}

.w-login__form.--collapse {
	transform: translateY(-100px);
}

.w-login__remember-password,
.w-login__remember-user {
	color: RGB(var(--color-text-secondary));
	display: flex;
	justify-content: flex-end;
	--color: var(--color-text-secondary);
}
</style>
