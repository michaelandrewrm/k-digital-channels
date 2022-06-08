<template>
	<l-page>
		<h1 slot="header" tabindex="-1">{{ $t('BIZUM.TITLE') }}</h1>

		<c-operation-success v-if="success" slot="state" data-testid="operation-success">
			<template v-slot:title>
				{{ title }}
			</template>

			<div v-if="isBettingPayment" class="v-bizum-selae-detail__description text-m-book">
				{{ $t('BIZUM.SELAE.BETS.SUCCESS_DESCRIPTION') }}
			</div>

			<w-bizum-selae-detail v-if="source" :source="source"></w-bizum-selae-detail>

			<template v-slot:snackbar>
				<router-link
					v-if="isBettingPayment"
					:to="{ name: 'signatures', params: { type: 'pending' } }"
					class="v-bizum-selae-detail__alert"
					data-testid="alert"
				>
					<c-alert warning actionable>
						{{ $tc('SIGNATURES.WARNING_TITLE') }}
					</c-alert>
				</router-link>
			</template>

			<c-button raised slot="buttons" @click="gotoDashboard" data-testid="continue">
				{{ $t('ACTIONS.CONTINUE') }}
			</c-button>
		</c-operation-success>

		<c-operation-error
			v-if="error"
			contact-us
			slot="state"
			@confirm="$router.go(-2)"
			data-testid="operation-error"
		>
			<h1 slot="title">{{ errorTitle }}</h1>
			<p class="text-m-book">{{ errorDetail }}</p>
		</c-operation-error>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CButton from '@components/c-button';
import COperationError from '@components/c-operation-error';
import COperationSuccess from '@components/c-operation-success';
import CAlert from '@components/c-alert';
import WBizumSelaeDetail from '@widgets/w-bizum-selae-detail';

export default {
	name: 'v-bizum-selae-detail',

	components: {
		LPage,
		CButton,
		COperationError,
		COperationSuccess,
		WBizumSelaeDetail,
		CAlert,
	},

	props: {
		success: Boolean,
		source: Object,
		error: Boolean,
		errorTitle: String,
		errorDetail: String,
	},

	computed: {
		title({ source }) {
			/* istanbul ignore next */
			return source?.operationType === 'PAGO-PREMIOS'
				? this.$t('BIZUM.SELAE.PRIZE.SUCCESS')
				: this.$t('BIZUM.SELAE.BETS.SUCCESS');
		},

		isBettingPayment({ source }) {
			return source?.operationType === 'COBRO-APUESTAS';
		},
	},
	methods: {
		gotoDashboard() {
			this.$router.replace({ name: 'bizum-dashboard' });
		},
	},

	created() {
		if (!this.source) {
			this.$router.go(-1);
		}
	},
};
</script>

<style lang="scss" scoped>
.v-bizum-selae-detail__description {
	text-align: left;
	padding-bottom: 15px;
}
</style>
