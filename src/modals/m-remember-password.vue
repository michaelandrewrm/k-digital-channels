<template>
	<l-modal data-id="layout">
		<template v-slot:header>
			{{ $t('INFO.REMEMBER_PASSWORD.TITLE') }}
		</template>

		<article>
			<p>{{ $t('INFO.REMEMBER_PASSWORD.DESC1') }}</p>

			<div class="m-remember-password__whatsapp">
				<div class="m-remember-password__whatsapp-wrapper">
					<div class="m-remember-password__whatsapp-header">
						<c-icon class="m-remember-password__whatsapp-icon" src="@icons/whatsapp" />
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
				<div class="m-remember-password__whatsapp-schedule">
					<p class="text-m-book">{{ $t('INFO.REMEMBER_PASSWORD.WHATSAPP_SCHEDULE') }}</p>
				</div>
			</div>

			<p class="m-remember-password__telephone-schedule">
				{{ $t('INFO.REMEMBER_PASSWORD.DESC2') }}
				<b>{{ $t('TELEPHONE') }}</b>
				{{ $t('INFO.REMEMBER_PASSWORD.DESC3') }}
			</p>

			<p class="m-remember-password__email">
				{{ $t('INFO.REMEMBER_PASSWORD.DESC4') }}
				<b>{{ $t('INFO.REMEMBER_PASSWORD.DESC5') }}</b>
			</p>
		</article>
	</l-modal>
</template>

<script>
import CIcon from '@components/c-icon';
import LModal from '@layouts/l-modal';

export default {
	name: 'm-remember-password',

	components: {
		LModal,
		CIcon,
	},
};
</script>

<style lang="scss" scoped>
article {
	display: flex;
	flex-direction: column;
	min-height: 120px;
	margin: 0 auto;
	width: 100%;
}

.m-remember-password__whatsapp {
	padding: 0 30px 20px;
	border: 1px solid RGB(var(--color-surface-dark));
	display: flex;
	flex-direction: column;
	margin-top: 30px;
	white-space: pre-line;
}

.m-remember-password__whatsapp-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px 0 6px;
}

.m-remember-password__whatsapp-header {
	display: flex;
	padding-bottom: 6px;
}

.m-remember-password__whatsapp-icon {
	margin-right: 10px;
	font-size: 16px;
}

.m-remember-password__telephone-schedule {
	padding: 10px 0;
}
</style>
