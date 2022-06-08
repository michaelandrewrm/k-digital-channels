<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/valueAccountUnit" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.ACCOUNT.AVAILABLE_BALANCE.TITLE') }}
		</template>

		<article class="m-account-available-balance__content">
			<p class="m-account-available-balance__desc">
				{{ $t('INFO.ACCOUNT.AVAILABLE_BALANCE.DESC') }}
			</p>
		</article>

		<template v-slot:buttons>
			<c-button data-testid="accept" @click="$emit('close')" raised confirm>
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
	name: 'm-available-balance',

	components: { LModal, CButton, CIcon },
};
</script>

<style lang="scss" scoped>
.m-balance__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-balance__desc:not(:first-child) {
	padding-top: 20px;
}
</style>
