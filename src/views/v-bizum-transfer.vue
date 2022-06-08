<template>
	<l-new-transfer :loading="loading">
		<h1 slot="header">
			<span v-if="action === 'cancel'">{{ $t('BIZUM.ACTION.CANCEL') }}</span>
			<span v-else-if="action === 'icancel'">{{ $t('BIZUM.ACTION.ICANCEL') }}</span>
			<span v-else-if="action === 'deny'">{{ $t('BIZUM.ACTION.DENY') }}</span>
			<span v-else-if="action === 'accept'">{{ $t('BIZUM.ACTION.ACCEPT') }}</span>
			<span v-else-if="action === 'return'">{{ $t('BIZUM.ACTION.RETURN') }}</span>
			<span v-else-if="action === 'request'">{{ $t('BIZUM.ACTION.REQUEST') }}</span>
			<span v-else-if="action === 'donate'">{{ $t('BIZUM.ACTION.DONATE') }}</span>
			<span v-else>{{ $t('BIZUM.TITLE') }}</span>
		</h1>

		<div
			class="v-bizum-transfer__progress"
			slot="main-pre-content"
			v-if="['send', 'request', 'donate'].includes(action)"
		>
			<c-step-progress
				:current="currentStep"
				:steps="[$t('TRANSFERS.DATA'), $t('TRANSFERS.CONFIRMATION')]"
			/>
		</div>

		<p
			v-if="['cancel', 'icancel', 'accept', 'deny', 'return'].includes(action)"
			class="text-m-medium v-bizum-transfer__info"
		>
			<span v-if="action === 'cancel'">{{ $t('BIZUM.STEP_CANCEL_BIZUM_INFO') }}</span>
			<span v-if="action === 'icancel'">{{ $t('BIZUM.STEP_ICANCEL_BIZUM_INFO') }}</span>
			<span v-if="action === 'accept'">{{ $t('BIZUM.STEP_ACCEPT_BIZUM_INFO') }}</span>
			<span v-if="action === 'deny'">{{ $t('BIZUM.STEP_DENY_BIZUM_INFO') }}</span>
			<span v-if="action === 'return'">{{ $t('BIZUM.STEP_RETURN_BIZUM_INFO') }}</span>
		</p>

		<c-operation-resume v-if="currentStep >= STEP_RESUME" v-model="resume" @edit="openSection" />

		<div class="v-bizum-transfer__alert" v-if="currentStep === STEP_FINAL && destinationNotFound">
			<c-icon
				class="v-bizum-transfer__alert-icon color-accent-error"
				src="@icons/modalExclamation"
			/>
			<p class="text-m-medium v-bizum-transfer__alert-title">
				{{ $t('BIZUM.DESTINATION_NOT_REGISTERED.TITLE') }}
			</p>
			<p class="text-s-book">{{ $t('BIZUM.DESTINATION_NOT_REGISTERED.DESC') }}</p>
		</div>

		<div
			class="v-bizum-transfer__alert"
			v-if="
				currentStep === STEP_FINAL &&
					operativeNotAvailable &&
					['accept', 'send', 'request', 'donate'].includes(action)
			"
		>
			<c-icon
				class="v-bizum-transfer__alert-icon color-text-secondary"
				src="@icons/modalExclamation"
			/>
			<p class="text-m-medium v-bizum-transfer__alert-title">
				{{ $t('BIZUM.RESPONSE.TEMP_ERROR_TITLE') }}
			</p>
			<p class="text-s-book">{{ $t('BIZUM.RESPONSE.TEMP_ERROR_DESCRIPTION') }}</p>
		</div>

		<w-bizum-transfer-amount
			v-if="currentStep === STEP_AMOUNT"
			slot="sheet"
			data-testid="form-amount"
			ref="widgetAmount"
			:action="action"
			v-model="model"
		/>

		<w-bizum-transfer-comment
			v-if="currentStep === STEP_COMMENTS"
			slot="sheet"
			data-testid="form-comment"
			ref="widgetComment"
			:action="action"
			v-model="model"
		/>
		<c-operation-success v-if="success" slot="state" data-testid="operation-success">
			<h1 slot="title">{{ $t(`BIZUM.RESPONSE.${ACTION_KEY}.SUCCESS.TITLE`) }}</h1>

			<div class="v-bizum-transfer__success-resume">
				<c-list-icon-item
					v-if="model.origin"
					:title="$t('TRANSFERS.ORIGIN_ACCOUNT')"
					icon="@icons/paper"
					:description="$pn(model.origin.productNumber)"
				/>

				<c-list-icon-item
					v-if="model.ong"
					:title="$t('ONG')"
					icon="@icons/paper"
					:description="model.ong.name"
				/>

				<c-list-icon-item
					v-if="model.recipientName"
					:title="$t('BIZUM.DESTINATION')"
					icon="@icons/user"
					:description="model.recipientName"
				/>

				<c-list-icon-item
					v-if="model.recipient && model.recipient !== model.recipientName"
					:title="$t('MOBILE_PHONE')"
					icon="@icons/cellphone"
					:description="model.recipient"
				/>

				<c-list-icon-item
					v-if="model.amount"
					:title="$t('TRANSFERS.AMOUNT')"
					icon="@icons/valueAccountUnit"
					:description="$nc(model.amount)"
				/>

				<c-list-icon-item
					v-if="model.reason && model.reason.trim()"
					:title="$t('TRANSFERS.REASON')"
					:description="model.reason"
					icon="@icons/paper"
				/>

				<div
					v-if="model.additionalImage && !additionalContentError"
					class="v-bizum-transfer__image"
				>
					<span class="v-bizum-transfer__info-image">
						<img :src="model.additionalImage" alt="" class="v-bizum-transfer__info-uploaded-img" />
					</span>
					<span class="v-bizum-transfer__info-label text-m-medium">{{ $t('IMAGE_ADDED') }}</span>
				</div>

				<c-list-icon-item
					class="v-bizum-transfer__item-error"
					v-else-if="model.additionalImage && additionalContentError"
					:title="$t('BIZUM.ERROR.ADDITIONAL_IMAGE')"
					:description="$t('BIZUM.ERROR.SENDING_ADDITIONAL_IMAGE')"
					icon="@icons/modalExclamation"
				/>

				<c-list-icon-item
					v-if="model.additionalText && !additionalContentError"
					:title="$t('COMMENT')"
					:description="model.additionalText"
					icon="@icons/paper"
				/>

				<c-list-icon-item
					class="v-bizum-transfer__item-error"
					v-else-if="model.additionalText && additionalContentError"
					:title="$t('BIZUM.ERROR.ADDITIONAL_COMMENT')"
					:description="$t('BIZUM.ERROR.SENDING_ADDITIONAL_COMMENT')"
					icon="@icons/modalExclamation"
				/>

				<c-list-icon-item
					v-if="model.additionalJustification && !additionalContentError"
					:title="$t(`BIZUM.MOVEMENT.JUSTIFICATION.${action.toUpperCase()}`)"
					:description="model.additionalJustification"
					icon="@icons/paper"
				/>

				<c-list-icon-item
					class="v-bizum-transfer__item-error"
					v-else-if="model.additionalJustification && additionalContentError"
					:title="$t(`BIZUM.MOVEMENT.JUSTIFICATION.${action.toUpperCase()}`)"
					:description="$t('BIZUM.ERROR.SENDING_ADDITIONAL_COMMENT')"
					icon="@icons/modalExclamation"
				/>
			</div>

			<div class="v-bizum-transfer__success-info" v-if="['send', 'donate'].includes(action)">
				<p class="text-s-book">{{ $t(`BIZUM.RESPONSE.${ACTION_KEY}.SUCCESS.DESC1`) }}</p>
				<p class="text-s-book">{{ $t(`BIZUM.RESPONSE.${ACTION_KEY}.SUCCESS.DESC2`) }}</p>
			</div>
			<c-button raised slot="buttons" @click="onSuccessOKButtonClick" data-testid="continue">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
			<router-link
				slot="buttons"
				:to="{ name: 'home', replace: true }"
				class="v-bizum-transfer__go-home text-m-medium"
			>
				{{ $t('ACTIONS.GO_TO_VIEW', { view: $t('GLOBAL_POSITION') }) }}
			</router-link>
		</c-operation-success>

		<c-operation-error
			v-if="error"
			contact-us
			slot="state"
			@confirm="$router.back()"
			data-testid="operation-error"
		>
			<h1 slot="title">{{ $t(`BIZUM.RESPONSE.${ACTION_KEY}.ERROR.TITLE`) }}</h1>
			<p class="text-m-book">{{ errorMessage }}</p>
		</c-operation-error>

		<c-button
			raised
			@click="submit"
			slot="buttons"
			v-if="currentStep === STEP_FINAL"
			data-testid="submit-transfer"
			:disabled="disableConfirm"
		>
			{{ $t('ACTIONS.CONFIRM') }}
		</c-button>

		<router-view slot="state" />
	</l-new-transfer>
