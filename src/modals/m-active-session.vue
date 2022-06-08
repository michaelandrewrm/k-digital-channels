<template>
	<l-modal modal>
		<template v-slot:icon>
			<c-icon class="m-active-session__icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.ACTIVE_SESSION.TITLE') }}
		</template>

		<article class="m-active-session__article">
			<p>
				{{ $t('INFO.ACTIVE_SESSION.DESC', { user: activeUser }) }}
			</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="accept" @click="$emit('close')" raised>
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
	name: 'm-active-session',

	props: {
		activeUser: { type: String },
	},

	components: { LModal, CButton, CIcon },
};
</script>

<style lang="scss" scoped>
.m-active-session__article {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-active-session__icon {
	color: RGB(var(--color-accent-error));
}
</style>
