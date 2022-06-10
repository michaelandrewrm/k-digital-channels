<template>
	<div class="w-login">
		<div class="w-login-layout">
			<h1 v-a11y-hide ref="introTitle">{{ $t('INTRO_LOGIN_TITLE') }}</h1>
			<!-- Identity logotype starts -->
			<div class="w-login-header" :class="{ 'w-login-header--collapse': collapseHeader }">
				<!-- <img src="@local-assets/img/logo-alt.svg" alt aria-hidden="true" /> -->
				<c-icon src="@icons/hands" class="w-login-header__icon-logo" />
			</div>
			<!-- Identity logotype ends -->

			<!-- Form starts -->
			<form @submit.prevent="submit" :class="{ 'form--collapse': collapseHeader }">
				<div class="w-login-grid">
					<div class="w-login-grid">
						<div class="wl-form-group">
							<!-- cancel browser autofill with this input hidden -->
							<input type="password" name="password" hidden />

							<div v-if="rememberToken" class="wl-remember-group" data-testid="welcome-back-user">
								<h1 class="text-xl-bold">{{ $t('LOGIN.HELLO', { name: rememberedUsername }) }}</h1>

								<a
									href="#"
									class="wl-stop-remember-link text-fixed-m-medium"
									@click.prevent="reset"
									data-testid="remove-remembered-user-button"
								>
									{{ $t('LOGIN.NOT_ME', { name: rememberedUsername }) }}
								</a>
							</div>

							<!-- Username text field starts -->
							<div v-if="!rememberToken" class="wl-text-field-username">
								<c-text-field
									type="text"
									v-model="username"
									:placeholder="$t('USERNAME')"
									ref="usernameInput"
									data-testid="username"
									autocomplete="dni"
									:useNativeValidation="false"
									:valid="
										!(
											(validation.username.dirty && validation.username.invalid) ||
											(validation.access.dirty && validation.access.invalid)
										)
									"
									@focus="onInputFocusIn"
									@blur="onInputFocusOut"
									aria-labelledby="label-username-input"
									aria-controls="username-validation"
									aria-describedby="username-validation"
								/>
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
							<div class="wl-text-field-password">
								<c-text-field
									:type="showPasswordValue ? 'text' : 'password'"
									:placeholder="$t('PASSWORD')"
									v-model="password"
									ref="passwordInput"
									data-testid="password"
									autocomplete="current-password"
									:useNativeValidation="false"
									:valid="
										!(
											(validation.password.dirty && validation.password.invalid) ||
											(validation.access.dirty && validation.access.invalid)
										)
									"
									@focus="onInputFocusIn"
									@blur="onInputFocusOut"
									aria-controls="password-validation"
									aria-describedby="password-validation"
									maxlength="10"
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
										<c-icon
											v-else
											:aria-label="$t('FORM.FIELD.SHOW_PASSWORD')"
											src="@icons/eyeSlash"
										/>
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
							<!-- Password recovery link starts -->
							<div class="wl-recovery-password text-fixed-m-medium">
								<a
									href="#"
									@keypress.enter.space="openPasswordRecovery"
									@click.prevent="openPasswordRecovery"
									aria-haspopup="dialog"
									data-testid="recover-password-button"
								>
									{{ $t('INFO.REMEMBER_PASSWORD.TITLE') }}
								</a>
							</div>
							<!-- Password recovery link ends -->
							<!-- Remember user info checkbox starts-->
							<div v-if="!rememberToken" class="wl-checkbox">
								<c-checkbox
									id="rememberme-checkbox"
									class="text-fixed-m-medium wl-checkbox-button"
									data-testid="remember-user"
									v-model="rememberingUser"
									:label="$t('REMEMBER_ME')"
									@click.native.capture="rememberUser"
									@keydown.native.capture.space="rememberUser"
								/>
							</div>
							<!-- Remember user info checkbox ends -->
						</div>
					</div>
					<!-- Login action buttons starts -->
					<div class="wl-action-buttons" :class="{ 'wl-action-buttons--collapse': collapseHeader }">
						<p class="wl-login-button">
							<c-button
								data-testid="logInButton"
								unelevated
								type="submit"
								name="btnContinuar"
								raised
							>
								{{ $t('ACTIONS.ENTER') }}
							</c-button>
						</p>
						<!-- CD-8028: Ocultaremos temporalmente este botón para bancofar -->
						<!-- CD-XXXX: Ocultaremos temporalmente este botón para caminos -->
						<p v-if="false" class="wl-register-button">
							<c-button outlined :href="onboardingUrl">
								{{ $t('LOGIN.BECOME_A_CUSTOMER') }}
							</c-button>
						</p>
					</div>
					<!-- Login action buttons ends -->
				</div>
			</form>
			<!-- Security Recommendations starts -->
			<a
				v-if="!isMobile"
				class="wl-security-advices-link text-fixed-m-medium"
				href="#"
				@keypress.enter.space="openSecuritySuggestions"
				@click.prevent="openSecuritySuggestions"
				aria-haspopup="dialog"
				data-testid="security-suggestions-button"
			>
				{{ $t('SECURITY_SUGGESTIONS.TITLE') }}
			</a>
			<button
				v-if="isMobile"
				class="wl-security-advices-button"
				:class="{ 'wl-security-advices-button--collapse': collapseHeader }"
				@click="openSecuritySuggestions"
				tabindex="0"
				:aria-label="$t('SECURITY_SUGGESTIONS.TITLE')"
			>
				<c-icon src="@icons/shield" />
			</button>
			<!-- Security Recomendations ends -->
		</div>
		<p
			v-if="isMobile && !rememberedUsername && !isPrd"
			class="button-register text-fixed-m-medium"
			:class="{ 'button-register--hide': collapseHeader }"
		>
			<a :href="onboardingUrl">{{ $t('LOGIN.BECOME_A_CUSTOMER') }}</a>
		</p>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import CIcon from '@components/c-icon';
