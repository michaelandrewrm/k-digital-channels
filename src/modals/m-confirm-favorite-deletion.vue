<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.TRANSFER.FAVORITE.TITLE') }}
		</template>

		<article class="m-confirm-favorite-deletion__content">
			<p>{{ $t('INFO.TRANSFER.REMOVE_FAVORITE.DESC') }}</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="cancel" raised @click="$emit('close')">
				{{ $t('ACTIONS.CANCEL') }}
			</c-button>
			<c-button data-testid="accept" raised confirm @click="confirm">
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
	name: 'm-confirm-favorite-deletion',

	components: { LModal, CButton, CIcon },

	data() {
		return {
			value: null,
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
.m-confirm-favorite-deletion__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-confirm-favorite-deletion__content *:not(:last-child) {
	margin-bottom: 20px;
}

@media ($on-tablet) {
	.m-confirm-favorite-deletion__content *:not(:last-child) {
		margin-bottom: 30px;
	}
}
</style>
