<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ title }}
		</template>

		<article class="m-confirm__content">
			<p>{{ text }}</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="cancel" raised @click="cancel">
				{{ cancelText || $t('ACTIONS.CANCEL') }}
			</c-button>
			<c-button data-testid="accept" raised confirm @click="confirm">
				{{ acceptText || $t('ACTIONS.ACCEPT') }}
			</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';

export default {
	name: 'm-confirm',

	components: { LModal, CButton, CIcon },

	data() {
		return {
			value: null,
		};
	},

	props: {
		title: { type: String },
		text: { type: String },
		acceptText: { type: String },
		cancelText: { type: String },
	},

	methods: {
		cancel() {
			this.value = false;
			this.$emit('close');
		},

		confirm() {
			this.value = true;
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.m-confirm__content {
	min-height: 40px;
}
</style>
