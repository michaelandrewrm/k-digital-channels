<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/noInternet" />
		</template>

		<template v-slot:header>
			{{ $t('NO_INTERNET.INFO.TITLE') }}
		</template>

		<article>
			<p>
				{{ $t('NO_INTERNET.INFO.DESC') }}
			</p>
			<c-contact-support-info />
			<p>{{ $t('NO_INTERNET.CONTACT_US') }}</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="accept" raised confirm @click="$emit('close')">
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
	name: 'm-no-internet',

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
</style>
