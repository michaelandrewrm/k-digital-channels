<template>
	<l-page>
		<h1 slot="header" tabindex="-1">{{ $t('DETAIL.SIGNATURE') }}</h1>

		<c-operation-success v-if="success" slot="state" data-testid="operation-success">
			<template v-slot:title>
				{{ $t(`DETAIL.SIGNATURE.${action}.SUCCESS`) }}
			</template>

			<c-translide appear>
				<section class="v-signature-detail__main">
					<c-list-icon-item
						v-if="source.origin"
						:title="$t('DETAIL.ORIGIN')"
						:description="$pn({ value: source.origin, format: { id: 'UNKNOWN' } })"
						icon="@icons/paper"
					/>

					<c-list-icon-item
						v-if="source.ecommerceName"
						:title="$t('ECOMMERCE')"
						:description="source.ecommerceName.concat(' - ', source.ecommerceId)"
						icon="@icons/ecommerce"
					/>

					<c-list-icon-item
						v-if="source.destination"
						:title="$t('DETAIL.DESTINATION')"
						:description="$pn({ value: source.destination, format: { id: 'UNKNOWN' } })"
						icon="@icons/paper"
					/>

					<c-list-icon-item
						v-if="source.balance"
						:title="$t('DETAIL.AMOUNT')"
						:description="$nc(source.balance)"
						icon="@icons/valueAccountUnit"
					/>

					<c-list-icon-item
						v-if="source.ecommerceId"
						:title="$t('TRANSFERS.ADMINISTRATION_FEES')"
						:description="$nc({ amount: 0, currency: source.balance.currency })"
						icon="@icons/valueAccountUnit"
					/>

					<c-list-icon-item
						v-if="source.signatureDate && source.status === 'signed'"
						:title="$t('DETAIL.EXECUTION_DATE')"
						:description="$d(new Date(source.signatureDate), 'numeric')"
						icon="@icons/calendarTime"
					/>

					<c-list-icon-item
						v-if="source"
						:title="$t('DETAIL.REASON')"
						:description="description"
						icon="@icons/paper"
					/>
				</section>
			</c-translide>
			<c-button raised slot="buttons" data-testid="accept" @click="$router.go(-1)">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</c-operation-success>

		<c-operation-error
			v-if="error"
			contact-us
			slot="state"
			data-testid="operation-error"
			@confirm="$router.go(-1)"
		>
			<template v-slot:title>
				{{ $t('DETAIL.SIGNATURE.ERROR.TITLE') }}
			</template>

			<p class="text-m-book">{{ errorDesc }}</p>
		</c-operation-error>

		<div class="v-signature-detail__header" slot="widget">
			<c-translide>
				<c-acrylic-sheet v-if="source" :dotted="true">
					<c-icon src="@icons/productReceipt" size="" slot="icon" />

					<span v-if="source.operationDescription" class="text-m-medium v-signature-detail__reason">
						{{ source.operationDescription }}
					</span>

					<span v-if="source.balance" class="text-l-bold v-signature-detail__amount">
						{{ $nc(source.balance) }}
					</span>

					<span class="text-s-book v-signature-detail__status">
						{{ signatureStatus }}
					</span>
				</c-acrylic-sheet>
			</c-translide>
		</div>

		<c-translide>
			<div v-if="source" class="v-signature-detail__source">
				<div class="v-signature-detail__group" key="source">
					<c-list-icon-item
						v-if="source.ecommerceId"
						:title="$t('ECOMMERCE')"
						:description="source.ecommerceName.concat(' - ', source.ecommerceId)"
						icon="@icons/ecommerce"
					/>

					<c-list-icon-item
						v-if="source.ecommerceId"
						:title="$t('TRANSFERS.ORIGIN_ACCOUNT')"
						:description="$pn({ value: source.iban, format: { id: 'IBAN' } })"
						icon="@icons/paper"
					/>

					<c-list-icon-item
						v-if="source.creationDate"
						:title="$t('DETAIL.ORDER_DATE')"
						:description="$d(new Date(source.creationDate), 'numeric')"
						icon="@icons/calendar"
					/>

					<c-list-icon-item
						v-if="source.signatureDate && source.status === 'signed'"
						:title="$t('DETAIL.EXECUTION_DATE')"
						:description="$d(new Date(source.signatureDate), 'numeric')"
						icon="@icons/calendarTime"
					/>

					<c-list-icon-item
						v-if="source.balance"
						:title="$t('DETAIL.AMOUNT')"
						:description="$nc(source.balance)"
						icon="@icons/valueAccountUnit"
					/>

					<c-list-icon-item
						v-if="source.ecommerceId"
						:title="$t('TRANSFERS.ADMINISTRATION_FEES')"
						:description="$nc({ amount: 0, currency: source.balance.currency })"
						icon="@icons/valueAccountUnit"
					/>

					<c-list-icon-item
						v-if="source && description"
						:title="$t('DETAIL.REASON')"
						:description="description"
						icon="@icons/paper"
					/>

					<c-list-icon-item
						v-if="source.origin"
						:title="$t('DETAIL.ORIGIN')"
						:description="$pn({ value: source.origin, format: { id: 'UNKNOWN' } })"
						icon="@icons/paper"
					/>

					<c-list-icon-item
						v-if="source.destination"
						:title="$t('DETAIL.DESTINATION')"
						:description="$pn({ value: source.destination, format: { id: 'UNKNOWN' } })"
						icon="@icons/paper"
					/>
				</div>
			</div>
		</c-translide>

		<div
			class="v-signature-detail__buttons"
			v-if="!success && !error && enableActions"
			slot="buttons"
			ref="buttons"
			data-testid="action-buttons"
		>
			<w-actions :options="actionOptions" />
		</div>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CTranslide from '@components/c-translide';
