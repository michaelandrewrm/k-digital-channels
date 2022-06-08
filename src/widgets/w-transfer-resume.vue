<template>
	<div class="w-transfer-resume">
		<c-translide immediate>
			<section v-if="model.origin" class="w-transfer-resume__info" data-testid="section-origin">
				<header class="w-transfer-resume__label" :aria-hidden="editable">
					<h2 class="text-m-medium">{{ $t('TRANSFERS.ORIGIN_ACCOUNT') }}</h2>
				</header>

				<button
					:aria-label="
						$t('TRANSFERS.EDIT_RESUME_ITEM', {
							title: $t('TRANSFERS.ORIGIN_ACCOUNT'),
							item: model.origin.alias,
						})
					"
					class="w-transfer-resume__info-button"
					@click="editSection('origin')"
					data-testid="edit-origin"
					v-if="editable"
					:disabled="disabledSections && disabledSections.includes('origin')"
					:invalid="invalidSection.includes('origin')"
				>
					<div class="w-transfer-resume__info-card">
						<div class="text-m-medium w-transfer-resume__alias">{{ model.origin.alias }}</div>
						<div class="text-s-light">
							{{ $pn(model.origin.productNumber) }}
						</div>
						<c-icon src="@icons/editPen" size="m" class="w-transfer-resume__info-icon" />
					</div>
				</button>
				<div v-else class="w-transfer-resume__info-button">
					<div class="w-transfer-resume__info-card">
						<div class="text-m-medium w-transfer-resume__alias">{{ model.origin.alias }}</div>
						<div class="text-s-light">
							{{ $pn(model.origin.productNumber) }}
						</div>
					</div>
				</div>
			</section>
		</c-translide>

		<c-translide immediate>
			<section
				v-if="model.destination"
				class="w-transfer-resume__info"
				data-testid="section-destination"
			>
				<header class="w-transfer-resume__label" :aria-hidden="editable">
					<h2 class="text-m-medium">{{ $t('TRANSFERS.DESTINATION_ACCOUNT') }}</h2>
				</header>

				<button
					:aria-label="
						$t('TRANSFERS.EDIT_RESUME_ITEM', {
							title: $t('TRANSFERS.DESTINATION_ACCOUNT'),
							item: model.destination.view.name,
						})
					"
					class="w-transfer-resume__info-button"
					@click="editSection('destination')"
					data-testid="edit-destination"
					v-if="editable"
					:disabled="disabledSections && disabledSections.includes('destination')"
					:invalid="
						invalidSection.includes('destination') ||
							invalidSection.includes('destination-duplicated')
					"
				>
					<div class="w-transfer-resume__info-card">
						<div class="text-m-medium w-transfer-resume__alias">
							{{ model.destination.view.name }}
						</div>
						<div class="text-s-light">
							{{ model.destination.view.id }}
						</div>
						<c-icon src="@icons/editPen" size="m" class="w-transfer-resume__info-icon" />
					</div>
				</button>
				<div v-else class="w-transfer-resume__info-button">
					<div class="w-transfer-resume__info-card">
						<div class="text-m-medium w-transfer-resume__alias">
							{{ model.destination.view.name }}
						</div>
						<div class="text-s-light">
							{{ model.destination.view.id }}
						</div>
					</div>
				</div>

				<button
					class="w-transfer-resume__info-button"
					data-testid="edit-beneficiary"
					v-if="
						!isPrd && editable && (disabledSections && disabledSections.includes('beneficiary'))
					"
					@click="editSection('beneficiary')"
				>
					<div class="w-transfer-resume__info-card">
						<div class="text-m-medium w-transfer-resume__alias">
							{{ $t('TRANSFERS.BENEFICIARY.TITLE') }}
						</div>
						<div class="text-s-light">
							{{ model.destination.name }}
						</div>
						<c-icon src="@icons/editPen" size="m" class="w-transfer-resume__info-icon" />
					</div>
				</button>
			</section>
		</c-translide>

		<c-translide immediate>
			<section v-if="model.amount" class="w-transfer-resume__info" data-testid="section-amount">
				<header class="w-transfer-resume__label">
					<h2 class="text-m-medium">{{ $t('TRANSFERS.AMOUNT') }}</h2>
				</header>

				<button
					:aria-label="
						$t('TRANSFERS.EDIT_RESUME_ITEM', {
							title: $t('TRANSFERS.AMOUNT'),
							item: $nc(model.amount),
						})
					"
					class="w-transfer-resume__info-button"
					@click="editSection('amount')"
					data-testid="edit-amount"
					v-if="editable"
					:disabled="disabledSections && disabledSections.includes('amount')"
					:invalid="
						invalidSection.includes('amount-balance') ||
							invalidSection.includes('amount-duplicated')
					"
				>
					<div class="w-transfer-resume__info-card --one-column">
						<div class="text-m-medium">{{ $nc(model.amount) }}</div>
						<c-icon src="@icons/editPen" size="m" class="w-transfer-resume__info-icon" />
					</div>
				</button>
				<div v-else class="w-transfer-resume__info-button">
					<div class="w-transfer-resume__info-card --one-column">
						<div class="text-m-medium">{{ $nc(model.amount) }}</div>
					</div>
				</div>

				<div
					v-if="invalidSection.includes('amount-balance')"
					class="w-transfer-resume__note text-s-medium color-text-error"
				>
					{{ $t('TRANSFERS.BALANCE_ERROR') }}
				</div>
			</section>
		</c-translide>

		<c-translide immediate>
			<section v-if="model.date" class="w-transfer-resume__info" data-testid="section-date">
				<header class="w-transfer-resume__label">
					<h2 class="text-m-medium">{{ $t('DETAIL.TRANSFER_DATE') }}</h2>
				</header>

				<button
					:aria-label="
						$t('TRANSFERS.EDIT_RESUME_ITEM', {
							title: $t('DETAIL.TRANSFER_DATE'),
							item: $d(new Date(model.date), 'numeric'),
						})
					"
					class="w-transfer-resume__info-button"
					@click="editSection('amount')"
					data-testid="edit-date"
					v-if="editable"
					:disabled="disabledSections && disabledSections.includes('date')"
					:invalid="invalidSection.includes('date')"
				>
					<div class="w-transfer-resume__info-card --one-column">
						<div class="text-m-medium">{{ humanDate }}</div>
						<c-icon src="@icons/editPen" size="m" class="w-transfer-resume__info-icon" />
					</div>
				</button>
				<div v-else class="w-transfer-resume__info-button">
					<div class="w-transfer-resume__info-card --one-column">
						<div class="text-m-medium">{{ $d(new Date(model.date), 'numeric') }}</div>
					</div>
				</div>

				<p
					data-testid="warning-date"
					class="text-s-light w-transfer-resume__note"
					v-if="model.periodicity === 'today' && model.destination.transferMode !== 'INTERNAL'"
				>
					{{ $t('TRANSFERS.DATE_WARNING') }}
				</p>
			</section>
		</c-translide>

		<c-translide immediate>
			<section
				v-if="model.frequency"
				class="w-transfer-resume__info"
				data-testid="section-max-date"
			>
				<header class="w-transfer-resume__label">
					<h2 class="text-m-medium">{{ $t('TRANSFERS.FREQUENCY') }}</h2>
				</header>

				<button
					:aria-label="
						$t('TRANSFERS.EDIT_RESUME_ITEM', {
							title: $t('TRANSFERS.FREQUENCY'),
							item: humanFrequency,
						})
					"
					class="w-transfer-resume__info-button"
					@click="editSection('amount')"
					data-testid="edit-frequency"
					v-if="editable"
					:disabled="disabledSections && disabledSections.includes('date')"
					:invalid="invalidSection.includes('frequency')"
				>
					<div class="w-transfer-resume__info-card --one-column">
						<div class="text-m-medium">{{ humanFrequency }}</div>
						<c-icon src="@icons/editPen" size="m" class="w-transfer-resume__info-icon" />
					</div>
				</button>
				<div v-else class="w-transfer-resume__info-button">
					<div class="w-transfer-resume__info-card --one-column">
						<div class="text-m-medium">{{ humanFrequency }}</div>
					</div>
				</div>
			</section>
		</c-translide>

		<c-translide immediate>
			<section v-if="model.reason" class="w-transfer-resume__info" data-testid="section-reason">
				<header class="w-transfer-resume__label">
					<h2 class="text-m-medium">{{ $t('TRANSFERS.REASON') }}</h2>
				</header>

				<button
					:aria-label="
						$t('TRANSFERS.EDIT_RESUME_ITEM', {
							title: $t('TRANSFERS.REASON'),
							item: model.reason,
						})
					"
					class="w-transfer-resume__info-button"
					@click="editSection('amount')"
					data-testid="edit-reason"
					v-if="editable"
					:disabled="disabledSections && disabledSections.includes('reason')"
					:invalid="
						invalidSection.includes('reason') || invalidSection.includes('reason-duplicated')
					"
				>
					<div class="w-transfer-resume__info-card --one-column">
						<div class="text-m-medium w-transfer-resume__reason">{{ model.reason }}</div>
						<c-icon src="@icons/editPen" size="m" class="w-transfer-resume__info-icon" />
					</div>
				</button>
				<div v-else class="w-transfer-resume__info-button">
					<div class="w-transfer-resume__info-card --one-column">
						<div class="text-m-medium w-transfer-resume__reason">{{ model.reason }}</div>
					</div>
				</div>
				<div
					v-if="invalidSection.includes('reason-duplicated')"
					class="w-transfer-resume__note text-s-medium color-text-error"
				>
					{{ $t('TRANSFERS.DUPLICATED_OPERATION.ERROR') }}
				</div>
			</section>
		</c-translide>

		<c-translide immediate>
			<section
				v-if="model.validated && model.chargeBearer"
				class="w-transfer-resume__info"
				data-testid="section-fee"
			>
				<span class="w-transfer-resume__divider" />

				<header class="w-transfer-resume__label">
					<h2 class="text-m-medium">{{ $t('TRANSFERS.OPERATION_FEES_TITLE') }}</h2>
				</header>

				<button
					:aria-label="
						$t('TRANSFERS.EDIT_RESUME_ITEM', {
							title: $t('TRANSFERS.OPERATION_FEES_TITLE'),
							item: $nc(model.fees.fee),
						})
					"
					class="w-transfer-resume__info-button"
					@click="editSection('fees')"
					data-testid="edit-fee"
					v-if="editable"
					:disabled="disabledSections && disabledSections.includes('fee')"
				>
					<div class="w-transfer-resume__info-card --one-column">
						<p class="text-m-medium">{{ $t(`TRANSFERS.FEES_DESC.${model.chargeBearer}`) }}</p>
						<c-icon src="@icons/editPen" size="m" class="w-transfer-resume__info-icon" />
						<div class="w-transfer-resume__row text-s-light" v-if="model.fees && model.fees.fee">
							<div class="w-transfer-resume__row-title">
								{{ $t('TRANSFERS.FEES').concat(':') }}
							</div>
							<div class="w-transfer-resume__row-separator" />
							<div class="w-transfer-resume__row-amount">
								{{ $nc(model.fees.fee) }}
							</div>
						</div>
						<br />
						<div
							class="w-transfer-resume__row text-s-light"
							v-if="model.fees && model.fees.expense"
						>
							<div class="w-transfer-resume__row-title">
								{{ $t('TRANSFERS.EXPENSES').concat(':') }}
							</div>
							<div class="w-transfer-resume__row-separator" />
							<div class="w-transfer-resume__row-amount">
								{{ $nc(model.fees.expense) }}
							</div>
						</div>
					</div>
				</button>
				<div v-else class="w-transfer-resume__info-button">
					<div class="w-transfer-resume__info-card">
						<div class="text-m-medium">{{ $nc(model.fees.fee) }}</div>
					</div>
				</div>
			</section>
		</c-translide>
	</div>
