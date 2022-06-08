<template>
	<l-new-transfer :loading="loading">
		<h1 slot="header" tabindex="-1">{{ $t('CORREOS_CASH.TITLE') }}</h1>

		<div class="v-correos-cash-deposit__progress" slot="main-pre-content">
			<c-step-progress
				:current="currentStep"
				:steps="[$t('TRANSFERS.DESTINATION'), $t('TRANSFERS.DATA'), $t('TRANSFERS.CONFIRMATION')]"
			/>
		</div>

		<w-transfer-resume
			v-model="model"
			editable
			:invalid-section="invalidSection"
			@edit="openSection"
		/>

		<w-correos-cash-destination
			v-if="currentStep === STEP_DESTINATION"
			slot="sheet"
			data-testid="form-destination"
			ref="widgetDestination"
			v-model="model"
		/>

		<w-correos-cash-amount
			v-if="currentStep === STEP_AMOUNT"
			slot="sheet"
			data-testid="form-amount"
			ref="widgetAmount"
			:max-amount="{ amount: 10000, currency: { id: 'EUR' } }"
			v-model="model"
		/>

		<c-button
			raised
			@click="submit"
			slot="buttons"
			v-if="currentStep === STEP_RESUME"
			data-testid="submit-transfer"
			:disabled="loading"
		>
			<span>
				{{ $t('ACTIONS.CONTINUE') }}
			</span>
		</c-button>

		<c-operation-error
			v-if="error"
			contact-us
			slot="state"
			@confirm="$router.back()"
			data-testid="operation-error"
		>
			<template slot="title">
				{{ $t('TRANSFERS.CORREOS_CASH.ERROR') }}
			</template>
			<p class="text-s-book">{{ $t('TRANSFERS.CORREOS_CASH.ERROR') }}</p>
			<p class="text-s-book">{{ $t('TRANSFERS.CORREOS_CASH.CONTACT_US') }}</p>
		</c-operation-error>

		<c-operation-success
			v-if="success"
			slot="state"
			data-testid="operation-success"
			class="v-correos-cash-deposit__success-state"
		>
			<template slot="title">
				{{ $t('TRANSFERS.CORREOS_CASH.SUCCESS.TITLE') }}
			</template>

			<div class="v-correos-cash-deposit__success-resume">
				<p class="text-m-medium">
					{{ $t('TRANSFERS.CORREOS_CASH.SUCCESS.SUBTITLE', { codes: source.details.length }) }}
				</p>

				<p class="text-s-light">{{ $t('TRANSFERS.CORREOS_CASH.SUCCESS.DESC') }}</p>

				<div class="v-correos-cash-deposit__barcodes">
					<p v-if="source.details && source.details.length" class="text-m-medium">
						{{
							$t('DETAIL.CORREOS_CASH.CODE', {
								index: selected + 1,
								quantity: source.details.length,
							})
						}}
					</p>

					<c-slider
						v-if="barcodes.length"
						data-testid="slider"
						class="v-correos-cash-deposit__slider"
						:selected="selected"
						@change="selected = $event"
					>
						<img
							v-for="code in barcodes"
							:key="code.id"
							:id="code.id"
							class="v-correos-cash-deposit__image"
							:src="code.base64Image"
						/>
					</c-slider>
				</div>
			</div>

			<div class="v-correos-cash-deposit__success-resume">
				<c-list-icon-item
					v-if="model.destination"
					:title="$t('TRANSFERS.DESTINATION_ACCOUNT')"
					icon="@icons/paper"
				>
					<div class="v-correos-cash-deposit__custom-list-item">
						<span class="text-m-light">
							{{ model.destination.view.name }}
						</span>
						<span class="text-m-light">
							{{ model.destination.view.id }}
						</span>
					</div>
				</c-list-icon-item>

				<c-list-icon-item
					v-if="model.amount"
					:title="$t('TRANSFERS.TOTAL_AMOUNT')"
					icon="@icons/valueAccountUnit"
					:description="$nc(model.amount)"
				/>

				<c-list-icon-item
					v-if="source.details[selected].amount"
					:title="$t('TRANSFERS.CODE_AMOUNT')"
					icon="@icons/valueAccountUnit"
					:description="$nc({ amount: source.details[selected].amount, currency: { id: 'EUR' } })"
				/>
			</div>

			<div class="v-correos-cash-deposit__buttons" slot="buttons">
				<w-actions v-if="actionOptions && actionOptions.length" :options="actionOptions" />

				<router-link
					:to="{ name: 'home', replace: true }"
					class="v-correos-cash-deposit__link text-m-medium"
					data-testid="go-home"
				>
					{{ $t('ACTIONS.GO_TO_VIEW', { view: $t('GLOBAL_POSITION') }) }}
				</router-link>
			</div>
		</c-operation-success>
	</l-new-transfer>
