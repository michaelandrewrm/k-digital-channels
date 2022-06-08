<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/payIn" />
		</template>

		<template v-slot:header>
			{{ $t('DEPOSIT.INFO.TITLE') }}
		</template>

		<article>
			<p class="m-deposit-info__desc">
				{{ $t('DEPOSIT.INFO.DESC') }}
			</p>
			<c-contact-support-info />
		</article>

		<template v-slot:buttons>
			<c-button @click="$emit('close')" raised confirm data-testid="accept">
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
	name: 'm-deposit-info',

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
