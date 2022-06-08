<template>
	<l-page :loading="loading">
		<h1 slot="header" tabindex="-1">{{ $t('BIZUM.TITLE') }}</h1>

		<c-operation-success v-if="success" slot="state" data-testid="operation-success">
			<h1 slot="title">{{ $t('BIZUM.REGISTER.SUCCESS.TITLE') }}</h1>
			<p class="v-bizum-register__text text-m-book">
				{{ $t('BIZUM.REGISTER.SUCCESS.DESC') }}
			</p>

			<div v-if="pdf">
				<a
					v-if="!isHybrid"
					class="v-bizum-register__download-pdf text-m-medium"
					:href="pdf"
					download
					target="_blank"
				>
					<c-icon src="@icons/pdf" />
					{{ $t('ACTIONS.DOWNLOAD_DOCUMENT').concat(' ', $t('DETAIL.CONTRACT').toLowerCase()) }}
				</a>

				<button v-else class="v-bizum-register__download-pdf text-m-medium" @click="openPDF">
					<c-icon src="@icons/pdf" />
					{{ $t('ACTIONS.DOWNLOAD_DOCUMENT').concat(' ', $t('DETAIL.CONTRACT').toLowerCase()) }}
				</button>
			</div>

			<c-button raised slot="buttons" @click="gotoDashboard" data-testid="continue">
				{{ $t('BIZUM.ACTION.START') }}
			</c-button>
		</c-operation-success>

		<c-operation-error
			v-if="error"
			contact-us
			slot="state"
			@confirm="$router.go(-2)"
			data-testid="operation-error"
		>
			<h1 slot="title">{{ $t('BIZUM.REGISTER.ERROR.TITLE') }}</h1>
			<p class="text-m-book">{{ errorDetail }}</p>
		</c-operation-error>

		<section v-if="!success && !error" class="v-bizum-register__template">
			<c-translide>
				<div v-if="template" class="text-m-book" v-html="template"></div>
			</c-translide>

			<c-translide>
				<c-checkbox
					v-if="template"
					class="v-bizum-register__checkbox text-m-medium"
					v-model="accepted"
					data-testid="accept-terms"
					:label="$t('BIZUM.REGISTER.ACCEPT_TERMS')"
				/>
			</c-translide>
		</section>

		<c-button
			v-if="!success && !error && accepted"
			raised
			slot="buttons"
			data-testid="submit"
			@click="submit"
		>
			{{ $t('ACTIONS.CONFIRM') }}
		</c-button>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import bizumModule from '@modules/bizum/m-bizum';
import CButton from '@components/c-button';
import CCheckbox from '@components/c-checkbox';
import COperationError from '@components/c-operation-error';
import COperationSuccess from '@components/c-operation-success';
import CTranslide from '@components/c-translide';
import MBizumPortability from '@modals/m-bizum-portability';
import MBizumOTP from '@modals/m-bizum-otp';
import CIcon from '@components/c-icon';

import { BIZUM_PHONE_ALREADY_EXISTS, BIZUM_EMAIL_ALREADY_EXISTS } from '@modules/service/constants';

