<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/subscription" />
		</template>

		<template v-slot:header>
			{{ $t('FUND.INFO.TITLE') }}
		</template>

		<article>
			<p>{{ $t('FUND.INFO.DESC') }}</p>
			<c-contact-support-info />
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
	name: 'm-fund-operative',

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
