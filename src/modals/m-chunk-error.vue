<template>
	<l-modal class="m-chunk-error" modal>
		<template v-slot:icon>
			<c-icon class="color-accent-secondary" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('CHUNK_ERROR.TITLE') }}
		</template>

		<article class="m-chunk-error__content">
			<p>{{ $t('CHUNK_ERROR.DESC') }}</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="accept" raised @click="reload">{{ $t('ACTIONS.ACCEPT') }}</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';

export default {
	name: 'm-chunk-error',

	components: { LModal, CButton, CIcon },

	methods: {
		reload() {
			window.location.reload();
		},
	},
};
</script>

<style lang="scss" scoped>
.m-chunk-error__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-chunk-error__content *:not(:last-child) {
	margin-bottom: 20px;
}

@media ($on-tablet) {
	.m-chunk-error__content *:not(:last-child) {
		margin-bottom: 30px;
	}
}
</style>
