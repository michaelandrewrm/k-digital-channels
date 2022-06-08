<template>
	<l-transfer-sheet class="w-bizum-transfer-amount" :collapsable-buttons="false">
		<div class="w-bizum-transfer-amount__header">
			<h1 class="w-bizum-transfer-amount__title text-m-medium">
				<span v-if="action === 'send'">{{ $t('BIZUM.STEP_SEND_BIZUM') }}</span>
				<span v-else-if="action === 'request'">{{ $t('BIZUM.STEP_REQUEST_BIZUM') }}</span>
				<span v-else-if="action === 'donate'">{{ $t('BIZUM.STEP_DONATE_BIZUM') }}</span>
			</h1>
			<div class="w-bizum-transfer-amount__subtitle text-s-light">
				<span v-if="action === 'send'">{{ $t('BIZUM.STEP_SEND_BIZUM_INFO') }}</span>
				<span v-else-if="action === 'request'">{{ $t('BIZUM.STEP_REQUEST_BIZUM_INFO') }}</span>
				<span v-else-if="action === 'donate'">{{ $t('BIZUM.STEP_DONATE_BIZUM_INFO') }}</span>
			</div>
		</div>

		<div v-if="origin" class="w-bizum-transfer-amount__content">
			<c-card-item
				:disabled="true"
				:title="originCard.title"
				:sub-title="originCard.subtitle"
				:accessible-sub-title="originCard.accessibleSubtitle"
				:info="originCard.info"
				:sub-info="originCard.subinfo"
				data-testid="product-card-item"
			/>
		</div>

		<div class="w-bizum-transfer-amount__content">
			<div v-if="action === 'donate'" class="w-bizum-transfer-amount__field text-m-medium">
				<h2 class="w-bizum-transfer-amount__field-label">
					{{ $t('ONG') }}
				</h2>

				<c-input-ong
					id="w-bizum-transfer-amount__ong"
					class="w-bizum-transfer-amount__ong"
					ref="ong"
					v-model="ong"
					required
					:valid="!validations.ong.error"
					@input="validations.ong.dirty = true"
					@focusin="scrollDown('ong')"
					data-testid="ong"
				/>

				<c-transfer-field-helper-text
					v-if="validations.ong.error && !validations.ong.required"
					for="w-bizum-transfer-amount__ong"
				>
					{{ $t('FORM.FIELD.REQUIRED') }}
				</c-transfer-field-helper-text>
			</div>

			<div
				v-if="['send', 'request'].includes(action)"
				class="w-bizum-transfer-amount__field text-m-medium"
			>
				<h2 class="w-bizum-transfer-amount__field-label">
					{{ $t('BIZUM.DESTINATION') }}
				</h2>

				<c-input-phone
					id="w-bizum-transfer-amount__recipient"
					class="w-bizum-transfer-amount__recipient"
					ref="recipient"
					:value="rawPhone"
					:valid="!validations.recipient.error"
					:placeholder="$t('FORM.PLACEHOLDER.SPANISH_NUMBER')"
					required
					maxLength="16"
					autocomplete="tel"
					@input="validations.recipient.dirty = true"
					@update:value="recipient = $event"
					@focusin="scrollDown('recipient')"
					data-testid="recipient"
				/>

				<c-transfer-field-helper-text
					v-if="validations.recipient.error && !validations.recipient.required"
					for="w-bizum-transfer-amount__recipient"
				>
					{{ $t('FORM.FIELD.REQUIRED') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					v-else-if="validations.recipient.error && !validations.recipient.validPhone"
					for="w-bizum-transfer-amount__recipient"
				>
					{{ $t('FORM.FIELD.INVALID_PHONE') }}
				</c-transfer-field-helper-text>
			</div>

			<div class="w-bizum-transfer-amount__field text-m-medium">
				<h2 class="w-bizum-transfer-amount__field-label">
					{{ $t('TRANSFERS.AMOUNT') }}
				</h2>

				<c-transfer-input-amount
					id="w-bizum-transfer-amount__amount"
					class="w-bizum-transfer-amount__amount"
					v-model="amount"
					:currency="currencyBizum.id"
					:placeholder="$t('TRANSFERS.AMOUNT')"
					:valid="!validations.amount.error"
					autocomplete="transaction-amount"
					@input="validations.amount.dirty = true"
					@focusin="scrollDown('amount')"
					data-testid="amount"
				/>

				<c-transfer-field-helper-text
					for="w-bizum-transfer-amount__amount"
					v-if="validations.amount.error && !validations.amount.positive"
				>
					{{ $t('TRANSFERS.AMOUNT_ERROR') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-bizum-transfer-amount__amount"
					v-else-if="validations.amount.error && !validations.amount.underBalance"
				>
					{{ $t('TRANSFERS.BALANCE_ERROR') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-bizum-transfer-amount__amount"
					v-else-if="validations.amount.error && !validations.amount.limitMaximum"
				>
					{{ $t('TRANSFERS.LIMIT_ERROR') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-bizum-transfer-amount__amount"
					v-else-if="validations.amount.error && !validations.amount.limitMinimum"
				>
					{{ $t('TRANSFERS.MINIMUM_AMOUNT_ERROR') }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-bizum-transfer-amount__amount"
					class="w-bizum-transfer-amount__info-right"
					persistent
				>
					{{
						$t('BIZUM.TRANSFER.MIN_MAX', {
							min: $nc(minDailyAmount),
							max: $nc(maxDailyAmount, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
						})
					}}
				</c-transfer-field-helper-text>
			</div>

			<div
				class="w-bizum-transfer-amount__field text-m-medium"
				:class="{ '--extra-padding': focusedElement === 'reason' }"
			>
				<h2 class="w-bizum-transfer-amount__field-label">
					{{ $t('TRANSFERS.REASON') }}
				</h2>

				<c-transfer-textarea
					id="w-bizum-transfer-amount__reason"
					class="w-bizum-transfer-amount__reason"
					v-model.trim="reason"
					:placeholder="$t('TRANSFERS.REASON').concat(' ', $t('BIZUM.TRANSFER.OPTIONAL'))"
					:valid="!validations.reason.error"
					rows="3"
					@input="validations.reason.dirty = true"
					@focusin="scrollDown('reason')"
					data-testid="reason"
				/>
				<c-transfer-field-helper-text
					for="w-bizum-transfer-amount__reason"
					v-if="validations.reason.error && !validations.reason.maxLength"
				>
					{{ $t('TRANSFERS.ERROR_FIELD_LENGTH', { length: maxReasonLength }) }}
				</c-transfer-field-helper-text>
				<c-transfer-field-helper-text
					for="w-bizum-transfer-amount__reason"
					v-else-if="validations.reason.error && !validations.reason.onlyTheseCharacters"
				>
					{{ $t('TRANSFERS.BENEFICIARY.ALIAS.INVALID_ERROR') }}
				</c-transfer-field-helper-text>
			</div>

			<div v-if="additionalContentEnabled" class="w-bizum-transfer-amount__field">
				<div class="w-bizum-transfer-amount__additional-content">
					<p class="text-m-medium">{{ $t('ADDITIONAL_CONTENT') }}</p>
					<p class="text-s-book">{{ $t('BIZUM.DESTINATION_CAN_RECEIVE_ADDITIONAL_CONTENT') }}</p>
				</div>

				<div class="w-bizum-transfer-amount__field text-m-medium">
					<c-input-image v-model="image" data-testid="image">
						<span v-if="!image">{{ $t('ADD_IMAGE') }}</span>
						<span v-else>{{ $t('IMAGE_ADDED') }}</span>
					</c-input-image>
				</div>

				<div
					class="w-bizum-transfer-amount__field text-m-medium"
					:class="{ '--extra-padding': focusedElement === 'comment' }"
				>
					<h2 class="w-bizum-transfer-amount__field-label">
						{{ $t('COMMENT') }}
					</h2>

					<c-transfer-textarea
						id="w-bizum-transfer-amount__comment"
						class="w-bizum-transfer-amount__comment"
						v-model.trim="comment"
						:placeholder="$t('COMMENT').concat(' ', $t('BIZUM.TRANSFER.OPTIONAL'))"
						:valid="!validations.comment.error"
						rows="5"
						@input="validations.comment.dirty = true"
						@focusin="scrollDown('comment')"
						data-testid="comment"
					/>
					<c-transfer-field-helper-text
						for="w-bizum-transfer-amount__comment"
						v-if="validations.comment.error && !validations.comment.maxLength"
					>
						{{ $t('TRANSFERS.ERROR_FIELD_LENGTH', { length: maxCommentLength }) }}
					</c-transfer-field-helper-text>
				</div>
			</div>
		</div>

		<c-button raised slot="buttons" @click="submit" data-testid="submit">
			{{ $t('ACTIONS.CONTINUE') }}
		</c-button>
	</l-transfer-sheet>
</template>

<script>
import LTransferSheet from '@layouts/l-transfer-sheet';
import CTransferFieldHelperText from '@components/c-transfer-field-helper-text';
import CTransferInputAmount from '@components/c-transfer-input-amount';
import CTransferTextarea from '@components/c-transfer-textarea';
import CButton from '@components/c-button';
import CCardItem from '@components/c-card-item';
import CInputPhone from '@components/c-input-phone';
import CInputOng from '@components/c-input-ong';
import CInputImage from '@components/c-input-image';
import bizumModule from '@modules/bizum/m-bizum';

import { elementScrollIntoView } from 'seamless-scroll-polyfill';

// Bizum works only with EUROS
const currencyBizum = { code: '978', id: 'EUR' };

export default {
	name: 'w-bizum-transfer-amount',

	modules: { bizum: bizumModule },

	components: {
		LTransferSheet,
		CTransferFieldHelperText,
		CTransferInputAmount,
		CTransferTextarea,
		CButton,
		CCardItem,
		CInputPhone,
		CInputOng,
		CInputImage,
	},

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		value: { type: Object, required: true },
		action: { type: String },
	},

	data() {
		return {
			origin: null,
			recipient: null,
			ong: null,
			rawPhone: null,
			amount: null,
			reason: null,
			comment: null,
			image: null,
			currencyBizum,
			minDailyAmount: { amount: 0.5, currency: currencyBizum },
			maxDailyAmount: { amount: 1000, currency: currencyBizum },
			maxReasonLength: 35,
			maxCommentLength: 255,
			additionalContentEnabled: false,
			focusedElement: null,

			validationState: {
				origin: { dirty: false },
				amount: { dirty: false },
				recipient: { dirty: false },
				ong: { dirty: false },
				reason: { dirty: false },
				comment: { dirty: false },
				image: { dirty: false },
			},
		};
	},

	computed: {
		maxAmount({ origin }) {
			return origin ? origin.balance : 0;
		},

		originCard({ origin }) {
			return {
				title: origin?.alias,
				subtitle: origin?.productNumber ? this.$pn(origin.productNumber) : '',
				accessibleSubtitle: origin?.productNumber
					? this.$t('PRODUCT_NUMBER_ENDED_IN', { productNumber: origin.productNumber.value })
					: '',
				info: origin.balance ? this.$nc(origin.balance) : '',
				subinfo: this.$t('MY_PRODUCT.ACCOUNT.AVAILABLE_BALANCE'),
			};
		},

		localModel({ value, origin, recipient, amount, ong, reason, comment, image }) {
			return {
				...value,
				origin,
				recipient,
				ong,
				reason,
				amount: { amount: parseFloat(amount), currency: this.currencyBizum },
				additionalText: comment,
				additionalImage: image,
			};
		},

		assessment({
			action,
			recipient,
			ong,
			amount,
			maxAmount,
			maxDailyAmount,
			minDailyAmount,
			comment,
			reason,
			maxReasonLength,
			maxCommentLength,
		}) {
			return {
				origin: { required: true },
				recipient: {
					required: ['send', 'request'].includes(action) ? Boolean(recipient) : true,
					validPhone: ['send', 'request'].includes(action)
						? (typeof recipient === 'string' &&
								((recipient.startsWith('+34') && /^\+34[679]{1}[0-9]{8}$/.test(recipient)) ||
									(!recipient.startsWith('+34') && /^\+[0-9]+$/.test(recipient)))) ||
						  recipient === '+3400000004000'
						: true,
				},
				ong: {
					required: ['donate'].includes(action) ? Boolean(ong) : true,
				},
				amount: {
					positive: amount && amount > 0,
					underBalance: !maxAmount || (amount && amount <= maxAmount?.amount),
					limitMaximum: amount && amount <= maxDailyAmount.amount,
					limitMinimum: amount && amount >= minDailyAmount.amount,
				},
				reason: {
					maxLength: !reason || reason.length <= maxReasonLength,
					onlyTheseCharacters:
						!reason || reason.match(/^[0-9a-zA-ZáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙäÄëËïÏöÖüÜçÇ\-'.#$ñÑ\s\d]*$/),
				},
				comment: {
					required: true,
					maxLength: !comment || comment.length <= maxCommentLength,
				},
				image: { required: true },
			};
		},

		validations({ assessment }) {
			const { validationState } = this;

			return Object.keys(assessment).reduce((reducer, key) => {
				const validationField = { ...assessment[key] };

				Object.defineProperties(validationField, {
					invalid: { get: () => !Object.values(assessment[key]).every(Boolean) },
					error: { get: () => this.validations[key].dirty && this.validations[key].invalid },
					dirty: {
						get: () => validationState[key].dirty,
						set: (value) => {
							validationState[key].dirty = value;
						},
					},
				});

				return { ...reducer, [key]: validationField };
			}, {});
		},

		formHasError({ validations }) {
			return Object.values(validations).some(({ error }) => Boolean(error));
		},
	},

	methods: {
		scrollDown(element) {
			this.focusedElement = element;
			const target = this.$el.querySelector(`[for="w-bizum-transfer-amount__${element}"]`);

			if (target) {
				target.focus({ preventScroll: true });
				setTimeout(() => {
					elementScrollIntoView(target, { behavior: 'smooth' });
				}, 500);
			}
		},

		normalizeReason(str) {
			let reason = str || '';

			reason = reason.replace(/ª/g, 'a');
			reason = reason.replace(/º/g, 'o');
			reason = reason.replace(/\n/g, ' ');

			return reason;
		},

		submit() {
			this.validationState.recipient.dirty = true;
			this.validationState.ong.dirty = true;
			this.validationState.amount.dirty = true;
			this.validationState.reason.dirty = true;
			this.validationState.comment.dirty = true;
			this.validationState.image.dirty = true;

			if (this.formHasError) {
				return;
			}

			this.localModel.reason = this.normalizeReason(this.localModel.reason);
			this.$emit('update:value', this.localModel);
		},
	},

	async created() {
		this.rawPhone = this.value.recipient;
		this.amount = this.value.amount?.amount;
		this.reason = this.value.reason;
		this.origin = this.value.origin;
		this.ong = this.value.ong;
		this.comment = this.value.additionalText;
		this.image = this.value.additionalImage;

		this.$emit('update:value', {
			...this.value,
			amount: null,
			reason: null,
			recipient: null,
			recipientName: null,
			ong: null,
			additionalText: null,
			additionalImage: null,
			validated: false,
		});
	},

	watch: {
		recipient(recipient) {
			this.additionalContentEnabled = false;

			if (recipient && !this.validations.recipient.invalid) {
				this.$store
					.dispatch('bizum/getContacts', [{ phone: recipient }])
					.then(([contact]) => {
						const hasMultimediaCapability = Boolean(contact?.multimediaCapability);

						this.additionalContentEnabled = hasMultimediaCapability;
						if (!hasMultimediaCapability) {
							this.image = '';
							this.comment = '';
						}
					})
					.catch(() => {
						this.additionalContentEnabled = false;
						this.image = '';
						this.comment = '';
					});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.w-bizum-transfer-amount::after {
	--scrollable-safe-margin-bottom: 100vh;
	position: inherit;
	background: transparent;
}

.w-bizum-transfer-amount__header {
	margin: 0 20px;
}

.w-bizum-transfer-amount__title {
	padding: 30px 0 10px;
}

.w-bizum-transfer-amount__title::before {
	content: '1. ' / '';
}

.w-bizum-transfer-amount__subtitle {
	padding-bottom: 10px;
}

.w-bizum-transfer-amount__content {
	margin: 15px 20px 0;
}

.w-bizum-transfer-amount__field {
	display: block;
	margin: 20px 0;
}

.w-bizum-transfer-amount__field-label {
	display: block;
	margin-bottom: 10px;
}

.w-bizum-transfer-amount__field.--extra-padding {
	padding-bottom: 140px;
}

.w-bizum-transfer-amount__periodicity {
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: 1fr;
	gap: 10px;
	margin-bottom: 20px;
}

.w-bizum-transfer-amount__info-right {
	text-align: right;
}

.w-bizum-transfer-amount__additional-content {
	display: flex;
	flex-direction: column;
	gap: 10px;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	padding-top: 20px;
}
</style>
