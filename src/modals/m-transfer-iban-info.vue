<template>
	<l-modal>
		<template v-slot:icon>
			<c-icon class="icon" src="@icons/modalExclamation" />
		</template>

		<template v-slot:header>
			{{ $t('INFO.TRANSFER.IBAN.TITLE') }}
		</template>

		<article class="m-transfer-iban-info__content">
			<p class="m-transfer-iban-info__desc">
				{{ $t('INFO.TRANSFER.IBAN.DESC') }}
			</p>
			<p class="m-transfer-iban-info__desc">
				{{ $t('INFO.TRANSFER.IBAN.SPANISH_IBAN_DIGITS') }}
			</p>
			<div class="m-transfer-iban-info__contact-detail">
				<p>
					{{ $t('INFO.TRANSFER.IBAN.EXAMPLE') }}
				</p>
			</div>
			<p class="m-transfer-iban-info__desc">
				{{ $t('INFO.TRANSFER.IBAN.COUNTRY_DIGITS') }}
			</p>
			<p class="m-transfer-iban-info__desc">
				{{ $t('INFO.TRANSFER.IBAN.VALIDATION_DIGITS') }}
			</p>
			<p class="m-transfer-iban-info__desc">
				{{ $t('INFO.TRANSFER.IBAN.CCC_DIGITS') }}
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
	name: 'm-transfer-iban-info',

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

.m-transfer-iban-info__desc:not(:first-child) {
	padding-top: 20px;
}

.m-transfer-iban-info__contact-detail {
	margin-top: 20px;
	padding: 10px;
	border: 1px solid RGB(var(--color-surface-dark));
}
</style>
