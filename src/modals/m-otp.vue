<template>
	<l-modal class="m-otp">
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalEnvelope" />
		</template>

		<template v-slot:header>
			{{ $t('OTP_TITLE') }}
		</template>

		<article class="m-otp__wrapper">
			<p>
				{{ $t('OTP_DESCRIPTION') }}
				<span data-testid="attempts-message" v-show="attempts > 0">
					{{ $tc('OTP_ATTEMPTS', remainingAttempts, { x: remainingAttempts }) }}
				</span>
			</p>

			<div>
				<c-text-field
					data-testid="otp-code-input"
					v-model.trim="code"
					type="text"
					inputmode="numeric"
					maxlength="10"
					autocomplete="one-time-code"
					:valid="!validationCode.dirty || !validationCode.invalid"
					outlined
					aria-controls="code-validation"
					aria-describedby="code-validation"
				></c-text-field>
				<c-text-field-helper-text
					v-if="validationCode.dirty && validationCode.invalid"
					id="code-validation"
					data-testid="otp-code-validation"
					validationMsg
				>
					{{ $t('OTP_ERROR_MESSAGE') }}
				</c-text-field-helper-text>
			</div>
		</article>

		<template v-slot:buttons>
			<c-button
				raised
				@click="sendOTP"
				:disabled="loading || !validationCode.dirty || validationCode.invalid"
				data-testid="send-otp-button"
			>
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</template>

		<transition name="cascade" mode="out-in" slot="actions">
			<a
				key="resendCodeButton"
				v-if="enableResendCode && resendAttempts < totalValidResendAttempts"
				href="#"
				class="text-s-bold"
				@click.prevent="askForANewCode"
				data-testid="ask-for-a-new-otp-code"
			>
				{{ $t('OTP_RESEND_CODE') }}
			</a>
			<c-icon
				key="okIcon"
				v-if="!enableResendCode && askingForANewCode"
				src="@icons/check"
				data-testid="asking-otp-code-icon"
			/>
			<a
				key="showHelp"
				v-if="resendAttempts >= totalValidResendAttempts && !askingForANewCode"
				href="#"
				class="text-s-bold"
				@click.prevent="showHelp"
				data-testid="ask-for-otp-help"
			>
				{{ $t('OTP_SHOW_HELP') }}
			</a>
		</transition>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';
import CTextField from '@components/c-text-field';
import CTextFieldHelperText from '@components/c-text-field-helper-text';
import MOtpError from '@modals/m-otp-error';
import MOtpExpired from '@modals/m-otp-expired';
import MOtpInvalid from '@modals/m-otp-invalid';
import MSignBlocked from '@modals/m-sign-blocked';
import MSomethingWrong from '@modals/m-something-wrong.vue';
import { OTP_INVALID, OTP_EXPIRED, OTP_RENEWED, OTP_ERROR } from '@modules/service/constants';

export default {
	name: 'm-otp',

	components: {
		LModal,
		CButton,
		CIcon,
		CTextField,
		CTextFieldHelperText,
	},

	data() {
		return {
			value: false,
			code: '',
			loading: false,
			attempts: 0,
			totalValidAttempts: 3,
			resendAttempts: 0,
			totalValidResendAttempts: 2,
			enableResendCode: false,
			timeoutToEnableResendCode: 10000,
			helpHandler: 0,
			askingForANewCode: false,
			validationCode: { dirty: false, invalid: false },
		};
	},

	props: { processId: String, sca: Boolean },

	computed: {
		remainingAttempts({ attempts, totalValidAttempts }) {
			return totalValidAttempts - attempts;
		},
	},

	watch: {
		code(value) {
			const OTP_LENGTH = 6;

			this.validationCode.dirty = true;
			this.validationCode.invalid = Number.isNaN(+value) || value.length !== OTP_LENGTH;
		},

		enableResendCode: {
			immediate: true,
			handler(value) {
				if (!value) {
					clearTimeout(this.helpHandler);
					this.helpHandler = setTimeout(() => {
						this.enableResendCode = true;
					}, this.timeoutToEnableResendCode);
				}
			},
		},
	},

	methods: {
		sendOTP() {
			const { code, processId, loading } = this;

			if (processId && !loading && code.length === 6) {
				this.loading = true;
				this.validationCode.invalid = false;
				this.$store
					.dispatch('otp/send', { processId, otpValue: code })
					.then(this.onSuccess)
					.catch(this.onFail);
			}
		},

		showHelp() {
			this.$store.dispatch('modal/open', MOtpInvalid);
		},

		askForANewCode() {
			const { processId } = this;

			this.resendAttempts += 1;
			this.enableResendCode = false;
			this.code = '';
			this.askingForANewCode = true;
			this.$store.dispatch('otp/requestCode', processId).catch(() => {});

			setTimeout(() => {
				this.askingForANewCode = false;
			}, 2000);
		},

		onSuccess(response) {
			this.value = response;
			this.$emit('close');
		},

		async onFail(error) {
			this.loading = false;

			if (error?.response?.data) {
				const { response } = error;
				const { errorCode, additionalInfo } = response.data;

				switch (errorCode) {
					case OTP_INVALID:
						/* istanbul ignore else */
						if (!additionalInfo) {
							await this.$store.dispatch('modal/open', MOtpError);
							return this.$emit('close');
						}

						this.attempts += 1;
						this.validationCode.invalid = true;
						this.enableResendCode = true;
						break;
					case OTP_EXPIRED:
						{
							const alertMessage = await this.$store.dispatch('modal/open', MOtpExpired);

							/* istanbul ignore else */
							if (alertMessage === 'resend') {
								this.askForANewCode();
							}
						}
						break;
					case OTP_RENEWED:
						this.attempts += 1;
						break;
					case OTP_ERROR:
						if (this.sca) {
							const isChangeUser = await this.$store.dispatch('modal/open', MSignBlocked);
							this.value = { response: { data: { errorCode: isChangeUser } } };
						} else {
							await this.$store.dispatch('modal/open', MOtpError);
						}

						this.$emit('close');
						break;
					default:
						if (!response?.data) {
							await this.$store.dispatch('modal/open', MSomethingWrong);
						}
						this.value = { response };
						this.$emit('close');
						break;
				}
			} else {
				await this.$store.dispatch('modal/open', MSomethingWrong);
				this.$emit('close');
			}
		},
	},

	/* istanbul ignore next */
	beforeDestroy() {
		clearTimeout(this.helpHandler);
	},
};
</script>

<style lang="scss" scoped>
article {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

article > *:not(:last-child) {
	margin-bottom: 20px;
}

@media ($on-tablet) {
	article > *:not(:last-child) {
		margin-bottom: 30px;
	}
}

.cascade-enter-active,
.cascade-leave-active {
	transition: transform 200ms ease, opacity 200ms ease;
}

.cascade-enter,
.cascade-leave-to {
	transform: translateY(-100%);
	opacity: 0;
}

@media ($on-tablet) {
	.m-otp__wrapper {
		max-width: 320px;
	}
}
</style>