</template>

<script>
import CTranslide from '@components/c-translide';
import CIcon from '@components/c-icon';
import frequencyTypes from '@modules/move-money/frequency-types';

const isPrd = window?.VUE_APP_CONFIG?.env === 'prd';

export default {
	name: 'w-transfer-resume',

	components: {
		CIcon,
		CTranslide,
	},

	data() {
		return {
			isPrd,
		};
	},

	model: {
		prop: 'model',
		event: 'update:model',
	},

	props: {
		disabledSections: { type: Array },
		invalidSection: { type: Array },
		model: { type: Object, required: true },
		editable: { type: Boolean },
	},

	computed: {
		humanDate({ model: { date } }) {
			const MS_PER_DAY = 1000 * 60 * 60 * 24;
			const today = new Date();
			const date2 = new Date(date);
			const utc1 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
			const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
			const n = Math.floor((utc2 - utc1) / MS_PER_DAY);

			if (n === 0) {
				return this.$t('TRANSFERS.DATE.TODAY');
			}

			if (n === 1) {
				return this.$t('TRANSFERS.DATE.TOMORROW', { date: this.$d(date2, 'numeric') });
			}

			return this.$t('TRANSFERS.DATE.FUTURE_IN_DAYS', { date: this.$d(date2, 'numeric'), n });
		},

		humanFrequency({ model: { frequency, maxDate } }) {
			const frequencyLabel = this.$t(`TRANSFERS.FREQUENCY.${frequencyTypes[frequency].name}`);

			if (maxDate) {
				return this.$t('TRANSFERS.DATE.FREQUENCY', {
					frequency: frequencyLabel,
					date: this.$d(new Date(maxDate), 'numeric'),
				});
			}

			return frequencyLabel;
		},
	},

	methods: {
		editSection(section) {
			this.$emit('edit', section);
		},
	},
};
</script>

