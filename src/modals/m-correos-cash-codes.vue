<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.CORREOS_CASH.TITLE') }}
		</template>

		<article class="m-correos-cash-codes__content">
			<p class="m-correos-cash-codes__desc">
				{{ $t('INFO.CORREOS_CASH.DESC') }}
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
	name: 'm-correos-cash-codes',

	components: { LModal, CButton, CIcon },
};
</script>

<style lang="scss" scoped>
.m-correos-cash-codes__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-correos-cash-codes__desc:not(:first-child) {
	padding-top: 20px;
}
</style>
