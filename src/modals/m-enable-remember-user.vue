<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.REMEMBER_ME.TITLE') }}
		</template>

		<article>
			<p>
				{{ $t('INFO.REMEMBER_ME.DESC') }}
			</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="cancel" @click="$emit('close')" raised>
				{{ $t('ACTIONS.CANCEL') }}
			</c-button>
			<c-button data-testid="confirm" @click="confirm" raised confirm>{{ $t('ENABLE') }}</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';

export default {
	name: 'm-enable-remember-user',
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
article {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}
</style>
