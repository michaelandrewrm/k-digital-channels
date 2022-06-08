<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('DELETE_IMAGE') }}
		</template>

		<article class="m-confirm-image-deletion__content">
			<p>{{ $t('DELETE_IMAGE_CONFIRMATION') }}</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="cancel" raised @click="$emit('close')">
				{{ $t('ACTIONS.CANCEL') }}
			</c-button>
			<c-button data-testid="accept" raised confirm @click="confirm">
				{{ $t('ACTIONS.DELETE') }}
			</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';

export default {
	name: 'm-confirm-image-deletion',

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
.m-confirm-image-deletion__content {
	min-height: 40px;
}
</style>
