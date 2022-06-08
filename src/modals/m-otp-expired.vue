<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('OTP_EXPIRED_TITLE') }}
		</template>

		<article>
			<p>{{ $t('OTP_EXPIRED_DESC') }}</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="resend" raised @click="sendOTP">
				{{ $t('OTP_EXPIRED_RESEND') }}
			</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';

export default {
	name: 'm-otp-expired',

	components: {
		LModal,
		CButton,
		CIcon,
	},

	data() {
		return {
			value: '',
		};
	},

	methods: {
		sendOTP() {
			this.value = 'resend';
			this.$emit('close');
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

article *:not(:last-child) {
	margin-bottom: 20px;
}

@media ($on-tablet) {
	article *:not(:last-child) {
		margin-bottom: 30px;
	}
}
</style>
