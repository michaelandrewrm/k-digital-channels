<template>
	<l-modal class="m-bizum-otp">
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalEnvelope" />
		</template>

		<template v-slot:header>
			{{ $t('OTP_TITLE') }}
		</template>

		<article class="m-bizum-otp__wrapper">
			<p>
				{{ $t('OTP_DESCRIPTION') }}
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
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';
import CTextField from '@components/c-text-field';
import CTextFieldHelperText from '@components/c-text-field-helper-text';
import MOTPError from '@modals/m-otp-error';
import { OTP_INVALID, OTP_EXPIRED, OTP_ERROR, BIZUM_OTP_ERROR } from '@modules/service/constants';
import MSomethingWrong from './m-something-wrong';

export default {
	name: 'm-bizum-otp',

	components: {
		LModal,
		CButton,
		CIcon,
		CTextField,
		CTextFieldHelperText,
	},

	props: {
		signupId: { type: String, default: '' },
	},

	data() {
		return {
			value: false,
			code: '',
			loading: false,
			validationCode: { dirty: false, invalid: false },
		};
	},

	watch: {
		code(value) {
			const OTP_LENGTH = 6;

			this.validationCode.dirty = true;
			this.validationCode.invalid = Number.isNaN(+value) || value.length !== OTP_LENGTH;
		},
	},

	methods: {
		sendOTP() {
			const { code, signupId, loading } = this;

			/* istanbul ignore else */
			if (signupId && !loading && code.length === 6) {
				this.loading = true;
				this.validationCode.invalid = false;
				this.$store
					.dispatch('bizum/sendOTP', { signupId, otpValue: code })
					.then(this.onSuccess)
					.catch(this.onFail);
			}
		},

		onSuccess(response) {
			this.value = response;
			this.$emit('close');
		},

		/* istanbul ignore next */
		async onFail(error) {
			const { response } = error;
			this.loading = false;
			if (response && response?.data) {
				const { errorCode, additionalInfo } = response.data;

				if (errorCode === OTP_INVALID) {
					if (additionalInfo) {
						this.validationCode.invalid = true;
					} else {
						await this.$store.dispatch('modal/open', MOTPError);
						this.$emit('close');
					}
				} else if (errorCode === OTP_EXPIRED) {
					await this.$store.dispatch('modal/open', MSomethingWrong);
				} else if (errorCode === OTP_ERROR || errorCode === BIZUM_OTP_ERROR) {
					await this.$store.dispatch('modal/open', MOTPError);
					this.$emit('close');
				} else {
					this.value = { response };
					this.$emit('close');
				}
			} else {
				await this.$store.dispatch('modal/open', MSomethingWrong);
			}
		},
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

@media ($on-tablet) {
	.m-bizum-otp__wrapper {
		max-width: 290px;
	}
}
</style>
