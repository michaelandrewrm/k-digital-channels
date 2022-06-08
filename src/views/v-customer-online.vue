<template>
	<l-page>
		<h1 tabindex="-1" slot="header">{{ $t('CUSTOMER_SERVICE.ONLINE_BANK.TITLE') }}</h1>

		<section class="v-customer-online__content">
			<div class="v-customer-online__card">
				<h2 class="v-customer-online__title text-l-medium">
					{{ $t('ONLINE_BANK.CONTACT_CENTER.TITLE') }}
				</h2>
				<p class="v-customer-online__description text-m-book">
					{{ $t('ONLINE_BANK.CONTACT_CENTER.DESC1') }}
				</p>
				<div class="v-customer-online__icon-text">
					<c-icon src="@icons/phone" size="s" />
					<span class="text-m-book">{{ $t('ONLINE_BANK.CONTACT_CENTER.DESC2') }}</span>
				</div>
			</div>

			<h2 class="v-customer-online__interest-phones text-xl-light">
				{{ $t('ONLINE_BANK.INTEREST_PHONES') }}
			</h2>

			<div class="v-customer-online__card-group">
				<div class="v-customer-online__card">
					<h2 class="v-customer-online__title text-l-medium">
						{{ $t('ONLINE_BANK.COMPANY_BANK.TITLE') }}
					</h2>
					<div class="v-customer-online__icon-text">
						<c-icon src="@icons/phone" size="s" />
						<span class="text-m-book">{{ $t('ONLINE_BANK.COMPANY_BANK.DESC') }}</span>
					</div>
				</div>
				<div class="v-customer-online__card">
					<h2 class="v-customer-online__title text-l-medium">
						{{ $t('ONLINE_BANK.PRIVATE_BANK.TITLE') }}
					</h2>
					<div class="v-customer-online__icon-text">
						<c-icon src="@icons/phone" size="s" />
						<span class="text-m-book">{{ $t('ONLINE_BANK.PRIVATE_BANK.DESC') }}</span>
					</div>
				</div>
				<div class="v-customer-online__card">
					<h2 class="v-customer-online__title text-l-medium">
						{{ $t('ONLINE_BANK.PARTNER_BANK.TITLE') }}
					</h2>
					<div class="v-customer-online__icon-text">
						<c-icon src="@icons/phone" size="s" />
						<span class="text-m-book">{{ $t('ONLINE_BANK.PARTNER_BANK.DESC') }}</span>
					</div>
				</div>
				<div class="v-customer-online__card">
					<h2 class="v-customer-online__title text-l-medium">
						{{ $t('ONLINE_BANK.CAMINOS_FAM.TITLE') }}
					</h2>
					<div class="v-customer-online__icon-text">
						<c-icon src="@icons/phone" size="s" />
						<span class="text-m-book">{{ $t('ONLINE_BANK.CAMINOS_FAM.DESC') }}</span>
					</div>
				</div>
			</div>

			<div class="v-customer-online__card">
				<h2 class="v-customer-online__title text-l-medium">
					{{ $t('ONLINE_BANK.INTERNATIONAL_AREA.TITLE') }}
				</h2>
				<p class="v-customer-online__description text-m-book">
					{{ $t('ONLINE_BANK.INTERNATIONAL_AREA.DESC1') }}
				</p>
				<div class="v-customer-online__icon-text">
					<c-icon src="@icons/phone" size="s" />
					<span class="text-m-book">{{ $t('ONLINE_BANK.INTERNATIONAL_AREA.DESC2') }}</span>
				</div>
				<div class="v-customer-online__icon-text">
					<c-icon src="@icons/mail" size="s" />
					<span class="text-m-book">{{ $t('ONLINE_BANK.INTERNATIONAL_AREA.DESC3') }}</span>
				</div>
				<p class="text-m-book">{{ $t('ONLINE_BANK.INTERNATIONAL_AREA.DESC4') }}</p>
			</div>
			<div class="v-customer-online__card">
				<h2 class="v-customer-online__title text-l-medium">
					{{ $t('ONLINE_BANK.LOSS.TITLE') }}
				</h2>
				<div class="v-customer-online__icon-text">
					<c-icon src="@icons/phone" size="s" />
					<span class="text-m-book">{{ $t('ONLINE_BANK.LOSS.DESC') }}</span>
				</div>
			</div>
		</section>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CIcon from '@components/c-icon';

export default {
	name: 'v-customer-online',

	components: {
		LPage,
		CIcon,
	},
};
</script>

<style lang="scss">
.v-customer-online__content {
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: center;
	text-align: center;
	padding-top: 20px;
	padding-bottom: 20px;
}

.v-customer-online__card {
	display: flex;
	width: 100%;
	border: RGB(var(--color-surface-dark));
	border-radius: $border-radius-m;
	background-color: RGB(var(--color-surface-light));
	flex-direction: column;
	align-items: center;
	padding: 20px;
	margin-bottom: 10px;
	line-height: 1.8;
	white-space: pre-line;
}

.v-customer-online__interest-phones {
	margin-top: 10px;
	margin-bottom: 20px;
}

.v-customer-online__icon-text {
	display: inline-flex;
	align-items: center;
	gap: 10px;
}

.v-customer-online__card-group {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	width: 100%;
	align-items: center;
	text-align: center;
	margin-bottom: 10px;
	& .v-customer-online__card {
		margin-bottom: 0px;
	}
}
</style>
