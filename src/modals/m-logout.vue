<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/exit" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.LOGOUT.TITLE') }}
		</template>

		<article>
			<p>{{ $t('INFO.LOGOUT.DESC') }}</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="cancel" raised @click="$emit('close')">
				{{ $t('ACTIONS.CANCEL') }}
			</c-button>
			<c-button data-testid="logout" raised confirm @click="closeSession">
				{{ $t('ACTIONS.LOGOUT') }}
			</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';

export default {
	name: 'm-logout',

	components: { LModal, CButton, CIcon },

	data() {
		return {
			value: null,
		};
	},

	methods: {
		closeSession() {
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

article *:not(:last-child) {
	margin-bottom: 20px;
}

@media ($on-tablet) {
	article *:not(:last-child) {
		margin-bottom: 30px;
	}
}
</style>
