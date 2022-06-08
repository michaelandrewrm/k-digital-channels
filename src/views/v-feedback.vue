<template>
	<l-page :loading="loading">
		<h1 slot="header" tabindex="-1">{{ $t('FEEDBACK.TITLE') }}</h1>

		<c-operation-success v-if="success" slot="state">
			<template v-slot:title>
				{{ $t('FEEDBACK.RESPONSE_SUCCESS_TITLE') }}
			</template>

			<p class="text-l-book">{{ $t('FEEDBACK.RESPONSE_SUCCESS_SUBTITLE') }}</p>

			<c-button raised slot="buttons" data-testid="continue" @click="goBack">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>

			<router-link
				slot="buttons"
				:to="{ name: 'home', replace: true }"
				class="v-feedback__go-home text-m-medium"
			>
				{{ $t('ACTIONS.GO_TO_VIEW', { view: $t('GLOBAL_POSITION') }) }}
			</router-link>
		</c-operation-success>

		<c-operation-error v-if="error" slot="state" @confirm="goBack">
			<template v-slot:title>
				{{ $t('FEEDBACK.RESPONSE_ERROR_TITLE') }}
			</template>

			<p class="text-l-book">{{ $t('FEEDBACK.RESPONSE_ERROR_SUBTITLE') }}</p>

			<c-button raised slot="buttons" data-testid="continue">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</c-operation-error>

		<div class="v-feedback__wrapper">
			<h2 class="v-feedback__subtitle text-l-medium">{{ $t('FEEDBACK.REVIEW.APP') }}</h2>

			<div class="v-feedback__rate">
				<c-input-rate name="feedback" :value="1" v-model="rate" />
				<c-input-rate name="feedback" :value="2" v-model="rate" />
				<c-input-rate name="feedback" :value="3" v-model="rate" />
				<c-input-rate name="feedback" :value="4" v-model="rate" />
				<c-input-rate name="feedback" :value="5" v-model="rate" />
			</div>

			<c-transfer-textarea
				data-testid="review"
				v-model.trim="review"
				:placeholder="$t('FEEDBACK.PLACEHOLDER')"
				rows="5"
				maxlength="1000"
			/>
		</div>

		<c-button
			slot="buttons"
			data-testid="submit-button"
			raised
			:disabled="isButtonDisabled"
			@click="submit"
		>
			{{ $t('ACTIONS.SEND') }}
		</c-button>
	</l-page>
</template>

<script>
import COperationSuccess from '@components/c-operation-success';
import COperationError from '@components/c-operation-error';
import CTransferTextarea from '@components/c-transfer-textarea';
import CButton from '@components/c-button';
import CInputRate from '@components/c-input-rate';
import LPage from '@layouts/l-page';

import communicationsModule from '@modules/communications/m-communications';

export default {
	name: 'v-feedback',

	modules: {
		communications: communicationsModule,
	},

	components: {
		COperationSuccess,
		COperationError,
		CTransferTextarea,
		CButton,
		CInputRate,
		LPage,
	},

	data() {
		return {
			review: '',
			rate: null,
			loading: false,
			success: false,
			error: false,
		};
	},

	computed: {
		isButtonDisabled({ review, rate }) {
			return !(review && rate);
		},
	},

	methods: {
		submit() {
			const { rate, review } = this;
			const channel = 'WEB';
			const version = window.VUE_APP_CONFIG?.version || 'dev';
			const data = { rate, review, channel, version };

			this.loading = true;

			const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

			wait(1000)
				.then(() => this.$store.dispatch('communications/postFeedback', data))
				.then(() => {
					this.success = true;
				})
				.catch(() => {
					this.error = true;
				})
				.finally(() => {
					this.loading = false;
				});
		},

		goBack() {
			window.history.pushState({}, '', this.$router.resolve({ name: 'feedback' }).href);

			this.success = false;
			this.error = false;
			this.review = '';
			this.rate = null;

			this.$router.back();
		},
	},
};
</script>

<style lang="scss" scoped>
.v-feedback__subtitle {
	text-align: center;
	margin-top: 20px;
	margin-bottom: 30px;
	padding-bottom: 30px;
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.v-feedback__wrapper {
	max-width: 400px;
	width: 100%;
	margin: 0 auto;
	padding: 0 20px;
}

.v-feedback__rate {
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: 1fr;
	gap: 20px;
	margin-top: 40px;
	margin-bottom: 40px;
}

.v-feedback__go-home {
	margin-top: 20px;
}
</style>