<style lang="scss" scoped>
.w-transfer-resume {
	display: flex;
	position: relative;
	flex-direction: column;
	height: 100%;
	flex-grow: 1;
	flex-shrink: 1;
	padding: 0 10px 10px;
}

.w-transfer-resume:not(:empty) {
	padding-bottom: 20px;
}

.w-transfer-resume__label {
	margin-left: 10px;
	margin-right: 10px;
}

.w-transfer-resume__info:not(:first-of-type) {
	margin-top: 18px;
}

.w-transfer-resume__info-button {
	appearance: none;
	background: transparent;
	border: 0;
	margin: 0;
	display: block;
	width: 100%;
	text-align: left;
	outline: none;
	position: relative;
}

.w-transfer-resume__info-button[disabled] {
	cursor: default;
}

.w-transfer-resume__info-button[disabled] .w-transfer-resume__info-icon {
	visibility: hidden;
}

.w-transfer-resume__info-button:not(:first-child) {
	margin-top: 10px;
}

.w-transfer-resume__info-card {
	display: grid;
	position: relative;
	padding: 10px;
	background-color: RGB(var(--color-surface-light));
	box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 0.3);
	border-radius: $border-radius-l;
	color: RGB(var(--color-text-primary));
	grid-template-columns: minmax(0, 1fr) 1fr fit-content(100px);
	grid-template-rows: auto;
	align-items: center;
}

