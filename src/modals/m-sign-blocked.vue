<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('SIGN_BLOCKED_TITLE') }}
		</template>

		<article>
			<p>{{ $t('SIGN_BLOCKED_DESCRIPTION', { minutes }) }}</p>
		</article>

		<template v-slot:buttons>
			<c-button
				id="m-sign-blocked__unlock-user"
				data-testid="unlock-user"
				raised
				@click="unlockUser"
			>
				{{ $t('UNLOCK_USER') }}
			</c-button>
			<c-button
				id="m-sign-blocked__cancel"
				data-testid="change-user"
				raised
				confirm
				@click="changeUser"
			>
				{{ $t('CHANGE_USER') }}
			</c-button>
		</template>
	</l-modal>
</template>

<script>
import LModal from '@layouts/l-modal';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';
import MUnlockUser from '@modals/m-unlock-user';

export default {
	name: 'm-sign-blocked',

	components: { LModal, CButton, CIcon },

	data() {
		return {
			value: null,
		};
	},

	props: {
		minutes: {
			default: 5,
		},
	},

	methods: {
		unlockUser() {
			this.$store.dispatch('modal/replace', MUnlockUser);
		},
		changeUser() {
			this.value = 'CHANGE_USER';
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

.icon {
	color: RGB(var(--color-accent-error-light));
}

#m-sign-blocked__unlock-user,
#m-sign-blocked__cancel {
	min-width: 190px;
}
</style>
