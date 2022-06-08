<template>
	<l-modal modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.EXPIRED_SESSION.TITLE') }}
		</template>

		<article>
			<p>
				{{ $t('INFO.EXPIRED_SESSION.DESC') }}
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
	name: 'm-expired-session',

	components: { LModal, CButton, CIcon },
};
</script>

<style lang="scss" scoped>
article {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.icon {
	color: RGB(var(--color-accent-error));
}
</style>
