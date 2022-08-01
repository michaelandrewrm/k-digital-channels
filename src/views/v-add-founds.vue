<template>
	<l-new-transfer>
		<h1 slot="header" data-testid="header-title">{{ title }}</h1>

		<div class="v-transfer__progress" slot="main-pre-content" v-if="action === 'add'">
			<c-progress-transfer :step="currentStep" />
		</div>

		<w-transfer-resume
			v-model="model"
			editable
			:disabled-sections="disabledResumeSections"
			:invalid-section="invalidSection"
			@edit="openSection"
			data-testid="form-resume"
		/>

		<w-founds-origin
			v-if="currentStep === STEP_ORIGIN"
			ref="widgetOrigin"
			v-model="model"
			data-testid="form-origin"
			slot="sheet"
		/>
	</l-new-transfer>
</template>

<script>
import SessionCache from '@modules/session/session-cache';
import moveMoneyModule from '@modules/move-money/m-move-money';
import LNewTransfer from '@layouts/l-new-transfer';
import CProgressTransfer from '@components/c-progress-transfer';
import WTransferResume from '@widgets/w-transfer-resume';
import WFoundsOrigin from '@widgets/w-founds-origin';

import {
	AMOUNT_OVER_BALANCE,
	AMOUNT_OVER_LIMIT,
	CURRENCY_NOT_ALLOWED,
	INVALID_AMOUNT,
	INVALID_BIC,
	INVALID_CONCEPT,
	INVALID_CURRENCY_TYPE,
	INVALID_DATE,
	INVALID_DESTINATION,
	INVALID_FREQUENCY,
	INVALID_IBAN,
	INVALID_ORIGIN,
	MUST_BE_EURO_CURRENCY,
	UNRELATED_IBAN_BIC,
	DUPLICATED_ERROR,
} from '@modules/move-money/constants';