</template>

<script>
import LNewTransfer from '@layouts/l-new-transfer';
import CStepProgress from '@components/c-step-progress';
import WBizumTransferAmount from '@widgets/w-bizum-transfer-amount';
import WBizumTransferComment from '@widgets/w-bizum-transfer-comment';
import SessionCache from '@modules/session/session-cache';
import CButton from '@components/c-button';
import COperationError from '@components/c-operation-error';
import COperationSuccess from '@components/c-operation-success';
import COperationResume from '@components/c-operation-resume';
import CListIconItem from '@components/c-list-icon-item';
import CIcon from '@components/c-icon';
import bizumModule from '@modules/bizum/m-bizum';

import {
	BIZUM_DESTINATION_NOT_FOUND,
	BIZUM_ISSUER_NOT_FOUND,
	BIZUM_DESTINATION_IS_PENDING,
	BIZUM_TIMEOUT,
	BIZUM_SEND_MONTHLY_LIMIT,
	BIZUM_REQUEST_MONTHLY_LIMIT,
	BIZUM_DAILY_LIMIT,
	BIZUM_DAILY_AMOUNT_LIMIT,
	BIZUM_MIN_LIMIT,
	BIZUM_MAX_LIMIT,
	BIZUM_BALANCE_LIMIT,
	BIZUM_DESTINATION_PHONE_NOT_VALID,
	BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE1,
	BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE2,
	BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE3,
	BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE4,
	BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE5,
	BIZUM_ERROR_OPERATIVE_NOT_AVAILABLE,
} from '@modules/service/constants';