import CButton from '@components/c-button';
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
import mq from '@utils/matchMedia';
import { onPWA, onMobile } from '@theme';
import { cypherSha256 } from '@modules/secure/cypher';

const isPrd = window?.VUE_APP_CONFIG?.env === 'prd';
const KEYBOARD_DELAY = 150;

export default {
	name: 'w-login',

	components: {
		CTextField,
		CTextFieldIcon,
		CTextFieldHelperText,
		CCheckbox,
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
			isLoading: false,
			inputUsername: '',
			password: '',
			isFocused: false,
			focusHandler: null,
			showPasswordValue: false,
			rememberingUser: false,
			rememberTermsAccepted: false,
			ignoreFocusEvent: false,
			isPrd,

			validation: {
				username: { dirty: false, invalid: true },
				password: { dirty: false, invalid: true },
				access: { dirty: false, invalid: true },
			},
		};
	},

	props: { visible: Boolean, isPasswordRecoveryOpened: Boolean },

	computed: {
		isMobile: mq(onMobile),
		isPWA: mq(onPWA),
		isSmallHeight: mq('(max-height: 800px)'),

		collapseHeader({ isMobile, isSmallHeight, isFocused }) {
			return isMobile && isSmallHeight && isFocused;
		},

		...mapState('app', ['onboardingUrl']),
		...mapState('session', {
			rememberToken: 'rememberToken',
			rememberedUsername: 'userName',
		}),

		username: {
			get() {
				return this.inputUsername;
			},
			set(value) {
				this.inputUsername = value.toUpperCase();
			},
		},
	},

	watch: {
		/* istanbul ignore next */
		visible(visible) {
			if (visible && this.isPWA && window.PasswordCredential) {
				setTimeout(async () => {
					const crd = await navigator.credentials.get({
						password: true,
						unmediated: false,
					});

					if (crd) {
						const { id: username, password } = crd;
						this.username = username;
						this.password = password;
						this.submit();
					}
				}, 1000);
			}
		},

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

	methods: {
		openSecuritySuggestions() {
			return this.$store.dispatch('modal/open', MSecuritySuggestions);
		},

		openPasswordRecovery() {
			if (!this.isPasswordRecoveryOpened) {
				this.$emit('open-password-recovery');
			}
		},

		submit() {
			const { username, password, rememberToken, isLoading } = this;

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

			if (isLoading) {
				return;
			}

			this.isLoading = true;

			this.$store
				.dispatch('authn/login', {
					rememberToken,
					username,
					password,
				})
				.then(this.onLoginSuccess)
				.catch(this.onLoginFailure);

			this.isLoading = false;
		},

		async reset() {
			await this.resetUser();
			await this.resetPassword();

			this.validation.access.dirty = false;
			this.validation.access.invalid = true;
		},

		async resetUser() {
			await this.$store.dispatch('session/removeUserSession');
			this.username = '';
			await this.$nextTick();
			this.validation.username.dirty = false;
			await this.resetPassword();
		},

		async resetPassword() {
			this.password = '';
			await this.$nextTick();
			this.validation.password.dirty = false;
		},

		async onLoginSuccess({ username: userName, lastLogin, rememberToken }) {
			await this.$store.dispatch('session/setUserSession', {
				userName,
				lastLogin,
			});

			if (this.rememberingUser) {
				await this.$store.dispatch('session/rememberUserSession', {
					userName,
					lastLogin,
					rememberToken,
				});
			}

			// Precarga de productos para posición global.
			await this.$store
				.dispatch('products/fetch')
				.then(async (products) => {
					// El fingerprint es la unión de todos los id de productos, con ello
					// sabremos si al recargar la página un usuario tiene permisos para
					// ver la misma página que estaba viendo o si lo redirigimos a la
					// posición global.
					const fingerprint = products.reduce((reducer, { id }) => reducer + id, '');
					const hashedFingerprint = await cypherSha256(fingerprint);
					const FINGERPRINT_TOKEN = 'fingerprintToken';
					const prevSession = window.sessionStorage.getItem(FINGERPRINT_TOKEN);

					window.sessionStorage.setItem(FINGERPRINT_TOKEN, hashedFingerprint);

					if (this.$route.query.redirect && hashedFingerprint === prevSession) {
						return this.$router.replace(this.$route.query.redirect);
					}

					return this.$router.push({ name: 'home' });
				})
				.catch(() => this.$router.push({ name: 'home' }));
		},

		async onLoginFailure({ status, BAD_USER, BAD_PASSWORD, BAD_CREDENTIALS }) {
			if (!status) {
				await this.$store.dispatch('modal/open', MNoInternet);
				await this.resetPassword();
			}

			const isBadUser = Boolean(status & BAD_USER);
			const isBadPassword = Boolean(status & BAD_PASSWORD);
			const isBadCredentials = Boolean(status & BAD_CREDENTIALS);

			if (isBadUser) {
				await this.resetUser();
				this.$refs.usernameInput.focus();
			}

			if (isBadPassword) {
				await this.resetPassword();
				this.$refs.passwordInput.focus();
			}

			this.validation.access.invalid = isBadCredentials;
			this.validation.access.dirty = true;
		},

		onInputFocusIn(e) {
			/* istanbul ignore next */
			if (this.ignoreFocusEvent) {
				return;
			}
			clearTimeout(this.focusHandler);
			this.focusHandler = setTimeout(() => {
				this.isFocused = true;

				// * Apply this hack only on Safari browsers
				const { userAgent } = window.navigator;
				if (userAgent.includes('Safari') && !userAgent.includes('Chrome') && this.isSmallHeight) {
					const $animationDuration = 150;

					setTimeout(() => {
						this.ignoreFocusEvent = true;
						e.target.blur();
						clearTimeout(this.focusHandler);
						e.target.focus();
						this.ignoreFocusEvent = false;
					}, $animationDuration + 20);
				}
			}, KEYBOARD_DELAY);
		},

		onInputFocusOut() {
			clearTimeout(this.focusHandler);
			this.focusHandler = setTimeout(() => {
				this.isFocused = false;
			}, KEYBOARD_DELAY);
		},

		/* istanbul ignore next */
		focus() {
			this.$refs.introTitle.focus();
		},

		async rememberUser(e) {
			/* istanbul ignore else */
			if (!this.rememberTermsAccepted) {
				e.stopPropagation();
				e.preventDefault();

				const accepted = await this.$store.dispatch('modal/open', MEnableRememberUser);
				this.rememberTermsAccepted = accepted;
				this.rememberingUser = accepted;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
/* Login components variables: */
$animation-duration: 150ms;

.w-login {
	display: grid;
	grid-template-rows: 1fr;
	align-items: flex-start;
	height: 100%;
}

.w-login-layout {
	padding: 20px 24px;
	display: flex;
	flex-direction: column;
	font-size: 0.875rem;
	font-weight: 500;
	flex-grow: 1;
}

.w-login-header {
	height: auto;
	text-align: center;
	margin-top: 1.25rem;
	margin-bottom: 2rem;

	img {
		height: 86px;
		will-change: transform;
		transform-origin: top;
		transition: transform $animation-duration ease-in;
	}

	&--collapse {
		img {
			transform: scale(0);
		}
	}
}

form {
	will-change: transform;
	transform: translateY(0px);
	transition: transform $animation-duration ease-in;
	flex-grow: 1;
}

.w-login-header__icon-logo {
	width: 150px;
	color: white;
}

.wl-checkbox {
	display: grid;
	grid-area: rememberMe;
	grid-template-columns: auto 1fr;
	justify-self: end;
	color: RGB(var(--color-accent-secondary));
}

.form--collapse {
	transform: translateY(-130px);
	transition: transform $animation-duration ease-in;
}

.wl-action-buttons {
	padding-top: 30px;
	will-change: transform;
	transform-origin: top;
	transition: transform $animation-duration ease-in;

	* {
		display: grid;
	}
}

.w-login-grid {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.form--collapse .w-login-grid {
	height: auto;
}

.wl-form-group {
	display: grid;
	grid-template-areas:
		'username'
		'password'
		'passwordLost'
		'rememberMe';
	grid-gap: 20px;
}

.wl-text-field-username {
	grid-area: username;
}

.wl-text-field-password {
	grid-area: password;
}

.wl-recovery-password {
	display: grid;
	grid-area: passwordLost;
	justify-self: end;

	a {
		color: RGB(var(--color-accent-secondary));
		padding: 5px 0;
	}
}

.wl-login-button {
	grid-row: 2;
}

.wl-register-button {
	margin-top: 30px;
	grid-row: 3;
}

.wl-security-advices {
	&-link {
		grid-row: 3;
		margin-top: 52px;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		justify-self: center;
		color: RGB(var(--color-text-primary));
		text-align: center;
	}
	&-button {
		appearance: none;
		background: none;
		border: 0;
		font-size: 18px;
		position: relative;
		border-radius: 4px;
		position: absolute;
		top: 0;
		right: 0;
		padding: 10px 10px;
		margin: 10px 14px;
		height: 40px;
		color: rgba(255, 255, 255, 0.4);
		transition: opacity $animation-duration ease-in;

		&--collapse {
			opacity: 0;
			transition: opacity $animation-duration ease-in;
		}

		svg {
			height: 22px;
		}
	}
}

.wl-remember-group {
	height: 80px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 26px;

	h1 {
		color: white;
		text-align: center;
		line-height: 1.14;
		margin-bottom: 10px;
	}
}

.wl-checkbox-button {
	padding: 5px 0;
	margin: 3px 0;
	--c-checkbox-color: var(--color-accent-secondary);
	flex-direction: row-reverse;
}

.wl-stop-remember-link {
	color: RGB(var(--color-accent-secondary));
}

.button-register {
	display: flex;
	position: relative;
	width: 100%;
	height: 57px;
	justify-content: center;
	align-items: center;
	background: linear-gradient(
			to bottom,
			lighten($color-TEMP_BUTTON_REGISTRY, 7%) 0.5px,
			rgba(0, 0, 0, 0.2) 1px,
			transparent 9px
		),
		$color-TEMP_BUTTON_REGISTRY;

	a {
		color: RGB(var(--color-accent-secondary));
		padding: 10px;
	}

	&--hide {
		opacity: 0;
	}
}

.wl-security-advices-link {
	color: RGB(var(--color-accent-secondary));
}

@media ($on-tablet) {
	.w-login {
		align-items: center;
	}

	.w-login-layout {
		justify-content: center;
		max-height: 788px;
		padding: 0;
	}

	.w-login-header {
		height: 236px;
		flex-shrink: 0;
		margin-top: 0;
		margin-bottom: 0;
		img {
			height: 132px;
		}
	}

	.wl-checkbox {
		margin-bottom: 14px;
	}

	.wl-action-buttons {
		padding-top: 20px;
		padding-bottom: 0rem;
	}

	.wl-remember-group {
		height: 166px;

		h1 {
			margin-bottom: 26px;
		}
	}
}
</style>
