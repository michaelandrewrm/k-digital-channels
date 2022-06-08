<template>
	<l-page>
		<h1 tabindex="-1" slot="header">{{ $t('CUSTOMER_SERVICE.OFFICES.TITLE') }}</h1>
		<div class="v-customer-offices">
			<!-- Bancofar -->
			<div class="v-customer-offices__content" v-if="isBancofar">
				<div class="v-customer-offices__description">
					<p class="text-m-book">{{ $t('OFFICES.DESC') }}</p>
					<p class="text-l-medium">{{ $t('OFFICES.SCHEDULES').concat(':') }}</p>
					<p class="text-m-book">{{ $t('OFFICES.SCHEDULES.SCHEDULE1') }}</p>
					<p class="text-m-book">{{ $t('OFFICES.SCHEDULES.SCHEDULE2') }}</p>
				</div>

				<div class="v-customer-offices__card --bancofar">
					<h2 class="v-customer-offices__card-title text-l-bold">{{ $t('OFFICES.MADRID') }}</h2>

					<div class="v-customer-offices__card-info text-m-book">
						<p>{{ $t('OFFICES.BANCOFAR-MADRID1.TITLE') }}</p>
						<p class="--no-line-height">{{ $t('OFFICES.BANCOFAR-MADRID1.DESC') }}</p>
					</div>
				</div>

				<div class="v-customer-offices__card --bancofar">
					<h2 class="v-customer-offices__card-title text-l-bold">{{ $t('OFFICES.MADRID') }}</h2>

					<div class="v-customer-offices__card-info text-m-book">
						<p>{{ $t('OFFICES.BANCOFAR-MADRID2.TITLE') }}</p>
						<p class="--no-line-height">{{ $t('OFFICES.BANCOFAR-MADRID2.DESC') }}</p>
					</div>
				</div>
			</div>
			<!-- Bancocaminos -->
			<div class="v-customer-offices__content" v-else>
				<h2 class="v-customer-offices__title text-xl-book">
					{{ $t('OFFICES.PRINCIPAL_OFFICES.TITLE') }}
				</h2>

				<p class="v-customer-offices__description text-m-light">
					{{ $t('OFFICES.PRINCIPAL_OFFICES.DESC') }}
				</p>

				<!-- Madrid 1 -->
				<div class="v-customer-offices__card">
					<h2 class="v-customer-offices__card-title text-l-bold">{{ $t('OFFICES.MADRID') }}</h2>

					<div class="v-customer-offices__card-info">
						<p class="text-l-medium">{{ $t('OFFICES.ADDRESS').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.MADRID.ADDRESS1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.CONTACT_OFFICE').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.MADRID.CONTACT_OFFICE.PHONE1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.CONTACT_PYMES').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.MADRID.CONTACT_PYMES.PHONE1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.CONTACT_FINANCING').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.MADRID.CONTACT_FINANCING.PHONE1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.FAX').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.MADRID.FAX1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.EMAIL').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.MADRID.EMAIL1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.CASHIER_SCHEDULE').concat(':') }}</p>
						<p class="text-m-book --no-line-height">
							{{ $t('OFFICES.MADRID.CASHIER_SCHEDULE.SCHEDULE1') }}
						</p>

						<p class="text-l-medium">{{ $t('OFFICES.OTHER_DEPARTMENTS_SCHEDULE').concat(':') }}</p>
						<p class="text-m-book --no-line-height">
							{{ $t('OFFICES.MADRID.OTHER_DEPARTMENTS_SCHEDULE.SCHEDULE1') }}
						</p>
					</div>
				</div>

				<!-- Madrid 2 -->
				<div class="v-customer-offices__card">
					<h2 class="v-customer-offices__card-title text-l-bold">{{ $t('OFFICES.MADRID') }}</h2>

					<div class="v-customer-offices__card-info">
						<p class="text-l-medium">{{ $t('OFFICES.ADDRESS').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.MADRID.ADDRESS2') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.CONTACT_OFFICE').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.MADRID.CONTACT_OFFICE.PHONE2') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.EMAIL').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.MADRID.EMAIL2') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.SCHEDULES').concat(':') }}</p>
						<p class="text-m-book --no-line-height">
							{{ $t('OFFICES.MADRID.SCHEDULES.SCHEDULE2') }}
						</p>
					</div>
				</div>

				<!-- Barcelona 1 -->
				<div class="v-customer-offices__card">
					<h2 class="v-customer-offices__card-title text-l-bold">{{ $t('OFFICES.BARCELONA') }}</h2>

					<div class="v-customer-offices__card-info">
						<p class="text-l-medium">{{ $t('OFFICES.ADDRESS').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.BARCELONA.ADDRESS1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.CONTACT_OFFICE').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.BARCELONA.CONTACT_OFFICE.PHONE1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.CONTACT_COMPANY').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.BARCELONA.CONTACT_COMPANY.PHONE1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.CONTACT_PRIVATE').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.BARCELONA.CONTACT_PRIVATE.PHONE1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.FAX').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.BARCELONA.FAX1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.EMAIL').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.BARCELONA.EMAIL1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.SCHEDULES').concat(':') }}</p>
						<p class="text-m-book --no-line-height">
							{{ $t('OFFICES.BARCELONA.SCHEDULES.SCHEDULE1') }}
						</p>
					</div>
				</div>

				<!-- A Coruña 1 -->
				<div class="v-customer-offices__card">
					<h2 class="v-customer-offices__card-title text-l-bold">{{ $t('OFFICES.ACORUNYA') }}</h2>

					<div class="v-customer-offices__card-info">
						<p class="text-l-medium">{{ $t('OFFICES.ADDRESS').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.ACORUNYA.ADDRESS1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.CONTACT_OFFICE').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.ACORUNYA.CONTACT_OFFICE.PHONE1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.EMAIL').concat(':') }}</p>
						<p class="text-m-book">{{ $t('OFFICES.ACORUNYA.EMAIL1') }}</p>

						<p class="text-l-medium">{{ $t('OFFICES.SCHEDULES').concat(':') }}</p>
						<p class="text-m-book --no-line-height">
							{{ $t('OFFICES.ACORUNYA.SCHEDULES.SCHEDULE1') }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import LPage from '@layouts/l-page';

export default {
	name: 'v-customer-offices',

	components: {
		LPage,
	},

	data() {
		return {
			offices: null,
		};
	},

	computed: {
		...mapState('app', ['companyId']),

		/* istanbul ignore next */
		isBancofar({ companyId }) {
			return companyId === 'BF';
		},
	},
};
</script>

<style lang="scss">
.v-customer-offices__title {
	margin-top: 20px;
}

.v-customer-offices__description {
	padding: 20px 0px;
}

.v-customer-offices__description p {
	margin-bottom: 10px;
}

.v-customer-offices__content {
	margin-top: 10px;
}

.v-customer-offices__card {
	display: flex;
	flex-direction: column;
	text-align: center;
	background-color: RGB(var(--color-surface-light));
	padding-bottom: 10px;
	margin-bottom: 10px;
	white-space: pre-line;
}

.v-customer-offices__card.--bancofar {
	text-align: left;
	line-height: 1.5;
	padding: 10px;
}

.v-customer-offices__card:not(.--bancofar) .v-customer-offices__card-title {
	padding: 10px;
	margin-bottom: 10px;
	background-color: RGB(var(--color-surface-dark));
}

.v-customer-offices__card-info p:not(.--no-line-height) {
	line-height: 2;
}
</style>