export default {
	name: 'v-bizum-transfer',

	modules: { bizum: bizumModule },

	components: {
		LNewTransfer,
		CStepProgress,
		WBizumTransferAmount,
		WBizumTransferComment,
		CButton,
		COperationError,
		COperationSuccess,
		COperationResume,
		CListIconItem,
		CIcon,
	},

	props: {
		action: {
			type: String,
			default: 'send',
			validator: (value) =>
				['send', 'request', 'cancel', 'icancel', 'accept', 'deny', 'return', 'donate'].includes(
					value
				),
		},
		movementId: { type: String },
	},

	data() {
		return {
			STEP_AMOUNT: 1,
			STEP_RESUME: 2,
			STEP_VALIDATE_RECIPIENT: 2.1,
			STEP_COMMENTS: 2.5,
			STEP_FINAL: 3,

			currentStep: 0,
			loading: false,
			success: false,
			error: false,
			disableConfirm: false,
			status: null,
			errorMessage: null,
			destinationNotFound: false,
			operativeNotAvailable: false,
			additionalContentError: false,
			fee: false,

			model: {
				id: null,
				origin: null,
				recipient: null,
				recipientName: null,
				ong: null,
				amount: null,
				reason: null,
				additionalText: null,
				additionalImage: null,
				additionalJustification: null,
				validated: false,
			},
		};
	},

	computed: {
		ACTION_KEY({ action }) {
			return action.toUpperCase();
		},

		resume({ model, action, fee, ACTION_KEY }) {
			const resume = [];

			if (model.origin) {
				resume.push({
					name: 'origin',
					disabled: true,
					label: this.$t('TRANSFERS.ORIGIN_ACCOUNT'),
					value: model.origin.alias,
					additionalInfo: this.$pn(model.origin.productNumber),
				});
			}

			if (model.recipientName) {
				resume.push({
					name: 'recipient',
					disabled: ['cancel', 'icancel', 'accept', 'deny', 'return'].includes(action),
					label: this.$t('BIZUM.DESTINATION'),
					value: model.recipientName,
					additionalInfo: model.recipientName !== model.recipient ? model.recipient : false,
				});
			}

			if (model.ong) {
				resume.push({
					name: 'ong',
					disabled: false,
					label: this.$t('ONG'),
					value: model.ong.name,
					additionalInfo: model.ong.id.slice(-5),
				});
			}

			if (model.amount) {
				resume.push({
					name: 'amount',
					disabled: ['cancel', 'icancel', 'accept', 'deny', 'return'].includes(action),
					label: this.$t('TRANSFERS.AMOUNT'),
					value: this.$nc(model.amount),
				});
			}

			if (model.reason) {
				resume.push({
					name: 'reason',
					disabled: ['cancel', 'icancel', 'accept', 'deny', 'return'].includes(action),
					label: this.$t('TRANSFERS.REASON'),
					value: model.reason,
				});
			}

			if (model.additionalImage) {
				resume.push({
					name: 'additionalImage',
					disabled: ['cancel', 'accept', 'deny', 'return'].includes(action),
					label: this.$t('IMAGE_ADDED'),
					value: model.additionalImage,
					type: 'image',
				});
			}

			if (model.additionalText) {
				resume.push({
					name: 'additionalText',
					disabled: ['cancel', 'accept', 'deny', 'return'].includes(action),
					label: this.$t('COMMENT'),
					value: model.additionalText,
				});
			}

			if (model.additionalJustification) {
				resume.push({
					name: 'additionalJustification',
					disabled: false,
					label: this.$t(`BIZUM.MOVEMENT.JUSTIFICATION.${ACTION_KEY}`),
					value: model.additionalJustification,
				});
			}

			if (fee) {
				resume.push({
					name: 'fee',
					disabled: false,
					label: this.$t('TRANSFERS.OPERATION_FEES_TITLE'),
					type: 'table',
					value: {
						title: this.$t('TRANSFERS.FEES_DESC.OUR'),
						table: [{ label: this.$t('TRANSFERS.FEES'), value: fee }],
					},
				});
			}

			return resume;
		},
	},

	watch: {
		model: {
			deep: true,
			handler(model) {
				if (model.validated) {
					this.currentStep = this.STEP_FINAL;
				} else if (this.movementId) {
					if (this.currentStep !== this.STEP_COMMENTS) {
						this.currentStep = this.STEP_VALIDATE_RECIPIENT;
					}
				} else if (model.amount) {
					this.currentStep = this.STEP_RESUME;
				} else {
					this.currentStep = this.STEP_AMOUNT;
				}
			},
		},

		currentStep(currentStep) {
			const { action, model } = this;

			if (['send', 'request', 'donate'].includes(action)) {
				if (currentStep === this.STEP_RESUME) {
					this.$store
						.dispatch('bizum/operateMoney', { mode: action, model })
						.then(({ bizumId, beneficiary, issuer, fee }) => {
							this.model = { ...this.model, id: bizumId, validated: true };

							if (action === 'send') {
								const recipientName = beneficiary?.name || beneficiary?.phone;
								this.model = { ...this.model, recipientName };
							} else if (action === 'request') {
								const recipientName = issuer?.alias || issuer?.phone;
								this.model = { ...this.model, recipientName };
							}

							this.fee = fee?.amount > 0 ? fee : false;
							this.status = 'ok';
							this.disableConfirm = false;
							this.destinationNotFound = false;
						})
						.catch((error) => {
							this.model = { ...this.model, validated: true };

							const data = error?.response?.data;
							const code = data?.result?.code;
							const bizumId = data?.data?.bizumId;
							const fee = data?.data?.fee;

							if ([BIZUM_DESTINATION_NOT_FOUND, BIZUM_ISSUER_NOT_FOUND].includes(code)) {
								this.model = { ...this.model, id: bizumId, recipientName: this.model.recipient };
								this.fee = fee?.amount > 0 ? fee : false;
								this.status = 'ok';
								this.disableConfirm = false;
								this.destinationNotFound = true;

								return;
							}

							if (code === BIZUM_DESTINATION_IS_PENDING) {
								this.disableConfirm = true;
								this.destinationNotFound = true;
							}

							if (code === BIZUM_ERROR_OPERATIVE_NOT_AVAILABLE) {
								this.disableConfirm = false;
								this.operativeNotAvailable = true;
							}

							this.status = error;
						});
				}
			}

			if (['accept'].includes(action)) {
				if (currentStep === this.STEP_VALIDATE_RECIPIENT) {
					this.model = { ...this.model, validated: true };
				}
			}

			if (['cancel', 'icancel', 'deny', 'return'].includes(action)) {
				if (currentStep === this.STEP_VALIDATE_RECIPIENT) {
					this.$store
						.dispatch('bizum/getContacts', [{ phone: model.recipient }])
						.then(([contact]) => {
							const hasMultimediaCapability = Boolean(contact?.multimediaCapability);

							if (hasMultimediaCapability) {
								this.currentStep = this.STEP_COMMENTS;
							} else {
								this.model = { ...this.model, validated: true };
							}
						})
						.catch(() => {
							this.model = { ...this.model, validated: true };
						});
				}
			}
		},
	},

	methods: {
		openSection(step) {
			if (step === 'additionalJustification') {
				this.currentStep = this.STEP_COMMENTS;
			} else {
				this.currentStep = this.STEP_AMOUNT;
			}
		},

		onSuccessOKButtonClick() {
			if (['cancel', 'icancel', 'accept', 'deny', 'return'].includes(this.action)) {
				return this.$router.go(-2);
			}

			return this.$router.back();
		},

		async submit() {
			const { model, action, status, ACTION_KEY } = this;
			const { dispatch } = this.$store;

			if (this.loading) {
				return;
			}

			this.loading = true;

			const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

			// Espera a que la animación termine.
			await wait(1000);

			let promiseSubmitting;

			/* istanbul ignore else */
			if (['cancel', 'accept', 'deny', 'return'].includes(action)) {
				promiseSubmitting = dispatch('bizum/saveMovement', { mode: action, model, id: model.id });
			} else if (action === 'icancel') {
				promiseSubmitting = dispatch('bizum/saveMovement', { mode: 'cancel', model, id: model.id });
			} else if (status !== 'ok') {
				promiseSubmitting = Promise.reject(status);
			} else if (['send', 'request', 'donate'].includes(action)) {
				promiseSubmitting = dispatch('bizum/operateMoney', { mode: action, model, accept: true });
			}

			promiseSubmitting
				.then(({ result }) => {
					this.additionalContentError = false;
					this.success = true;

					if (['send', 'donate', 'return', 'accept'].includes(action)) {
						SessionCache.clear('products');
					}

					if (result?.code) {
						if (
							[
								BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE1,
								BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE2,
								BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE3,
								BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE4,
								BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE5,
							].includes(result.code)
						) {
							this.additionalContentError = true;
						}
					}
				})
				.catch((error) => {
					const code = error?.response?.data?.result?.code;
					this.error = true;

					if (code === BIZUM_TIMEOUT) {
						this.errorMessage = this.$t('BIZUM.ERROR.TIMEOUT');
					} else if (code === BIZUM_SEND_MONTHLY_LIMIT) {
						this.errorMessage = this.$t('BIZUM.ERROR.MONTHLYLIMIT');
					} else if (code === BIZUM_REQUEST_MONTHLY_LIMIT) {
						this.errorMessage = this.$t('BIZUM.ERROR.MONTHLYLIMIT');
					} else if (code === BIZUM_DAILY_LIMIT) {
						this.errorMessage = this.$t('BIZUM.ERROR.DAILYLIMIT');
					} else if (code === BIZUM_DAILY_AMOUNT_LIMIT) {
						this.errorMessage = this.$t('BIZUM.ERROR.AMOUNTLIMIT');
					} else if (code === BIZUM_MIN_LIMIT) {
						this.errorMessage = this.$t('BIZUM.ERROR.UNDERLIMIT');
					} else if (code === BIZUM_BALANCE_LIMIT) {
						this.errorMessage = this.$t('BIZUM.ERROR.BALANCELIMIT');
					} else if (code === BIZUM_MAX_LIMIT) {
						this.errorMessage = this.$t('BIZUM.ERROR.OVERLIMIT');
					} else if (code === BIZUM_DESTINATION_IS_PENDING) {
						this.errorMessage = this.$t('BIZUM.ERROR.ALREADY_INVITED');
					} else if (code === BIZUM_DESTINATION_PHONE_NOT_VALID) {
						this.errorMessage = this.$t('BIZUM.ERROR.DESTINATION_PHONE_IS_ORIGIN_PHONE');
					} else if (code === BIZUM_ERROR_OPERATIVE_NOT_AVAILABLE) {
						this.errorMessage = this.$t('BIZUM.RESPONSE.TEMP_ERROR_DESCRIPTION_EXPAND');
					} else {
						this.errorMessage = this.$t(`BIZUM.RESPONSE.${ACTION_KEY}.ERROR.TITLE`).concat(
							'. ',
							this.$t('INFO.UNAVAILABLE_OPERATIVE.ALT1')
						);
					}
				})
				.finally(() => {
					SessionCache.clear('bizum');
					this.loading = false;
					this.currentStep = this.STEP_FINAL;
				});
		},

		async initProcess() {
			const { action, movementId } = this;
			const { dispatch } = this.$store;

			// No todas las acciones requieren tener un origin listo.
			// Por ejemplo, 'request' y 'deny' no tienen cuenta de origen.
			if (['accept', 'return', 'send', 'donate'].includes(action)) {
				this.model.origin = await dispatch('bizum/getProduct');
			}

			if (movementId) {
				const movement = await dispatch('bizum/getMovement', movementId);

				if (!movement) {
					return this.$router.back();
				}

				const phone = ['accept'].includes(action)
					? movement.sender.phone
					: movement.beneficiary.phone;

				const name = ['accept'].includes(action)
					? movement.sender.name
					: movement.beneficiary.name || movement.beneficiary.phone;

				this.model = {
					...this.model,
					id: movement.id,
					recipient: phone,
					recipientName: name,
					sender: movement.sender,
					amount: movement.amount,
					reason: movement.reason,
				};
			}

			if (['send', 'request', 'donate'].includes(action)) {
				this.currentStep = this.STEP_AMOUNT;
			}
		},
	},

	created() {
		this.initProcess();
	},
};
</script>

