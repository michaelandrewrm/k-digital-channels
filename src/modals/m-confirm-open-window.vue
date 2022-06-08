<template>
	<l-modal class="m-confirm-open-window">
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.CONFIRM_OPEN_WINDOW.TITLE') }}
		</template>

		<article class="m-confirm-open-window__content">
			<p>{{ $t('INFO.CONFIRM_OPEN_WINDOW.DESC1') }}</p>
			<p>{{ $t('INFO.CONFIRM_OPEN_WINDOW.DESC2') }}</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="cancel" raised @click="cancelWindowOpen">
				{{ $t('ACTIONS.CANCEL') }}
			</c-button>
			<c-button data-testid="accept" raised @click="openWindow">
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
	name: 'm-confirm-open-window',

	components: { LModal, CButton, CIcon },

	data() {
		return {
			value: false,
		};
	},

	methods: {
		openWindow() {
			this.value = true;
			this.$emit('close');
		},

		cancelWindowOpen() {
			this.value = false;
			this.$router.back();
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.m-confirm-open-window__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-confirm-open-window__content *:not(:last-child) {
	margin-bottom: 20px;
}

@media ($on-tablet) {
	.m-confirm-open-window__content *:not(:last-child) {
		margin-bottom: 30px;
	}
}

.icon {
	color: RGB(var(--color-accent-error-light));
}
</style>