.w-transfer-resume__info-button[disabled] .w-transfer-resume__info-card {
	box-shadow: none;
}

.w-transfer-resume__info-button[invalid] .w-transfer-resume__info-card {
	border: 1px solid RGB(var(--color-accent-error));
}

.w-transfer-resume__info-card.--one-column {
	grid-template-columns: 1fr fit-content(100px);
}

.w-transfer-resume__info-icon {
	grid-column-end: -1;
}

.w-transfer-resume__note {
	margin: 10px 6px 0 6px;
}

.w-transfer-resume__alias {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	margin-right: 10px;
}

.w-transfer-resume__reason {
	margin-right: 10px;
	word-break: break-word;
}

.w-transfer-resume__row {
	display: grid;
	position: relative;
	max-width: 320px;
	color: RGB(var(--color-text-primary));
	grid-template-columns: min-content 1fr min-content;
	align-items: center;
	margin-top: 10px;
}

.w-transfer-resume__row.--two-columns {
	grid-template-columns: min-content 1fr;
	margin-bottom: 20px;
}

.w-transfer-resume__row-separator {
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
	margin: 10px;
}

.w-transfer-resume__divider:not(:last-child) {
	display: flex;
	position: relative;
	height: 20px;
	margin: 0 10px;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
}
</style>
