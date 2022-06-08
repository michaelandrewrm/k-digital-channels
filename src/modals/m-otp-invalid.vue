<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('OTP_INVALID_TITLE') }}
		</template>

		<article>
			<p>{{ $t('OTP_INVALID_DESC') }}</p>

			<c-contact-support-info />
		</article>

		<template v-slot:buttons>
			<c-button data-testid="accept" raised @click="$emit('close')">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';
import CContactSupportInfo from '@components/c-contact-support-info';

export default {
	name: 'm-otp-invalid',

	components: {
		LModal,
		CButton,
		CIcon,
		CContactSupportInfo,
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