export default {
	name: 'v-add-founds',

	modules: {
		'move-money': moveMoneyModule,
	},

	components: { LNewTransfer, CProgressTransfer, WTransferResume, WFoundsOrigin },

	props: {
		action: { type: String, default: 'add' },
	},

	data() {
		return {
			currentStep: 0,

			STEP_ORIGIN: 1,
			STEP_AMOUNT: 2,
			STEP_DESTINATION: 3,
			STEP_BENEFICIARY: 3.25,
			STEP_RESUME: 3.5,
			STEP_FEES: 3.7,
			STEP_CONFIRMATION: 4,
			STEP_FINAL: 5,

			showDestinationList: true,
			hasDestinationList: true,
			hasPendingSignatures: false,

			model: {
				transferId: null,
				origin: null,
				destination: null,
				amount: null,
				reason: null,
				periodicity: null,
				date: null,
				frequency: null,
				maxDate: null,
				fees: null,
				chargeBearer: null,
				favorite: null,
				alias: null,
				notify: null,
				email: null,
				validated: false,
				duplicatedOperation: false,
			},

			loading: false,
			success: false,
			error: false,
			disableConfirm: null,
			status: null,
			invalidSection: [],
		};
	},

	computed: {
		showBeneficiary() {
			return !this.hasDestinationList || !this.showDestinationList;
		},

		title({ action }) {
			return this.$t(`ACTIONS.${action.toUpperCase()}_FOUNDS`);
		},

		successTitle({ action, model, hasPendingSignatures }) {
			if (hasPendingSignatures) {
				return this.$t('TRANSFERS.PENDING_SIGNATURES.TITLE');
			}

			if (action === 'add' && model?.periodicity !== 'today') {
				return this.$t('TRANSFERS.RESPONSE.SCHEDULED.SUCCESS');
			}

			return this.$t(`TRANSFERS.RESPONSE.${action.toUpperCase()}.SUCCESS`);
		},

		resume({ model }) {
			/* istanbul ignore next */
			if (!model || !model.origin || !model.destination) {
				return {};
			}

			return {
				orderer: {
					fromAccount: {
						id: model.origin.id,
						alias: model.origin.alias,
						productNumber: model.origin.productNumber,
					},
				},
				beneficiary: {
					description: model.destination.view.name,
					toAccount: {
						productNumber: {
							format: { id: 'IBAN' },
							value: model.destination.view.id,
						},
					},
				},
				amount: model.amount,
				date: model.date,
				reason: model.reason,
				fees: model.fees,
				chargeBearer: model.chargeBearer,
				reference: model.reference,
				transferMode: model.destination.transferMode,
				periodicity: model.periodicity,
			};
		},

		disabledResumeSections({ action }) {
			if (action === 'modify') {
				return ['origin'];
			}

			if (action === 'cancel') {
				return ['origin', 'destination', 'amount', 'reason', 'date', 'fee'];
			}

			if (!this.showBeneficiary) {
				return ['beneficiary'];
			}

			return [];
		},
	},

	watch: {
		model: {
			deep: true,
			handler(model) {
				if (model.validated) {
					this.currentStep = this.STEP_CONFIRMATION;
				} else if (model.fees && !model.chargeBearer) {
					this.currentStep = this.STEP_FEES;
				} else {
					this.currentStep = this.STEP_RESUME;
				}

				if (!model.destination) {
					this.currentStep = this.STEP_DESTINATION;
				}

				if (!model.amount) {
					this.currentStep = this.STEP_AMOUNT;
				}

				if (!model.origin) {
					this.currentStep = this.STEP_ORIGIN;
				}
			},
		},

		currentStep(currentStep) {
			/**
			 * En la cancelación de una transferencia avanzamos
			 * hasta el último paso sin hacer la simulación.
			 */
			if (this.action === 'cancel') {
				// https://es.vuejs.org/v2/guide/reactivity.html#Precauciones-detectando-cambios
				this.model = { ...this.model, validated: true };
				this.status = 'ok';
				this.invalidSection = [];
				this.disableConfirm = false;
			} else if (currentStep === this.STEP_RESUME) {
				/* If the reason is empty we set TRANSFERENCIA as default */
				/* istanbul ignore else */

				if (!this.model.reason || this.model.reason.trim() === '') {
					this.model = { ...this.model, reason: 'TRANSFERENCIA' };
				}

				if (this.model.duplicatedOperation) {
					return;
				}

				this.$store
					.dispatch('move-money/simulate', this.model)
					.then((data) => {
						const { fee, expense, total } = data;
						const hasFees = fee?.amount > 0 || expense?.amount > 0;

						if (hasFees) {
							if (this.model.chargeBearer) {
								this.model = { ...this.model, fees: { fee, expense, total }, validated: true };
							} else {
								this.model = { ...this.model, fees: { fee, expense, total } };
							}
						} else {
							this.model = { ...this.model, validated: true };
						}

						this.status = 'ok';
						this.invalidSection = [];
						this.disableConfirm = false;
					})
					.catch((err) => {
						const errorCode = err?.response?.data?.errorCode;
						const section = this.handleSimulateError(errorCode);
						const validated = !section;

						this.status = 'rejected';
						this.invalidSection = [];
						this.invalidSection.push(section);
						this.disableConfirm = !validated;

						// Si handleSimulateError no devuelve nada es
						// que el error es un error fatal. Dejaremos
						// continuar, para mostrar la vista de error
						// en la transferencia.

						this.model = { ...this.model, validated };
					});
			}
		},

		action(action) {
			/* istanbul ignore else */
			if (action === 'add') {
				this.initProcess();
			}
		},
	},

	methods: {
		gotoDetail() {
			const { type, transferId, productId } = this;

			if (type === 'ordered') {
				return this.$router.replace({
					name: 'transfer-detail',
					params: { type, transferId, productId },
				});
			}

			return this.$router.back();
		},

		errorAction() {
			if (this.model.duplicatedOperation) {
				this.error = false;
				this.currentStep = this.STEP_RESUME;
				this.invalidSection = ['amount-duplicated', 'reason-duplicated', 'destination-duplicated'];
				this.disableConfirm = true;
				return;
			}

			return this.$router.back();
		},

		handleSimulateError(errorCode) {
			let section;

			if (
				errorCode === AMOUNT_OVER_LIMIT ||
				errorCode === MUST_BE_EURO_CURRENCY ||
				errorCode === INVALID_CURRENCY_TYPE ||
				errorCode === CURRENCY_NOT_ALLOWED ||
				errorCode === INVALID_AMOUNT ||
				errorCode === AMOUNT_OVER_BALANCE
			) {
				section = 'amount-balance';
			}

			if (errorCode === INVALID_ORIGIN) {
				section = 'origin';
			}

			if (
				errorCode === INVALID_IBAN ||
				errorCode === UNRELATED_IBAN_BIC ||
				errorCode === INVALID_DESTINATION ||
				errorCode === INVALID_BIC
			) {
				section = 'destination';
			}

			if (errorCode === INVALID_DATE) {
				section = 'date';
			}

			if (errorCode === INVALID_FREQUENCY) {
				section = 'frequency';
			}

			if (errorCode === INVALID_CONCEPT) {
				section = 'reason';
			}

			return section;
		},

		openSection(section) {
			const { STEP_ORIGIN, STEP_DESTINATION, STEP_AMOUNT, STEP_FEES, STEP_BENEFICIARY } = this;

			this.currentStep = {
				origin: STEP_ORIGIN,
				destination: STEP_DESTINATION,
				amount: STEP_AMOUNT,
				fees: STEP_FEES,
				beneficiary: STEP_BENEFICIARY,
			}[section];
		},

		toggleDestinationList() {
			this.showDestinationList = !this.showDestinationList;
		},

		async submit() {
			const { model, transferId, action, type } = this;
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
			if (this.status === 'rejected') {
				promiseSubmitting = Promise.reject();
			} else if (['add', 'repeat'].includes(action)) {
				promiseSubmitting = dispatch('move-money/transfer', model);
			} else if (action === 'modify') {
				promiseSubmitting = dispatch('move-money/modifyTransfer', { transferId, model });
			} else if (action === 'cancel') {
				promiseSubmitting = dispatch('move-money/deleteTransfer', { type, transferId });
			}

			promiseSubmitting
				.then((res) => {
					if (res?.data?.reference) {
						this.model = { ...this.model, reference: res?.data?.reference };
					}

					if (
						['add', 'modify'].includes(action) &&
						['today', 'scheduled'].includes(model?.periodicity) &&
						res?.status === 201
					) {
						this.hasPendingSignatures = true;
					}

					this.success = true;

					SessionCache.clear('transfers');
					SessionCache.clear('products');
					SessionCache.clear('resources');
				})
				.catch((err) => {
					const errorCode = err?.response?.data?.errorCode;

					this.model = { ...this.model, duplicatedOperation: errorCode === DUPLICATED_ERROR };
					this.error = true;

					SessionCache.clear('signatures');
				})
				.finally(() => {
					this.loading = false;
					this.currentStep = this.STEP_FINAL;
				});
		},

		formatDate(date) {
			const d = new Date(date);
			const day = d.getDate();
			const month = d.getMonth() + 1;
			const year = d.getFullYear();
			const currentDay = day.toString().padStart(2, '0');
			const currentMonth = month.toString().padStart(2, '0');
			return {
				'YYYY-MM-DD': `${year}-${currentMonth}-${currentDay}`,
				'DD/MM/YYYY': `${currentDay}/${currentMonth}/${year}`,
			};
		},
		initProcess() {
			this.model.origin = null;
			this.loading = false;
			this.success = false;
			this.error = false;
			this.invalidSection = [];

			this.$store
				.dispatch('move-money/getDestinations')
				.then((data) => {
					/**
					 * Si la lista de destinos solo tiene una cuenta, significa
					 * que el origen y el destino serán el mismo, lo cual es inválido.
					 * Por esa razón, aunque en la lista me venga un posible destino,
					 * haremos como si no hubieran destinos disponibles para que el
					 * usuario ingrese los valores del destino a mano.
					 */
					if (data && data.length > 1) {
						this.hasDestinationList = true;
						this.showDestinationList = true;
					} else {
						this.hasDestinationList = false;
					}
				})
				.catch(() => {
					this.hasDestinationList = false;
				})
				.finally(() => {
					const { origin } = this.$route.query;
					const { action, type, transferId } = this;

					if (origin) {
						this.$store
							.dispatch('move-money/getOrigins', { force: true })
							.then((products) => {
								const product = products.find(({ id }) => id === origin);

								if (product) {
									const { id, alias, postedBalance: balance, productNumber } = product;
									this.model.origin = { id, alias, balance, productNumber };
									this.currentStep = this.STEP_DESTINATION;
								} else {
									this.currentStep = this.STEP_ORIGIN;
								}
							})
							.catch(() => {
								this.currentStep = this.STEP_ORIGIN;
							});
					} else if (['repeat', 'modify', 'cancel'].includes(action)) {
						this.$store.dispatch('move-money/getTransfer', { type, transferId }).then((source) => {
							this.$store
								.dispatch('move-money/getOrigins', { force: true })
								.then((products) => {
									const product = products.find(({ id }) => id === source.orderer.fromAccount.id);

									if (product) {
										const { id, alias, postedBalance: balance, productNumber } = product;
										const today = this.formatDate(new Date())['YYYY-MM-DD'];
										const { nextExecutionDate, beneficiary, periodicity, amount, reason } = source;
										const transferMode = source.transferMode.id;
										const isScheduled = new Date(nextExecutionDate) > new Date(today);
										const name = beneficiary.description;
										const account = {
											type: beneficiary?.toAccount?.productNumber?.format?.id || 'IBAN',
											id: beneficiary?.toAccount?.productNumber?.value,
											bic: beneficiary.toAccount?.bic,
										};

										if (action === 'modify') {
											this.model.transferId = transferId;
										}

										const isInternalTransfer = Boolean(
											products.find(({ productNumber: { value } }) => value === account.id)
										);

										this.showDestinationList = isInternalTransfer;

										this.model.origin = { id, alias, balance, productNumber };
										this.model.destination = {
											account,
											transferMode,
											name,
											view: {
												name,
												id: this.$pn({ format: { id: account.type }, value: account.id }),
											},
										};
										this.model.amount = amount;
										this.model.reason = reason;
										this.model.periodicity =
											(periodicity?.frequency && 'periodic') ||
											(isScheduled && 'scheduled') ||
											'today';
										this.model.frequency = periodicity?.frequency;
										this.model.date = isScheduled ? nextExecutionDate || today : today;
										this.model.maxDate = source?.endExecutionDate;
										this.currentStep = this.STEP_CONFIRMATION;
									} else {
										this.currentStep = this.STEP_ORIGIN;
									}
								})
								.catch(() => {
									this.currentStep = this.STEP_ORIGIN;
								});
						});
					} else {
						this.currentStep = this.STEP_ORIGIN;
					}
				});
		},
	},
	created() {
		this.initProcess();
	},
};
</script>
<style lang="scss" scoped>
.v-transfer__progress {
	position: relative;
	margin: 10px 20px 20px;
}

.v-transfer__buttons {
	display: grid;
	width: 100%;
	max-width: $theme-max-width;
	grid-gap: 10px;
	grid-template-columns: 1fr min-content;
	padding-left: 20px;
	padding-right: 20px;
}
</style>
