<template>
	<l-details class="v-movement" :class="{ '--is-hefame-account': isHefame }">
		<h1 slot="printable-header" v-if="movement">
			<div class="text-xl-medium">
				{{ $t('OPERATION_RECEIPT').concat(' - ', $t('MOVEMENT.MODEL_NAME')) }}
			</div>
			<div class="text-l-light">{{ movement.accountName }}</div>
		</h1>

		<h1 slot="header" tabindex="-1">{{ $t('MOVEMENT.TITLE') }}</h1>

		<div class="v-movement__header" slot="widget">
			<transition name="placeholder" mode="out-in">
				<div v-if="loading && !movement" class="v-movement__widget-loading"></div>
				<component v-else-if="movement" :is="movementSheet" :movement="movement" v-bind="$attrs" />
			</transition>
		</div>

		<c-translide immediate>
			<div v-if="!loading && error" class="v-movement__error" data-testid="error">
				<c-icon class="v-movement__error-icon" src="@icons/modalExclamation" />

				<p class="text-m-book v-movement__error-text">
					{{ $t('MOVEMENT.DETAIL_ERROR') }}
					<a href="#" class="v-movement__error-link" @click="fetch">
						{{ $t('RETRY') }}
					</a>
				</p>
			</div>
		</c-translide>

		<c-translide>
			<div v-if="!error" class="v-movement__limit">
				<transition name="placeholder" mode="out-in">
					<c-placeholder-item v-if="loading" />

					<div v-else-if="!loading && movement">
						<component :is="movementDetail" :movement="movement" v-on="$listeners" />

						<div
							v-if="hasReceiptAvailable"
							class="v-movement__download-document media-print-hide"
							data-testid="download-document"
							@click="download"
						>
							<c-list-icon-item
								:title="
									$t('ACTIONS.DOWNLOAD_DOCUMENT').concat(' ', $t('MOVEMENT.TITLE').toLowerCase())
								"
								icon="@icons/pdf"
							/>
						</div>

						<div
							v-if="canDownloadCertificate"
							class="v-movement__download-certificate media-print-hide"
							data-testid="download-certificate"
							@click="downloadCertificate"
						>
							<c-list-icon-item
								:title="$t('ACTIONS.DOWNLOAD_TRANSFER_CERTIFICATE')"
								icon="@icons/certificate"
							/>
						</div>

						<div
							v-if="canReturnReceipt"
							class="v-movement__return-receipt media-print-hide"
							data-testid="return-receipt"
							@click="returnReceipt"
						>
							<c-list-icon-item :title="$t('ACTIONS.RETURN_RECEIPT')" icon="@icons/receipt" />
						</div>

						<div v-if="hasCommentAvailable" class="v-movement__comment" data-testid="comment">
							<label class="v-movement__comment-label text-m-medium" for="v-movement__comment">
								{{ $t('MOVEMENT.COMMENT') }}
							</label>
							<div class="v-movement__comment-wrapper">
								<c-transfer-textarea
									id="v-movement__comment"
									textarea
									rows="5"
									cols="50"
									maxlength="200"
									data-testid="comment-input"
									v-model.trim="comment"
									type="text"
									inputmode="text"
									outlined
									aria-labelledby="label-comment"
								/>
								<div class="v-movement__comment-options">
									<c-icon-button
										data-testid="options-send"
										class="v-movement__comment-send"
										icon="@icons/send"
										:disabled="lastComment === comment"
										@click="sendComment"
									/>

									<c-icon-button
										data-testid="options-delete"
										class="v-movement__comment-delete"
										icon="@icons/trash"
										:disabled="!lastComment"
										@click="deleteComment"
									/>
								</div>
							</div>
							<span
								class="v-movement__comment-maxed text-m-bold"
								v-if="maxedComment"
								data-testid="comment-invalid"
							>
								{{ $t('MOVEMENT.COMMENT_MAXED') }}
							</span>
						</div>
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
	</l-details>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import LDetails from '@layouts/l-details';
import CPlaceholderItem from '@components/c-placeholder-item';
import CTranslide from '@components/c-translide';
import CIcon from '@components/c-icon';
import CListIconItem from '@components/c-list-icon-item';
import CTransferTextarea from '@components/c-transfer-textarea';
import CIconButton from '@components/c-icon-button';
import WDownloadDocument from '@widgets/w-download-document';
import moduleProducts from '@modules/products/m-products';
import moduleResources from '@modules/resources/m-resources';
import b64toBlob from '@utils/b64toBlob';
import { subtypesById } from '@modules/products/product-subtypes';
import MReturnReceipt from '@modals/m-return-receipt';

