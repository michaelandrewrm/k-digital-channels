<template>
	<l-modal class="m-something-wrong" :modal="modal">
		<template v-slot:icon>
			<c-icon src="@icons/modalExclamation" class="m-something-wrong__icon" />
		</template>

		<template v-slot:header>
			{{ $t('REQUEST_FAILURE.TITLE') }}
		</template>

		<article class="m-something-wrong__content">
			<p>{{ $t('REQUEST_FAILURE.DESC') }}</p>
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
	name: 'm-something-wrong',

	components: { LModal, CButton, CIcon },

	props: { modal: Boolean },
};
</script>

<style lang="scss" scoped>
.m-something-wrong__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-something-wrong__content *:not(:last-child) {
	margin-bottom: 20px;
}

@media ($on-tablet) {
	.m-something-wrong__content *:not(:last-child) {
		margin-bottom: 30px;
	}
}

.m-something-wrong__icon {
	color: RGB(var(--color-accent-error-light));
}
</style>