</template>

<script>
import Vue from 'vue';
import correosCash from '@modules/correos-cash/m-correos-cash';
import LNewTransfer from '@layouts/l-new-transfer';
import CSlider from '@components/c-slider';
import COperationError from '@components/c-operation-error';
import COperationSuccess from '@components/c-operation-success';
import CStepProgress from '@components/c-step-progress';
import CButton from '@components/c-button';
import CListIconItem from '@components/c-list-icon-item';

import WTransferResume from '@widgets/w-transfer-resume';
import WCorreosCashDestination from '@widgets/w-correos-cash-destination';
import WCorreosCashAmount from '@widgets/w-correos-cash-amount';
import WActions from '@widgets/w-actions';
import WCorreosCashDownload from '@widgets/w-correos-cash-download';
import WCorreosCashShare from '@widgets/w-correos-cash-share';

import iconShare from '@icons/share';
import iconDownload from '@icons/download';
import iconCorreos from '@icons/correos';

import SessionCache from '@modules/session/session-cache';

export default {
	name: 'v-correos-cash-deposit',

	modules: {
		'correos-cash': correosCash,
	},

	components: {
		LNewTransfer,
		CSlider,
		COperationError,
		COperationSuccess,
		CStepProgress,
		CButton,
		CListIconItem,
		WTransferResume,
		WCorreosCashDestination,
		WCorreosCashAmount,
		WActions,
	},

	data() {
		return {
			STEP_DESTINATION: 1,
			STEP_AMOUNT: 2,
			STEP_RESUME: 3,
			STEP_FINAL: 4,

			currentStep: 1,
			loading: false,
			success: false,
			error: false,
			source: null,
			barcodes: [],
			selected: 0,
			invalidSection: [],

			model: {
				destination: null,
				amount: null,
			},

			notifications: {
				downloaded: [],
				shared: [],
			},

			canShare: typeof window.navigator.share === 'function',
			isHybrid: navigator.userAgent.includes('Skybrid'),
		};
	},

	computed: {
		actionOptions() {
			const { canShare, isHybrid } = this;
			const isAvailable = canShare || isHybrid;

			return [
				{
					id: 'download',
					title: this.$t('ACTIONS.DOWNLOAD_CODES'),
					icon: iconDownload,
					action: this.downloadCodes,
				},
				isAvailable && {
					id: 'share',
					title: this.$t('ACTIONS.SHARE_CODES'),
					icon: iconShare,
					action: this.shareCodes,
				},
				{
					id: 'find-office',
					title: this.$t('ACTIONS.FIND_OFFICE'),
					icon: iconCorreos,
					action: this.openOfficeFinder,
				},
			];
		},
	},

	methods: {
		openNotification(type, { amount, canvas, template }) {
			this.notifications[type].push(
				this.$store.dispatch('notification/open', {
					template,
					props: {
						title: this.$t('CORREOS_CASH.CODE_AMOUNT', {
							amount: this.$nc({ amount, currency: { id: 'EUR' } }),
						}),
						canvas,
					},
					timeout: 5000,
				})
			);
		},

		downloadCodes() {
			const type = 'downloaded';

			if (this.notifications[type].length) {
				return;
			}

			this.barcodes.forEach(({ amount, canvas }) => {
				this.openNotification(type, {
					amount,
					canvas,
					template: Vue.extend(WCorreosCashDownload),
				});
			});

			Promise.allSettled(this.notifications[type]).then(() => {
				this.notifications[type] = [];
			});
		},

		shareCodes() {
			const type = 'shared';

			if (this.notifications[type].length) {
				return;
			}

			this.barcodes.forEach(({ amount, canvas }) => {
				this.openNotification(type, {
					amount,
					canvas,
					template: Vue.extend(WCorreosCashShare),
				});
			});

			Promise.allSettled(this.notifications[type]).then(() => {
				this.notifications[type] = [];
			});
		},

		openOfficeFinder() {
			const url = 'https://www.correos.es/es/es/herramientas/oficinas-buzones-citypaq/detalle';

			if (this.isHybrid) {
				return window.dispatchEvent(new CustomEvent('open-external-browser', { detail: { url } }));
			}

			const tab = window.open();
			tab.location.replace(url);
		},

		openSection(section) {
			const { STEP_DESTINATION, STEP_AMOUNT } = this;

			this.currentStep = {
				destination: STEP_DESTINATION,
				amount: STEP_AMOUNT,
			}[section];
		},

		async submit() {
			const { model, loading } = this;
			const { dispatch } = this.$store;

			if (loading) {
				return;
			}

			this.loading = true;

			const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

			await wait(1000);

			dispatch('correos-cash/request', model)
				.then((data) => {
					const details = data?.details?.map((item) => ({
						...item,
						beneficiary: data?.beneficiary,
					}));
					this.source = { ...data, details };
					return dispatch('correos-cash/generateCodes', { details });
				})
				.then((qrCodes) => {
					this.barcodes = qrCodes;
					this.success = true;
					SessionCache.clear('correos-cash');
				})
				.catch(() => {
					this.error = true;
				})
				.finally(() => {
					this.loading = false;
					this.currentStep = this.STEP_FINAL;
				});
		},
	},

	watch: {
		model: {
			deep: true,
			handler(model) {
				this.currentStep = this.STEP_RESUME;

				if (!model.amount) {
					this.currentStep = this.STEP_AMOUNT;
				}

				if (!model.destination) {
					this.currentStep = this.STEP_DESTINATION;
				}
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.v-correos-cash-deposit__progress {
	position: relative;
	margin: 10px 20px 20px;
}

.v-correos-cash-deposit__buttons {
	display: grid;
	width: 100%;
	max-width: $theme-max-width;
	grid-gap: 10px;
	grid-template-columns: 1fr min-content;
}

.v-correos-cash-deposit__buttons .v-correos-cash-deposit__link {
	margin-top: 20px;
}

.v-correos-cash-deposit__success-state /deep/ .c-operation-success__main {
	padding: 0;
}

.v-correos-cash-deposit__success-resume {
	text-align: left;
	margin-top: 30px;
	margin-bottom: 30px;
	margin-left: 10px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.v-correos-cash-deposit__success-resume > * {
	margin-bottom: 20px;
}

.v-correos-cash-deposit__custom-list-item {
	display: inline-flex;
	flex-direction: column;
}

.v-correos-cash-deposit__barcodes {
	padding-top: 20px;
}

.v-correos-cash-deposit__barcodes p {
	margin-bottom: 10px;
}

.v-correos-cash-deposit__image {
	width: 260px;
	height: 140px;
	background: white;
}

.v-correos-cash-deposit__slider {
	margin-top: 40px;
	margin-bottom: 40px;
}

.v-correos-cash-deposit__buttons {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 320px;
	text-align: center;
}

.v-correos-cash-deposit__buttons /deep/ * {
	width: 100%;
}

.v-correos-cash-deposit__confirm-button {
	margin-bottom: 20px;
}
</style>