import CIcon from '@components/c-icon';
import COperationError from '@components/c-operation-error';
import COperationSuccess from '@components/c-operation-success';
import CButton from '@components/c-button';
import CListIconItem from '@components/c-list-icon-item';
import WActions from '@widgets/w-actions';

import iconReject from '@icons/crossCircle';
import iconCheckCircle from '@icons/checkCircle';

export default {
	name: 'v-signature-detail',

	components: {
		LPage,
		CAcrylicSheet,
		CTranslide,
		CIcon,
		COperationError,
		COperationSuccess,
		CButton,
		CListIconItem,
		WActions,
	},

	props: {
		signatureId: String,
		type: String,
	},

	data() {
		return {
			source: null,
			error: null,
			success: null,
			enableActions: this.type === 'pending',
			actions: '',
			errorDesc: this.$t('DETAIL.SIGNATURE.ERROR.DESC'),
		};
	},

	computed: {
		description({ source }) {
			const isECommerceBizum = source?.operationType === 'eCommerceBizum';
			let description = source?.operationDescription;

			/* istanbul ignore next */
			if (isECommerceBizum) {
				description = source?.reason;
			}

			return description;
		},

		signatureStatus({ type }) {
			return this.$t(`SIGNATURES.STATUS.${type?.toUpperCase()}`);
		},

		actionOptions() {
			return [
				{
					id: 'sign-operation',
					icon: iconCheckCircle,
					title: this.$t('ACTIONS.SIGN_OPERATION'),
					action: this.signOperation,
				},
				{
					id: 'reject-operation',
					icon: iconReject,
					title: this.$t('ACTIONS.REJECT_OPERATION'),
					action: this.rejectOperation,
				},
			];
		},
	},

	methods: {
		signOperation() {
			const SIGNATURE_EXPIRED = 'C503000304';
			const { type, signatureId } = this;
			this.action = 'SIGN';
			this.$store
				.dispatch('signatures/sign', { type, signatureId })
				.then(() => {
					this.success = true;
				})
				.catch((err) => {
					if (err?.response?.data?.errorCode === SIGNATURE_EXPIRED) {
						this.errorDesc = this.$t('DETAIL.SIGNATURE.SIGNATURE_EXPIRED.ERROR');
					}

					this.error = true;
				});
		},

		rejectOperation() {
			const { type, signatureId } = this;
			this.action = 'DELETE';
			this.$store
				.dispatch('signatures/delete', { type, signatureId })
				.then(() => {
					this.success = true;
				})
				.catch(() => {
					this.error = true;
				});
		},
	},

	watch: {
		signatureId: {
			immediate: true,
			handler(signatureId) {
				/* istanbul ignore else */
				if (signatureId) {
					this.$store
						.dispatch('signatures/get', { type: this.type, signatureId })
						.then((data) => {
							if (!data) {
								return this.$router.back();
							}

							this.source = {
								...data,
								...data?.data,
								balance:
									data?.data.amount && data?.data.currency
										? {
												amount: data.data?.amount,
												currency: { id: data.data?.currency },
										  }
										: null,
								origin: data?.data?.origin,
								destination: data?.data?.destination,
							};
						})
						.catch(() => this.$router.back());
				}
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.v-signature-detail__header {
	margin-left: 20px;
	margin-right: 20px;
	max-width: 400px;
	flex-grow: 1;
	width: 100%;
}

.v-signature-detail__scrolling {
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

.v-signature-detail__main {
	text-align: left;
}

.v-signature-detail__main > *:not(:last-child) {
	margin-bottom: 15px;
}

.v-signature-detail__reason,
.v-signature-detail__amount {
	margin-bottom: 10px;
}

.v-signature-detail__group {
	max-width: 400px;
	margin-left: auto;
	margin-right: auto;
}

.v-signature-detail__group:empty {
	display: none;
}

.v-signature-detail__group > *:not(:last-child) {
	margin-bottom: 18px;
}
</style>
