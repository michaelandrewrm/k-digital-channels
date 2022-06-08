<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/productServices" />
		</template>

		<template v-slot:header>
			{{ $t('PREMIUM.ACTIONS.REQUEST_SERVICES.INFO') }}
		</template>

		<article>
			<p class="m-request-services__desc">
				{{ $t('PREMIUM.ACTIONS.REQUEST_SERVICES.DESC') }}
			</p>
			<c-contact-support-info />
			<p>{{ $t('OPERATIVE.AVAILABLE.SOON') }}</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="accept" @click="$emit('close')" raised confirm>
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
	name: 'm-request-services',

	components: {
		LModal,
		CButton,
		CIcon,
		CContactSupportInfo,
	},
};
</script>

<style lang="scss" scoped>
$border-color: RGB(var(--color-primary));

article {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}
</style>
