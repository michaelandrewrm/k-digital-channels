<template>
	<l-modal class="m-confirm-push-notification">
		<template v-slot:icon>
			<c-icon src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.CONFIRM_PUSH.TITLE') }}
		</template>

		<article class="m-confirm-push-notification__content">
			<p>{{ $t('INFO.CONFIRM_PUSH.DESC') }}</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="cancel" raised @click="cancel">{{ $t('ACTIONS.CANCEL') }}</c-button>
			<c-button data-testid="accept" raised @click="accept">{{ $t('ACTIONS.ACCEPT') }}</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';

export default {
	name: 'm-confirm-push-notification',

	components: { LModal, CButton, CIcon },

	data() {
		return {
			value: false,
		};
	},

	methods: {
		accept() {
			this.value = true;
			this.$emit('close');
		},

		cancel() {
			this.value = false;
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.m-confirm-push-notification__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}
</style>
