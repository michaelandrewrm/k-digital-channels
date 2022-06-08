<template>
	<section class="w-transfer-success">
		<header class="w-transfer-success__header">
			<div v-if="!subtitle" class="w-transfer-success__success-icon media-print-hide">
				<div class="w-transfer-success__icon-circle">
					<div class="w-transfer-success__icon-bg"></div>
				</div>
				<svg class="w-transfer-success__icon" width="70" height="70" viewBox="0 0 70 70">
					<polyline
						class="w-transfer-success__icon-path"
						points="26 36 34 43 47 27"
						stroke-linecap="round"
					/>
				</svg>
			</div>

			<div v-else class="w-transfer-success__jointly-icon media-print-hide">
				<c-icon
					class="w-transfer-success__icon-intervener"
					src="@icons/interveners"
					size="inherit"
				/>
			</div>

			<h1 tabindex="-1" class="text-xl-bold w-transfer-success__title media-print-hide">
				{{ title }}
			</h1>

			<h1 tabindex="-1" class="text-xl-bold w-transfer-success__subtitle media-print-hide">
				{{ subtitle }}
			</h1>

			<h1 tabindex="-1" class="media-screen-hide" aria-hidden="true">
				<div class="text-xl-medium">
					{{ $t('OPERATION_RECEIPT').concat(' - ', $t('TRANSFERS.MODEL_NAME')) }}
				</div>
				<div class="text-l-light">{{ model.orderer.fromAccount.alias }}</div>
			</h1>
			<h1
				class="media-screen-hide text-m-medium w-transfer-success__subtitle"
				tabindex="-1"
				aria-hidden="true"
			>
				{{ $t('TRANSFERS.DETAIL_TITLE') }}
			</h1>
		</header>

		<div class="w-transfer-success__scrolling">
			<c-translide appear>
				<section class="w-transfer-success__main" v-if="model">
					<c-list-icon-item :title="$t('TRANSFERS.ORIGIN_ACCOUNT')" icon="@icons/paper">
						<div>
							<p class="media-print-hide">{{ model.orderer.fromAccount.alias }}</p>
							<p class="media-screen-hide" aria-hidden="true">
								{{ model.orderer.fromAccount.productNumber.value }}
							</p>
							<p class="media-print-hide">{{ $pn(model.orderer.fromAccount.productNumber) }}</p>
						</div>
					</c-list-icon-item>

					<c-list-icon-item :title="$t('TRANSFERS.DESTINATION_ACCOUNT')" icon="@icons/paper">
						<div>
							<p class="media-print-hide">{{ model.beneficiary.description }}</p>
							<p>{{ model.beneficiary.toAccount.productNumber.value }}</p>
						</div>
					</c-list-icon-item>

					<c-list-icon-item
						class="media-screen-hide"
						:title="$t('DETAIL.BENEFICIARY')"
						:description="model.beneficiary.description"
					/>

					<c-list-icon-item
						:title="$t('TRANSFERS.AMOUNT')"
						:description="$nc(model.amount)"
						icon="@icons/valueAccountUnit"
					/>

					<c-list-icon-item
						:title="$t('DETAIL.TRANSFER_DATE')"
						:description="$d(new Date(model.date), 'numeric')"
						icon="@icons/calendar"
					/>

					<c-list-icon-item
						:title="$t('TRANSFERS.REASON')"
						:description="model.reason"
						icon="@icons/paper"
					/>
				</section>
			</c-translide>

			<c-translide appear>
				<section class="w-transfer-success__fees --border-top media-print-hide" v-if="model.fees">
					<div class="w-transfer-success__info-card --one-column">
						<p class="text-m-medium">
							{{ $t('TRANSFERS.OPERATION_FEES_TITLE').concat(': ') }}
							{{ $t(`TRANSFERS.FEES_DESC.${model.chargeBearer}`) }}
						</p>
						<br />
						<div class="w-transfer-success__row text-m-medium" v-if="model.fees && model.fees.fee">
							<div class="w-transfer-success__row-title">
								{{ $t('TRANSFERS.FEES').concat(':') }}
							</div>
							<div class="w-transfer-success__row-separator" />
							<div class="w-transfer-success__row-amount">
								{{ $nc(model.fees.fee) }}
							</div>
						</div>
						<br />
						<div
							class="w-transfer-success__row text-m-medium"
							v-if="model.fees && model.fees.expense"
						>
							<div class="w-transfer-success__row-title">
								{{ $t('TRANSFERS.EXPENSES').concat(':') }}
							</div>
							<div class="w-transfer-success__row-separator" />
							<div class="w-transfer-success__row-amount">
								{{ $nc(model.fees.expense) }}
							</div>
						</div>
					</div>
				</section>
			</c-translide>

			<c-translide appear>
				<div
					v-if="model && model.periodicity === 'today' && action !== 'cancel'"
					class="w-transfer-success__download-document media-print-hide"
					data-testid="download-document"
					@click="download"
				>
					<c-list-icon-item
						:title="
							$t('ACTIONS.DOWNLOAD_DOCUMENT').concat(' ', $t('OPERATION_RECEIPT').toLowerCase())
						"
						icon="@icons/pdf"
					/>
				</div>
			</c-translide>
		</div>

		<div class="w-transfer-success___snackbar">
			<slot name="snackbar" />
		</div>

		<footer class="w-transfer-success__footer media-print-hide">
			<div class="w-transfer-success__footer-wrapper">
				<c-button
					data-testid="accept"
					raised
					@click="$emit('confirm')"
					class="w-transfer-success__button"
				>
					{{ $t('ACTIONS.ACCEPT') }}
				</c-button>

				<router-link
					:to="{ name: 'home', replace: true }"
					class="text-m-medium w-transfer-success__link"
				>
					{{ $t('ACTIONS.GO_TO_VIEW', { view: $t('GLOBAL_POSITION') }) }}
				</router-link>
			</div>
		</footer>
	</section>
