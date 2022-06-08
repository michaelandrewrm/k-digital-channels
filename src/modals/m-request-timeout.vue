<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('REQUEST_TIMEOUT_TITLE') }}
		</template>

		<article>
			<p>{{ $t('REQUEST_TIMEOUT_DESC') }}</p>
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

export default {
	name: 'm-request-timeout',

	components: { LModal, CButton, CIcon },
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

.icon {
	color: RGB(var(--color-accent-error-light));
}
</style>
