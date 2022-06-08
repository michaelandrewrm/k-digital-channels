<template>
	<l-details>
		<h1 slot="header" tabindex="-1" ref="title">
			{{ $t('CORREOS_CASH.TITLE') }}
		</h1>

		<div class="v-correos-cash-detail__header" slot="widget">
			<c-translide>
				<c-acrylic-sheet :dotted="true" v-if="source" data-testid="sheet">
					<c-icon src="@icons/productReceipt" size="" slot="icon" />

					<span class="text-m-book" v-if="source.beneficiary && source.beneficiary.productNumber">
						{{ $pn({ value: source.beneficiary.productNumber, format: { id: 'IBAN' } }) }}
					</span>

					<span v-if="source.totalAmount" class="v-correos-cash-detail__value text-l-bold">
						{{ $nc({ amount: source.totalAmount, currency: { id: 'EUR' } }) }}
					</span>
				</c-acrylic-sheet>
			</c-translide>
		</div>

		<div class="v-correos-cash-detail__limit">
			<c-translide>
				<section v-if="source">
					<c-list-icon-item
						class="v-correos-cash-detail__item"
						v-if="source.operationDate"
						:title="$t('DETAIL.OPERATION_DATE')"
						:description="$d(new Date(source.operationDate), 'numeric')"
						icon="@icons/calendar"
					/>

					<c-list-icon-item
						class="v-correos-cash-detail__item"
						v-if="source.beneficiary"
						:title="$t('DETAIL.DESTINATION_ACCOUNT')"
						:description="$pn({ value: source.beneficiary.productNumber, format: { id: 'IBAN' } })"
						icon="@icons/paper"
					/>

					<c-list-icon-item
						class="v-correos-cash-detail__item"
						v-if="source.totalAmount"
						:title="$t('DETAIL.TOTAL_AMOUNT')"
						:description="$nc({ amount: source.totalAmount, currency: { id: 'EUR' } })"
						icon="@icons/valueAccountUnit"
					/>

					<div class="v-correos-cash-detail__barcodes v-correos-cash-detail__item">
						<div class="v-correos-cash-detail__barcodes-header">
							<p
								v-if="source.details && source.details.length"
								class="v-correos-cash-detail__barcodes-title text-m-medium"
							>
								{{
									$t('DETAIL.CORREOS_CASH.CODE', {
										index: selected + 1,
										quantity: source.details.length,
									})
								}}
							</p>

							<span
								data-testid="info-modal"
								class="v-correos-cash-detail__barcodes-info"
								@click="openBarcodeInfo"
							>
								<c-icon src="@icons/info" class="text-l-medium" />
							</span>
						</div>

						<c-slider
							v-if="barcodes.length"
							data-testid="slider"
							class="v-correos-cash-detail__slider"
							:selected="selected"
							@change="changeQR($event)"
						>
							<img
								v-for="(code, i) in barcodes"
								:key="code.id"
								:id="code.id"
								class="v-correos-cash-detail__image v-correos-cash-detail__barcodes-info"
								:src="code.base64Image"
								@click="openQRCode(i)"
							/>
						</c-slider>

						<p class="text-s-book v-correos-cash-detail__qr_note">
							{{ $t('CORREOS_CASH.QR_INFO_ZOOM') }}
						</p>
					</div>

					<c-list-icon-item
						class="v-correos-cash-detail__item"
						v-if="source.details[selected].amount"
						:title="$t('DETAIL.CODE_AMOUNT')"
						:description="$nc({ amount: source.details[selected].amount, currency: { id: 'EUR' } })"
						icon="@icons/valueAccountUnit"
					/>
				</section>
			</c-translide>
		</div>

		<w-actions
			v-if="actionOptions && actionOptions.length"
			:options="actionOptions"
			slot="buttons"
		/>
	</l-details>
</template>

<script>
import Vue from 'vue';
import LDetails from '@layouts/l-details';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';
import CTranslide from '@components/c-translide';
import CListIconItem from '@components/c-list-icon-item';
import CSlider from '@components/c-slider';
import correosCashModule from '@modules/correos-cash/m-correos-cash';
import WActions from '@widgets/w-actions';
import WCorreosCashDownload from '@widgets/w-correos-cash-download';
import WCorreosCashShare from '@widgets/w-correos-cash-share';
import MCorreosCashCodes from '@modals/m-correos-cash-codes';

import iconShare from '@icons/share';
import iconDownload from '@icons/download';
import iconCorreos from '@icons/correos';

export default {
	name: 'v-correos-cash-detail',

	modules: { 'correos-cash': correosCashModule },

	components: {
		LDetails,
		CAcrylicSheet,
		CIcon,
		CTranslide,
		CListIconItem,
		CSlider,
		WActions,
	},

	props: {
		depositId: { type: String, required: true },
		qrId: { type: [Number, String] },
	},

	data() {
		return {
			source: null,
			barcodes: [],
			notifications: {
				downloaded: [],
				shared: [],
			},
			canShare: typeof window.navigator.share === 'function',
			isHybrid: navigator.userAgent.includes('Skybrid'),
		};
	},

	computed: {
		selected({ qrId }) {
			return parseInt(qrId || 0, 10);
		},

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
			].filter(Boolean);
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
					timeout: Infinity,
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

		openBarcodeInfo() {
			return this.$store.dispatch('modal/open', MCorreosCashCodes);
		},

		openQRCode(id) {
			return this.$router.push({
				name: 'correos-cash-qr',
				params: {
					depositId: this.depositId,
					qrId: id,
				},
			});
		},

		changeQR(id) {
			if (+id !== +this.qrId) {
				return this.$router.replace({
					name: 'correos-cash-detail',
					params: { depositId: this.depositId, qrId: id },
				});
			}
		},
	},

	watch: {
		depositId: {
			immediate: true,
			async handler(depositId) {
				/* istanbul ignore else */
				if (depositId) {
					const { dispatch } = this.$store;
					const deposit = await dispatch('correos-cash/get', { depositId });

					if (!deposit?.id) {
						return this.$router.back();
					}

					this.source = deposit;
					this.barcodes = await dispatch('correos-cash/getQRCodesFromDeposit', { depositId });
				}
			},
		},
	},

	/* istanbul ignore next */
	beforeDestroy() {
		this.$store.dispatch('notification/closeAll');
	},
};
</script>

<style lang="scss" scoped>
.v-correos-cash-detail__header {
	margin-left: 20px;
	margin-right: 20px;
	max-width: 400px;
	flex-grow: 1;
	width: 100%;
}

.v-correos-cash-detail__limit {
	max-width: 400px;
	margin: 0 auto;
}

.v-correos-cash-detail__item {
	margin-bottom: 20px;
}

.v-correos-cash-detail__value {
	margin: 15px 0;
}

.v-correos-cash-detail__barcodes {
	margin-top: 30px;
	border-top: 1px solid rgba(0, 0, 0, 0.15);
	border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.v-correos-cash-detail__barcodes-header {
	display: inline-flex;
	margin-top: 30px;
}

.v-correos-cash-detail__barcodes-title {
	margin-right: 20px;
}

.v-correos-cash-detail__barcodes-info {
	@media (hover) {
		cursor: pointer;
	}
}

.v-correos-cash-detail__image {
	width: 320px;
	height: 180px;
	background: white;
}

.v-correos-cash-detail__slider {
	margin-top: 40px;
	margin-bottom: 20px;
}

.v-correos-cash-detail__qr_note {
	text-align: center;
	margin: 20px 0;
}
</style>