<style lang="scss" scoped>
.v-bizum-transfer__info {
	padding: 10px 20px 40px;
}

.v-bizum-transfer__progress {
	position: relative;
	margin: 10px 20px 18px;
}

.v-bizum-transfer__success-resume {
	text-align: left;
}

.v-bizum-transfer__success-resume > * {
	margin-bottom: 20px;
}

.v-bizum-transfer__success-info {
	border-top: 1px solid rgba(0, 0, 0, 0.15);
	padding-top: 20px;
	margin-top: 20px;
}

.v-bizum-transfer__success-info > *:not(:last-child) {
	margin-bottom: 20px;
}

.v-bizum-transfer__go-home {
	margin-top: 20px;
}

.v-bizum-transfer__alert {
	text-align: center;
	width: 300px;
	margin: 20px auto;
	border: 2px solid RGBA(0, 0, 0, 0.05);
	border-radius: $border-radius-s;
	padding: 20px;
}

.v-bizum-transfer__alert-icon:not([hidden]) {
	font-size: 16px;
	display: block;
	margin: 0 auto 10px;
}

.v-bizum-transfer__alert-title {
	line-height: 1;
	margin-bottom: 20px;
	border-bottom: 2px solid RGB(var(--color-secondary));
	display: inline-block;
	padding-bottom: 10px;
	outline: 0;
}

.v-bizum-transfer__image {
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.v-bizum-transfer__info-image {
	flex-shrink: 0;
	display: flex;
	width: 40px;
	height: 40px;
	background-color: RGB(var(--color-surface-light));
	border-radius: $border-radius-s;
	box-shadow: 0px 5px 10px -8px rgba(0, 0, 0, 0.5);
	align-items: center;
	justify-content: center;
	color: RGB(var(--color-accent-secondary));
}

.v-bizum-transfer__info-label {
	flex-grow: 1;
	margin-left: 10px;
}

.v-bizum-transfer__info-uploaded-img {
	width: 40px;
	height: 40px;
	object-fit: cover;
	object-position: center;
	background-color: RGB(var(--color-surface-light));
	border-radius: $border-radius-s;
}

.v-bizum-transfer__item-error {
	--c-list-icon-item-icon-color: #{RGB(var(--color-text-error))};
}
</style>
