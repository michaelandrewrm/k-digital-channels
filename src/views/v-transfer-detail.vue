<template>
	<l-page>
		<h1 slot="printable-header" v-if="source">
			<div class="text-xl-medium">
				{{ $t('OPERATION_RECEIPT').concat(' - ', $t('TRANSFERS.MODEL_NAME')) }}
			</div>
			<div class="text-l-light">{{ source.orderer.fromAccount.alias }}</div>
		</h1>
		<h1 slot="header" tabindex="-1" data-testid="header-title">
			{{ $t('TRANSFERS.DETAIL_TITLE') }}
		</h1>

		<div class="v-transfer-detail__header" slot="widget">
			<c-translide>
				<c-acrylic-sheet :dotted="true" v-if="source">
					<c-icon src="@icons/productReceipt" size="" slot="icon" />

					<span class="text-m-medium" v-if="source.reason">
						{{ source.reason }}
					</span>

					<span class="text-l-bold v-transfer-detail__amount" v-if="source.amount">
						{{ $nc(source.amount) }}
					</span>

					<div class="text-s-book v-transfer-detail__origin" v-if="source.orderer">
						<div v-if="source.orderer.fromAccount.alias">
							{{ source.orderer.fromAccount.alias }}
						</div>
						<div v-if="source.orderer.fromAccount.productNumber">
							{{ $pn(source.orderer.fromAccount.productNumber) }}
						</div>
					</div>
				</c-acrylic-sheet>
			</c-translide>
		</div>

		<c-translide>
			<div v-if="loading || source || error">
				<transition name="placeholder" mode="out-in">
					<c-placeholder-item v-if="loading" key="placeholder" data-testid="loading" />

					<div v-else-if="source" key="source">
						<div class="v-transfer-detail__group" data-testid="data">
							<c-list-icon-item
								v-if="source.orderer"
								:title="$t('TRANSFERS.ORIGIN_ACCOUNT')"
								icon="@icons/paper"
							>
								<div>
									<p class="media-screen-hide" aria-hidden="true">
										{{ source.orderer.fromAccount.productNumber.value }}
									</p>
									<p class="media-print-hide">
										{{ $pn(source.orderer.fromAccount.productNumber) }}
									</p>
								</div>
							</c-list-icon-item>

							<c-list-icon-item
								v-if="source.beneficiary"
								:title="$t('TRANSFERS.DESTINATION_ACCOUNT')"
								icon="@icons/paper"
							>
								<p class="media-screen-hide" aria-hidden="true">
									{{ source.beneficiary.toAccount.productNumber.value }}
								</p>
								<p class="media-print-hide">
									{{ $pn(source.beneficiary.toAccount.productNumber) }}
								</p>
							</c-list-icon-item>

							<c-list-icon-item
								v-if="source.beneficiary && source.beneficiary.description"
								:title="$t('DETAIL.BENEFICIARY')"
								:description="source.beneficiary.description"
								icon="@icons/intervener"
							/>

							<c-list-icon-item
								v-if="source.amount"
								:title="$t('TRANSFERS.AMOUNT')"
								:description="$nc(source.amount)"
								icon="@icons/valueAccountUnit"
							/>

							<c-list-icon-item
								v-if="source.date"
								:title="$t('DETAIL.TRANSFER_DATE')"
								:description="$d(new Date(source.date), 'numeric')"
								icon="@icons/calendar"
							/>

							<c-list-icon-item
								v-if="source.operationDate"
								:title="$t('DETAIL.EXECUTION_DATE')"
								:description="$d(new Date(source.operationDate), 'numeric')"
								icon="@icons/calendarTime"
							/>

							<c-list-icon-item
								v-if="source.nextExecutionDate"
								:title="$t('DETAIL.EXECUTION_DATE')"
								:description="$d(new Date(source.nextExecutionDate), 'numeric')"
								icon="@icons/calendarTime"
							/>

							<c-list-icon-item
								v-if="source.periodicity && source.endExecutionDate"
								:title="$t('DETAIL.END_DATE')"
								:description="$d(new Date(source.endExecutionDate), 'numeric')"
								icon="@icons/calendarForward"
							/>

							<c-list-icon-item
								v-if="source.periodicity && source.periodicity.frequency"
								:title="$t('TRANSFERS.FREQUENCY')"
								:description="getFrequencyLabel(source.periodicity.frequency)"
								data-testid="frequency-label"
								icon="@icons/renewal"
							/>

							<c-list-icon-item
								v-if="source.reason && source.reason.trim()"
								:title="$t('TRANSFERS.REASON')"
								:description="source.reason"
								icon="@icons/paper"
							/>

							<div
								v-if="type === 'ordered' || type === 'scheduled'"
								class="v-transfer-detail__download-document media-print-hide"
								data-testid="download-document"
								@click="download"
							>
								<c-list-icon-item
									:title="
										$t('ACTIONS.DOWNLOAD_DOCUMENT').concat(
											' ',
											$t('OPERATION_RECEIPT').toLowerCase()
										)
									"
									icon="@icons/document"
								/>
							</div>
						</div>
					</div>

					<div v-else-if="error" class="v-transfer-detail__error" data-testid="error" key="error">
						<c-icon class="v-transfer-detail__error-icon" src="@icons/modalExclamation" />

						<p class="text-m-book v-transfer-detail__error-text">
							{{ $t('RESOURCE.TRANSFER_DETAIL.ERROR') }}
							<a href="#" class="v-transfer-detail__error-link" @click.prevent="fetch">
								{{ $t('RETRY') }}
							</a>
						</p>
					</div>
				</transition>

				<transition name="placeholder">
					<c-placeholder-item v-if="loading" />
				</transition>

				<transition name="placeholder">
					<c-placeholder-item v-if="loading" />
				</transition>
			</div>
		</c-translide>

		<div
			class="v-transfer-detail__buttons"
			v-if="source && enableActions && transferOptions.length"
			slot="buttons"
			ref="buttons"
		>
			<w-actions :options="transferOptions" />
		</div>
	</l-page>