</template>

<script>
import Vue from 'vue';
import CListIconItem from '@components/c-list-icon-item';
import CButton from '@components/c-button';
import CTranslide from '@components/c-translide';
import CIcon from '@components/c-icon';
import WDownloadDocument from '@widgets/w-download-document';
import b64toBlob from '@utils/b64toBlob';

export default {
	name: 'w-transfer-success',

	components: {
		CListIconItem,
		CButton,
		CTranslide,
		CIcon,
	},

	props: {
		model: { type: Object },
		title: { type: String },
		subtitle: { type: String },
		action: { type: String },
	},

	methods: {
		download() {
			const channel = new MessageChannel();
			const extension = 'pdf';

			this.$store.dispatch('notification/open', {
				template: Vue.extend(WDownloadDocument),
				props: {
					channel,
					extension: extension.toUpperCase(),
					title: this.$t('TRANSFERS.DETAIL_TITLE'),
				},
				timeout: 5000,
			});

			this.$store
				.dispatch('move-money/getReceipt', {
					reference: this.model.reference,
					transferMode: this.model.transferMode,
					reportType: extension,
				})
				.then((content) => {
					const blobStore = b64toBlob(content, extension);

					channel.port1.postMessage({ name: 'downloaded', blob: blobStore, b64Data: content });
				})
				.catch(() => {
					channel.port1.postMessage({ name: 'error' });
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.w-transfer-success {
	background-color: RGB(var(--color-surface-light));
	color: RGB(var(--color-text-primary));
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: hidden;
	height: 100%;
}

.w-transfer-success__header {
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	max-width: 320px;
	padding: 30px 0;
	text-align: center;
	border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.w-transfer-success__title {
	padding: 0 32px;
	animation: fadeIn 1000ms ease;
}

@keyframes fadeIn {
	0% {
		opacity: 0;
		transform: translateY(-5px);
	}
	20% {
		opacity: 0;
		transform: translateY(-5px);
	}
}

.w-transfer-success__success-icon,
.w-transfer-success__jointly-icon {
	margin-bottom: 30px;
	position: relative;
	display: flex;
	flex-shrink: 0;
	width: 70px;
	height: 70px;
}

.w-transfer-success__icon-circle {
	position: absolute;
	width: 70px;
	height: 70px;
	border-radius: 50%;
	background: RGB(var(--color-accent-secondary));
	animation: expand 1s cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

.w-transfer-success__icon-bg {
	position: absolute;
	top: 4px;
	left: 4px;
	width: 62px;
	height: 62px;
	border-radius: 50%;
	background: RGB(var(--color-surface-light));
	animation: expand 1s 200ms cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

@keyframes expand {
	from {
		transform: scale(0);
	}
}

.w-transfer-success__icon {
	position: absolute;
	width: 100px;
	height: 100px;
	top: -16px;
	left: -16px;
	transform-origin: center;
	animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0.7s 1 both scaleCheck;
}

.w-transfer-success__jointly-icon /deep/ .c-icon {
	top: 30px;
	color: RGB(var(--color-secondary));
	position: absolute;
	width: 64px;
	height: 55px;
}

.w-transfer-success__icon-path {
	fill: transparent;
	stroke-width: 4;
	stroke-dasharray: 36px 36px;
	stroke-dashoffset: 36px;
	stroke-linecap: butt;
	stroke: RGB(var(--color-accent-secondary));
	animation: 1s cubic-bezier(0.77, 0, 0.175, 1) 0.7s 1 both drawCheck;
}

@keyframes scaleCheck {
	0% {
		opacity: 0;
	}
	1% {
		opacity: 1;
	}
	100% {
		transform: scale(1);
	}
}

@keyframes drawCheck {
	to {
		stroke-dashoffset: 0;
	}
}

.w-transfer-success__scrolling {
	width: 100%;
	overflow-x: hidden;
	overflow-y: overlay;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-grow: 1;
	flex-shrink: 1;
}

.w-transfer-success__main {
	max-width: 320px;
	padding: 30px 20px 0;
	width: 100%;
}

.w-transfer-success__main > *:not(:last-child) {
	margin-bottom: 15px;
}

.w-transfer-success__fees {
	max-width: 320px;
	margin-top: 30px;
	flex-shrink: 0;
	width: 100%;
}

.w-transfer-success__fees:last-child {
	padding-bottom: 20px;
}

.w-transfer-success__fees.--border-top {
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	padding-top: 18px;
}

.w-transfer-success__footer {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	flex-shrink: 0;
	background: RGB(var(--color-surface-light));
	box-shadow: 0px -6px 20px -20px black;
	border-top-left-radius: $border-radius-xl;
	border-top-right-radius: $border-radius-xl;
	will-change: transform;
	transition: transform 300ms ease-in-out;
}

.w-transfer-success__footer-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	max-width: 320px;
	padding: 30px 0;
	text-align: center;
}

.w-transfer-success__button {
	width: 280px;
}

.w-transfer-success__link {
	margin-top: 30px;
}

.w-transfer-success__info-card {
	display: grid;
	position: relative;
	border-radius: 3px;
	color: RGB(var(--color-text-primary));
	grid-template-columns: minmax(0, 1fr) 1fr fit-content(100px);
	grid-template-rows: auto;
	align-items: center;
}

.w-transfer-success__info-card.--one-column {
	grid-template-columns: 1fr fit-content(100px);
}

.w-transfer-success__info-icon {
	grid-column-end: -1;
}

.w-transfer-success__row {
	display: grid;
	position: relative;
	max-width: 320px;
	color: RGB(var(--color-text-primary));
	grid-template-columns: min-content 1fr min-content;
	align-items: center;
	margin-top: 10px;
}

.w-transfer-success__row.--two-columns {
	grid-template-columns: min-content 1fr;
	margin-bottom: 20px;
}

.w-transfer-success__row-separator {
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
	margin: 10px;
}

.w-transfer-success__download-document {
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
	padding-top: 20px;
	padding-bottom: 20px;
	margin-top: 20px;
	margin-bottom: 20px;
	max-width: 320px;
	width: 100%;
}

@media (hover) {
	.w-transfer-success__download-document {
		cursor: pointer;
	}
}

@media print {
	.w-transfer-success__header {
		max-width: none;
		padding: 52px 0 0;
		margin: 0;
		display: block;
		text-align: left;
		width: 100%;
		border: 0;
	}

	.w-transfer-success__subtitle {
		background: RGB(var(--color-surface));
		-webkit-print-color-adjust: exact;
		padding: 6px 10px 6px 30px;
		margin: 20px 0;
	}

	.w-transfer-success__fees,
	.w-transfer-success__main {
		max-width: none;
		padding: 0;
		margin: 0;
		display: block;
		text-align: left;
		width: 100%;
		border: 0;
	}
}

.w-transfer-success___snackbar {
	display: block;
	width: 100%;
	padding: 10px;
	text-decoration: none;
}
</style>