export default {
	name: 'v-movement',

	modules: {
		products: moduleProducts,
		resources: moduleResources,
	},

	components: {
		LDetails,
		CPlaceholderItem,
		CTranslide,
		CIcon,
		CListIconItem,
		CTransferTextarea,
		CIconButton,
	},

	data() {
		return {
			movement: null,
			loading: false,
			error: false,
			comment: '',
			commentId: '',
			lastComment: '',
			maxedComment: false,
		};
	},

	props: {
		familyId: { type: String },
		productId: { type: String, required: true },
		movementId: { type: String, required: true },
		productType: { type: String },
	},

	computed: {
		...mapState('app', ['companyId']),

		isHefame({ familyId }) {
			return familyId === 'hefame-account';
		},

		isBancofar({ companyId }) {
			return companyId === 'BF';
		},

		movementSheet({ productType }) {
			/* istanbul ignore next */
			if (!productType) {
				return '';
			}

			return () => import(`@widgets/products/${productType}/w-movement-sheet-${productType}`);
		},

		movementDetail({ productType }) {
			/* istanbul ignore next */
			if (!productType) {
				return '';
			}

			return () => import(`@widgets/products/${productType}/w-movement-detail-${productType}`);
		},

		hasReceiptAvailable({ productType }) {
			/* istanbul ignore next */
			if (!productType) {
				return '';
			}

			return ['account', 'deposit'].includes(productType);
		},

		canDownloadCertificate({ movement }) {
			const amount = movement?.amount?.amount?.toString();
			const isNegative = Number(amount) < 0;
			return ['TR', 'TF', 'RQ', 'TP', 'XO'].includes(movement?.type?.id) && isNegative;
		},

		canReturnReceipt({ movement }) {
			return ['RZ', 'RB'].includes(movement?.type?.id);
		},

		hasCommentAvailable({ productType }) {
			/* istanbul ignore next */
			if (!productType) {
				return;
			}

			// Demand deposits will always use this view.
			const commentAvailable = ['account', 'card', 'deposit'];

			return commentAvailable.includes(productType);
		},
	},

	methods: {
		openNotification(text) {
			return this.$store.dispatch('notification/open', { text });
		},

		deleteComment() {
			/* istanbul ignore else */
			if (this.comment && this.commentId) {
				const { productId, movement, commentId } = this;
				const DELETE_MESSAGE = this.$t('MOVEMENT.COMMENT_DELETE');
				const ERROR_MESSAGE = this.$t('MOVEMENT.COMMENT_ERROR');

				this.$store
					.dispatch('resources/deleteComment', {
						productId,
						movementId: movement.id,
						commentId,
					})
					.then((data) => {
						this.movement = { ...this.movement, comment: { ...data } };
						this.lastComment = '';
						this.openNotification(DELETE_MESSAGE);
					})
					.catch(() => this.openNotification(ERROR_MESSAGE));
			}
		},

		sendComment() {
			const { productId, movement, comment, commentId } = this;
			const SEND_MESSAGE = this.$t('MOVEMENT.COMMENT_SEND');
			const ERROR_MESSAGE = this.$t('MOVEMENT.COMMENT_ERROR');
			const action = !commentId ? 'resources/postComment' : 'resources/putComment';

			this.$store
				.dispatch(action, {
					productId,
					movementId: movement.id,
					comment,
					commentId,
				})
				.then((data) => {
					this.movement = { ...this.movement, comment: { ...data } };
					this.lastComment = data.comment;
					this.openNotification(SEND_MESSAGE);
				})
				.catch(() => this.openNotification(ERROR_MESSAGE));
		},

		async fetch() {
			const { productId, movementId, isBancofar } = this;

			/* istanbul ignore next */
			if (!productId || !movementId) {
				return;
			}

			this.error = false;
			this.loading = true;

			const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

			const [id] = productId.split('/');
			const product = await this.$store.dispatch('products/get', id);
			const productSubtype = subtypesById[(product.productSubtype?.id)];
			const accountName = this.$tc(`MY_PRODUCT.${productSubtype.toUpperCase()}`, 1);
			const accountNumber = product?.productNumber?.value;

			wait(400).then(() =>
				this.$store
					.dispatch('resources/get', {
						resource: 'movements',
						productId,
						resourceId: movementId,
						useCache: isBancofar,
					})
					.then((movementData) => {
						if (!movementData?.id) {
							this.$router.back();
						}

						this.movement = { ...movementData, accountName, accountNumber };
						this.lastComment = movementData?.comment?.comment || '';
					})
					.catch(() => {
						this.error = true;
					})
					.finally(() => {
						this.loading = false;
					})
			);
		},

		download() {
			const channel = new MessageChannel();
			const extension = 'pdf';

			this.$store.dispatch('notification/open', {
				template: Vue.extend(WDownloadDocument),
				props: {
					channel,
					extension: extension.toUpperCase(),
					title: this.$t('INFO.MOVEMENT_DETAIL'),
				},
				timeout: 5000,
			});

			const { productId, movementId, movement } = this;

			this.$store
				.dispatch('products/getReceipt', {
					productId,
					movementId,
					query: { reference: movement.reference },
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

		downloadCertificate() {
			const channel = new MessageChannel();
			const extension = 'pdf';

			this.$store.dispatch('notification/open', {
				template: Vue.extend(WDownloadDocument),
				props: {
					channel,
					extension: extension.toUpperCase(),
					title: this.$t('INFO.TRANSFER_CERTIFICATE'),
				},
				timeout: 5000,
			});

			const { productId, movementId, movement } = this;

			this.$store
				.dispatch('products/getCertificate', {
					productId,
					movementId,
					query: { reference: movement.reference },
				})
				.then((content) => {
					const blobStore = b64toBlob(content, extension);

					channel.port1.postMessage({ name: 'downloaded', blob: blobStore, b64Data: content });
				})
				.catch(() => {
					channel.port1.postMessage({ name: 'error' });
				});
		},

		returnReceipt() {
			const { movement } = this;

			return this.$store.dispatch('modal/open', {
				component: MReturnReceipt,
				props: {
					movementId: movement?.id,
					productNumber: movement?.accountNumber,
					receiptId: movement?.movementCoreId,
				},
			});
		},
	},

	watch: {
		'movementId': {
			immediate: true,
			handler(movementId) {
				/* istanbul ignore else */
				if (movementId) {
					this.fetch();
				}
			},
		},

		'movement.comment': {
			deep: true,
			immediate: true,
			handler(comment) {
				/* istanbul ignore else */
				if (comment) {
					this.comment = comment?.comment || '';
					this.commentId = comment?.commentId || '';
				}
			},
		},

		'comment': {
			inmediate: true,
			handler(comment) {
				if (comment) {
					this.maxedComment = false;

					if (comment.length >= 200) {
						this.maxedComment = true;
					}
				}
			},
		},
	},

	created() {
		if (!this.productType) {
			this.$router.back();
		}
	},
};
</script>

<style lang="scss" scoped>
.v-movement__widget-loading {
	min-height: 100%;
}

.v-movement.--is-hefame-account /deep/ .l-details__nav .l-details__back {
	color: RGB(var(--color-primary-dark));
}

.v-movement.--is-hefame-account /deep/ .l-details__header {
	color: RGB(var(--color-primary-dark));
	background: rgb(255, 204, 0);
}

.v-movement__comment {
	display: flex;
	flex-direction: column;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	padding-top: 20px;
	margin-top: 20px;
}
.v-movement__comment-label {
	margin-bottom: 10px;
}

.v-movement__comment-wrapper {
	display: flex;
	flex-direction: row;
}

.v-movement__comment-options {
	display: flex;
	flex-direction: column;
}

.v-movement__comment-send,
.v-movement__comment-delete {
	color: RGB(var(--color-text-primary-light));
	display: flex;
	flex: 1;
	align-self: stretch;
	align-items: center;
	border-radius: 0;
}

.v-movement__comment-send {
	border-top-right-radius: $border-radius-l;
	background: RGB(var(--color-accent-icon));
	font-size: 1.8rem;
}

.v-movement__comment-delete {
	border-bottom-right-radius: $border-radius-l;
	background: RGB(var(--color-accent-error));
}

.v-movement__comment-maxed {
	color: RGB(var(--color-accent-error));
	margin-top: 10px;
}

.v-movement__header {
	margin-left: 20px;
	margin-right: 20px;
	max-width: 400px;
	flex-grow: 1;
	width: 100%;
}

.v-movement__error {
	text-align: center;
	margin: 10px 0;
}

.v-movement__limit {
	max-width: 400px;
	margin: 0 auto;
}

.v-movement__error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.v-movement__error-link {
	text-decoration: underline;
	display: block;
}

.v-movement__download-document,
.v-movement__return-receipt,
.v-movement__download-certificate {
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	padding-top: 20px;
	margin-top: 20px;
	margin-bottom: 20px;
}

@media (hover) {
	.v-movement__download-document,
	.v-movement__return-receipt,
	.v-movement__download-certificate {
		cursor: pointer;
	}
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

@media print {
	.v-movement__limit {
		max-width: none;
	}
}
</style>