</template>

<script>
import Vue from 'vue';
import LPage from '@layouts/l-page';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';
import CPlaceholderItem from '@components/c-placeholder-item';
import CTranslide from '@components/c-translide';
import CListIconItem from '@components/c-list-icon-item';
import moveMoneyModule from '@modules/move-money/m-move-money';
import frequencyTypes from '@modules/move-money/frequency-types';
import WActions from '@widgets/w-actions';
import iconTrash from '@icons/trash';
import iconRepeat from '@icons/repeat';
import MConfirmFavoriteDeletion from '@modals/m-confirm-favorite-deletion';
import WDownloadDocument from '@widgets/w-download-document';
import b64toBlob from '@utils/b64toBlob';

const STATUS_ENABLED = '01';

export default {
	name: 'v-transfer-detail',

	modules: { 'move-money': moveMoneyModule },

	components: {
		WActions,
		CAcrylicSheet,
		CIcon,
		LPage,
		CPlaceholderItem,
		CTranslide,
		CListIconItem,
	},

	props: {
		type: String,
		transferId: String,
		productId: String,
	},

	data() {
		return {
			source: null,
			loading: false,
			timerLoading: null,
			timerRefresh: null,
			error: false,
			enableActions: false,
		};
	},

	computed: {
		transferOptions({ type, source }) {
			const invalidIban = 'ES0000000000000000000000';
			const isEligible =
				source?.amount?.currency?.id === 'EUR' &&
				source?.beneficiary?.toAccount?.productNumber?.format?.id !== 'UNKNOWN' &&
				source?.beneficiary?.toAccount?.productNumber?.value !== invalidIban;

			if (type === 'ordered') {
				return [
					isEligible && {
						id: 'repeat-transfer',
						icon: iconRepeat,
						title: this.$t('ACTIONS.REPEAT_TRANSFER'),
						action: this.actionRepeatTransfer,
					},
				].filter(Boolean);
			}

			if (type === 'scheduled') {
				return [
					{
						id: 'cancel-transfer',
						icon: iconTrash,
						title: this.$t('ACTIONS.CANCEL_TRANSFER'),
						action: this.actionCancelTransfer,
					},
				];
			}

			/* istanbul ignore else */
			if (type === 'favorite') {
				return [
					isEligible && {
						id: 'repeat-transfer',
						icon: iconRepeat,
						title: this.$t('ACTIONS.REPEAT_TRANSFER'),
						action: this.actionRepeatTransfer,
					},
					{
						id: 'delete-transfer',
						icon: iconTrash,
						title: this.$t('ACTIONS.DELETE_TRANSFER'),
						action: this.actionDeleteTransfer,
					},
				].filter(Boolean);
			}

			return [];
		},
	},

	watch: {
		type: {
			immediate: true,
			handler() {
				const { transferId, type, loading } = this;

				/* istanbul ignore else */
				if (transferId && type && !loading) {
					clearTimeout(this.timerRefresh);
					this.timerRefresh = setTimeout(this.fetch, 50);
				}
			},
		},

		transferId: {
			immediate: true,
			handler() {
				const { transferId, type, loading } = this;

				/* istanbul ignore else */
				if (transferId && type && !loading) {
					clearTimeout(this.timerRefresh);
					this.timerRefresh = setTimeout(this.fetch, 50);
				}
			},
		},
	},

	methods: {
		actionModifyTransfer() {
			const { transferId, type } = this;
			return this.$router.push({
				name: 'transfer',
				params: { action: 'modify', type, transferId },
			});
		},

		actionCancelTransfer() {
			const { transferId, type } = this;
			return this.$router.push({
				name: 'transfer',
				params: { action: 'cancel', type, transferId },
			});
		},

		actionRepeatTransfer() {
			const { transferId, type, productId } = this;
			return this.$router.push({
				name: 'transfer',
				params: { action: 'repeat', type, transferId, productId },
			});
		},

		async actionDeleteTransfer() {
			const {
				source,
				$store: { dispatch },
			} = this;
			const response = await dispatch('modal/open', MConfirmFavoriteDeletion);
			/* istanbul ignore else */
			if (response) {
				dispatch('move-money/deleteTransfer', { type: 'favorite', transferId: source.id })
					.then(async () => {
						this.$router.back();
						await dispatch('notification/open', {
							text: this.$t('INFO.FAVORITE.DELETION.SUCCESS'),
						});
					})
					.catch(async () => {
						await dispatch('notification/open', {
							text: this.$t('INFO.FAVORITE.DELETION.ERROR'),
						});
					});
			}
		},

		getFrequencyLabel(frequency) {
			return this.$t(`TRANSFERS.FREQUENCY.${frequencyTypes[frequency]?.name}`);
		},

		fetch() {
			const { type, transferId, productId } = this;

			/* istanbul ignore next */
			if (!transferId || !type) {
				return;
			}

			this.error = false;

			clearTimeout(this.timerLoading);
			this.timerLoading = setTimeout(() => {
				this.timerLoading = null;
				this.loading = true;
			}, 200);

			this.$store
				.dispatch('move-money/getTransfer', { type, transferId, productId })
				.then((source) => {
					if (!source) {
						return this.$router.back();
					}

					this.source = source;

					return this.$store.dispatch('move-money/getOrigins', { type: 'transferList' });
				})
				.then((products) => {
					const getParentById = ({ id }) => id === this.source.orderer.fromAccount.id;
					const parentProduct = products.find(getParentById);

					this.enableActions = parentProduct.status.id === STATUS_ENABLED;
				})
				.catch(() => {
					this.error = true;
				})
				.finally(() => {
					clearTimeout(this.timerLoading);
					this.timerLoading = null;
					this.loading = false;
				});
		},

		download() {
			const channel = new window.MessageChannel();
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
					reference: this.source.reference || this.source.id,
					transferMode: this.source.transferMode.id,
					reportType: extension,
					isPeriodic: this.type === 'scheduled',
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
.v-transfer-detail__header {
	margin-left: 20px;
	margin-right: 20px;
	max-width: 400px;
	flex-grow: 1;
	width: 100%;
}

.v-transfer-detail__error {
	text-align: center;
	margin: 10px 0;
}

.v-transfer-detail__error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.v-transfer-detail__error-link {
	text-decoration: underline;
	display: block;
}

.v-transfer-detail__group {
	max-width: 400px;
	margin-left: auto;
	margin-right: auto;
}

.v-transfer-detail__group:empty {
	display: none;
}

.v-transfer-detail__group > *:not(:last-child) {
	margin-bottom: 18px;
}

.v-transfer-detail__amount {
	margin-top: 10px;
}

.v-transfer-detail__origin {
	margin-top: 10px;
	line-height: 2;
}

.placeholder-enter {
	opacity: 0;
	transform: translateY(-5px);
}

.placeholder-leave-active {
	opacity: 0;
	transform: translateY(40%);
}

.placeholder-enter-active {
	transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
}

.placeholder-leave-active {
	transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
	transition-delay: 400ms;
}

.placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 200ms;
}

.placeholder-leave-active ~ .placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 0ms;
}

.v-transfer-detail__download-document {
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
	padding-top: 20px;
	padding-bottom: 20px;
	margin-top: 20px;
	margin-bottom: 20px;
}

@media (hover) {
	.v-transfer-detail__download-document {
		cursor: pointer;
	}
}

@media print {
	.v-transfer-detail__group {
		max-width: none;
		width: 100vw;
	}
}
</style>
