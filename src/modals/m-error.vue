<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="m-error__icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.ERROR.TITLE') }}
		</template>

		<article class="m-error">
			<p>{{ $t('INFO.ERROR.DESC') }}</p>
			<c-contact-support-info />
		</article>

		<template v-slot:buttons>
			<c-button raised confirm @click="$emit('close')" data-testid="accept">
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
	name: 'm-error',

	components: {
		LModal,
		CButton,
		CIcon,
		CContactSupportInfo,
	},
};
</script>

<style lang="scss" scoped>
.m-error {
	color: RGB(var(--color-text-primary));
	display: flex;
	min-height: 120px;
	margin: 0 auto;
	flex-direction: column;
	padding: 0 10px;
}

.m-error__icon {
	color: RGB(var(--color-accent-error-light));
}
</style>
