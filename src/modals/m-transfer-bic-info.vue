<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.TRANSFER.BIC.TITLE') }}
		</template>

		<article class="m-transfer-bic-info__content">
			<p class="m-transfer-bic-info__desc">
				{{ $t('INFO.TRANSFER.BIC.DESC1') }}
			</p>
			<p class="m-transfer-bic-info__desc">
				{{ $t('INFO.TRANSFER.BIC.DESC2') }}
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
	name: 'm-transfer-bic-info',

	components: { LModal, CButton, CIcon },
};
</script>

<style lang="scss" scoped>
.m-transfer-bic-info__content {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
}

.m-transfer-bic-info__desc:not(:first-child) {
	padding-top: 20px;
}
</style>