export default {
	name: 'v-bizum-register',

	modules: {
		bizum: bizumModule,
	},

	components: {
		LPage,
		CButton,
		CCheckbox,
		COperationError,
		COperationSuccess,
		CTranslide,
		CIcon,
	},

	props: {
		productId: { type: String, required: true },
	},

	data() {
		return {
			loading: false,
			error: false,
			errorDetail: '',
			success: false,
			accepted: null,
			template: '',
			pdf: null,
			version: null,
			isHybrid: navigator.userAgent.includes('Skybrid'),
		};
	},

	created() {
		this.refresh();
	},

	methods: {
		refresh() {
			this.error = false;
			this.fetch();
		},

		fetch() {
			this.$store
				.dispatch('bizum/getTerms')
				.then(({ template, version }) => {
					this.template = template;
					this.version = version;
					return this.$store.dispatch('bizum/getTermsInPDF');
				})
				.then((pdf) => {
					this.pdf = pdf;
				})
				.catch(() => {
					this.error = true;
				});
		},

		submit() {
			const { productId, version } = this;

			this.loading = true;

			const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

			wait(1000).then(() => {
				this.$store
					.dispatch('bizum/signUp', { productId, version })
					.then(() => {
						this.success = true;
					})
					.catch(async (error) => {
						const status = error?.response?.status;
						const signupId = error?.response?.data?.signupId;
						const code = error?.response?.data?.result?.code;

						if (code === BIZUM_PHONE_ALREADY_EXISTS) {
							this.errorDetail = this.$t('BIZUM.ERROR.PHONE_ALREADY_EXISTS');
						} else if (code === BIZUM_EMAIL_ALREADY_EXISTS) {
							this.errorDetail = this.$t('BIZUM.ERROR.EMAIL_ALREADY_EXISTS');
						} else {
							this.errorDetail = this.$t('INFO.UNAVAILABLE_OPERATIVE.ALT1');
						}

						if (status === 406 && signupId) {
							return this.$store
								.dispatch('modal/open', { component: MBizumPortability })
								.then((confirm) => {
									if (confirm) {
										return this.$store.dispatch('bizum/requestPortability', { signupId });
									}

									throw new Error('El usuario no ha aceptado la portabilidad');
								})
								.then(() =>
									this.$store.dispatch('otp/handle', {
										component: MBizumOTP,
										props: { signupId },
									})
								)
								.then((data) => {
									if (data) {
										if (data.response?.status === 403) {
											throw new Error('Máximo numero de intentos de OTP alcanzado');
										}
										this.success = true;
									} else {
										this.error = true;
									}
								})
								.catch((errorResponse) => {
									/* istanbul ignore next */
									if (errorResponse?.response) {
										const errorCode = errorResponse.response?.data?.result?.code;

										if (errorCode === BIZUM_PHONE_ALREADY_EXISTS) {
											this.errorDetail = this.$t('BIZUM.ERROR.PHONE_ALREADY_EXISTS');
										} else if (errorCode === BIZUM_EMAIL_ALREADY_EXISTS) {
											this.errorDetail = this.$t('BIZUM.ERROR.EMAIL_ALREADY_EXISTS');
										} else {
											this.errorDetail = this.$t('INFO.UNAVAILABLE_OPERATIVE.ALT1');
										}
									}
									this.error = true;
								});
						}
						this.error = true;
					})
					.finally(() => {
						this.loading = false;
					});
			});
		},

		gotoDashboard() {
			this.$router.replace({ name: 'bizum-dashboard' });
		},

		openPDF() {
			return window.dispatchEvent(
				new CustomEvent('open-external-link', { detail: { url: this.pdf } })
			);
		},
	},
};
</script>

<style lang="scss" scoped>
.v-bizum-register__checkbox {
	margin: 20px 0 100px;
}
.v-bizum-register__text {
	height: calc(100% - 100px);
}

.v-bizum-register__download-pdf {
	display: flex;
	align-items: center;
	padding: 20px;
	border: none;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
	width: 100%;
	text-align: left;
	& .c-icon {
		margin-right: 10px;
	}
}

a.v-bizum-register__download-pdf {
	text-decoration: none;
	color: inherit;
}

button.v-bizum-register__download-pdf {
	appearance: none;
	user-select: none;
	background: none;
}

.v-bizum-register__template /deep/ h1,
.v-bizum-register__template /deep/ h2,
.v-bizum-register__template /deep/ h3,
.v-bizum-register__template /deep/ ul,
.v-bizum-register__template /deep/ p {
	margin-bottom: 15px;
}

.v-bizum-register__template /deep/ ul {
	list-style: disc;
	padding-left: 10px;
}

.v-bizum-register__template /deep/ li {
	margin-bottom: 5px;
	margin-left: 10px;
}

.v-bizum-register__template /deep/ table {
	@extend %typo-s-book;
	text-align: center;
	margin-bottom: 15px;
}

.v-bizum-register__template /deep/ thead td {
	background-color: RGBA(var(--color-themed-surface-light), 0.05);
}

.v-bizum-register__template /deep/ td {
	padding: 10px;
	vertical-align: middle;
}

.v-bizum-register__template /deep/ tr {
	border-bottom: 1px solid;
}
</style>
