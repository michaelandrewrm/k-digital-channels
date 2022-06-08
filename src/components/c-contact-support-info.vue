<template>
	<div class="c-contact-support-info">
		<div class="c-contact-support-info__b1">
			<div class="c-contact-support-info__whatsapp">
				<c-icon class="c-contact-support-info__icon" src="@icons/whatsapp" />
				<p class="text-m-book">{{ $t('WHATSAPP') }}</p>
			</div>
			<a
				class="text-m-medium"
				:href="`tel:${$store.state.app.whatsapp}`"
				v-a11y-tel="$store.state.app.whatsapp"
			>
				{{ $store.state.app.whatsapp }}
			</a>
		</div>
		<div class="c-contact-support-info__b1-info">
			<p class="text-m-book">{{ $t('CONTACT_SUPPORT.WHATSAPP') }}</p>
		</div>
		<div class="c-contact-support-info__b2">
			<div class="c-contact-support-info__telephone">
				<c-icon class="c-contact-support-info__icon" src="@icons/phone" />
				<p class="text-m-book">{{ $t('INFO.REMEMBER_PASSWORD.TEL_BANK') }}</p>
			</div>
			<a
				class="text-m-medium"
				:href="`tel:${$store.state.app.telephone}`"
				v-a11y-tel="$store.state.app.telephone"
			>
				{{ $store.state.app.telephone }}
			</a>
		</div>
		<div class="c-contact-support-info__b2-info">
			<p class="text-m-book">{{ $t('CONTACT_SUPPORT.PHONE') }}</p>
		</div>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';

export default {
	name: 'c-contact-support-info',

	components: { CIcon },
};
</script>

<style lang="scss" scoped>
.c-contact-support-info {
	padding: 0 30px 20px;
	border: 1px solid RGB(var(--color-surface-dark));
	display: flex;
	flex-direction: column;
	margin-top: 30px;
	white-space: pre-line;
}

.c-contact-support-info__b1,
.c-contact-support-info__b2 {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px 0 6px;
}

.c-contact-support-info__whatsapp,
.c-contact-support-info__telephone {
	display: flex;
	padding-bottom: 6px;
}

.c-contact-support-info__b2 {
	border-top: 2px solid RGB(var(--color-secondary));
	margin-top: 20px;
}

.c-contact-support-info__icon {
	margin-right: 10px;
	font-size: 16px;
}
</style>
