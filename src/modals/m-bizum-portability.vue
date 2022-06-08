<template>
	<l-modal class="m-bizum-portability">
		<template v-slot:icon>
			<c-icon src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('BIZUM.PORTABILITY.TITLE') }}
		</template>

		<article class="m-bizum-portability__content">
			<p>{{ $t('BIZUM.PORTABILITY.DESC1') }}</p>
			<p>{{ $t('BIZUM.PORTABILITY.DESC2') }}</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="accept" raised @click="confirm">{{ $t('ACTIONS.ACCEPT') }}</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';

export default {
	name: 'm-bizum-portability',

	components: { LModal, CButton, CIcon },

	data() {
		return {
			value: false,
		};
	},

	methods: {
		confirm() {
			this.value = true;
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.m-bizum-portability__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-bizum-portability__content *:not(:last-child) {
	margin-bottom: 20px;
}

@media ($on-tablet) {
	.m-bizum-portability__content *:not(:last-child) {
		margin-bottom: 30px;
	}
}
</style>
