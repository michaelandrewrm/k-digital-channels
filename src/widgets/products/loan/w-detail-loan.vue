<template>
	<div class="w-detail-loan">
		<div class="w-detail-loan__group">
			<w-interveners v-if="detail.interveners" :interveners="detail.interveners" />
		</div>

		<div class="w-detail-loan__group">
			<c-list-icon-item
				v-if="detail.productNumber"
				:title="$t('DETAIL.CONTRACT_NUMBER')"
				:description="$pn(detail.productNumber, 'format')"
				icon="@icons/paper"
				copyable
			/>
		</div>

		<div class="w-detail-loan__group">
			<c-list-icon-item
				v-if="detail.interest && detail.interest.interestRate"
				:title="$t('DETAIL.INTEREST_TYPE_01')"
				:description="$n(detail.interest.interestRate / 100, '%')"
				icon="@icons/profitability"
			/>
		</div>

		<div class="w-detail-loan__group">
			<c-list-icon-item
				v-if="detail.startDate"
				:title="$t('DETAIL.INIT_DATE')"
				:description="$d(new Date(detail.startDate), 'numeric')"
				icon="@icons/calendar"
			/>
			<c-list-icon-item
				v-if="detail.expiryDate"
				:title="$t('DETAIL.EXPIRED_DATE')"
				:description="$d(new Date(detail.expiryDate), 'numeric')"
				icon="@icons/calendarCross"
			/>
			<c-list-icon-item
				v-if="detail.nextReviewDate"
				:title="$t('DETAIL.CHECKING_DATE')"
				:description="$d(new Date(detail.nextReviewDate), 'numeric')"
				icon="@icons/calendarForward"
			/>
		</div>

		<div class="w-detail-loan__group">
			<c-list-icon-item
				v-if="detail.nextPaymentAmount"
				:title="$t('DETAIL.NEXT_FEE')"
				:description="
					`${$nc(detail.nextPaymentAmount)} | ${$d(new Date(detail.nextPaymentDate), 'numeric')}`
				"
				icon="@icons/calendarArrow"
			/>

			<a data-testid="show-repayments-link" @click.prevent="showRepayments">
				<c-list-icon-item :title="$t('DETAIL.SHOW_AMORTIZATION_TABLE')" icon="@icons/document" />
			</a>
		</div>

		<div class="w-detail-loan__group">
			<c-list-icon-item
				v-if="detail.startAmount"
				:title="$t('DETAIL.START_AMOUNT')"
				:description="$nc(detail.startAmount)"
				icon="@icons/wallet"
			/>
			<c-list-icon-item
				v-if="detail.installmentAmount"
				:title="$t('DETAIL.INSTALLMENT_AMOUNT')"
				:description="$nc(detail.installmentAmount)"
				icon="@icons/valueAccountUnit"
			/>
			<c-list-icon-item
				v-if="detail.pendingAmount"
				:title="$t('DETAIL.PENDING_AMOUNT')"
				:description="$nc(detail.pendingAmount, { absolute: true })"
				icon="@icons/valueAccountUnit"
			/>
		</div>

		<div
			v-if="detail"
			class="w-detail-loan__group"
			data-testid="profiles"
			@click="
				$router.push({
					name: 'product-profiles',
					params: { familyId: detail.productFamily, productId: detail.productId },
				})
			"
		>
			<c-list-icon-item
				class="w-detail-loan__profiles"
				:title="this.$t('DETAIL.PROFILES.PROFILE')"
				:description="profilesDescription"
				icon="@icons/interveners"
				actionable
			>
				<ul class="w-detail-loan__profiles-list">
					<li v-for="(description, id) in profilesDescription" :key="id">
						{{ description }}
					</li>
				</ul>
			</c-list-icon-item>
		</div>
	</div>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';
import WInterveners from '@widgets/w-interveners';

export default {
	name: 'w-detail-loan',

	props: { detail: Object },

	components: { WInterveners, CListIconItem },

	computed: {
		/* istanbul ignore next */
		profilesDescription({ detail }) {
			if (!detail?.profiles?.length) {
				return [this.$t('DETAIL.PROFILES.NO_PROFILE')];
			}

			return detail?.profiles?.map(({ name }) => name);
		},
	},

	methods: {
		showRepayments() {
			this.$emit('close');
			this.$router.push({
				name: 'amortization-table',
				params: { productId: this.detail.id, familyId: 'loan' },
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.w-detail-loan__group {
	display: block;
	border-top: 1px solid RGBA(var(--color-primary-surface), 0.2);
	padding: 20px;
	--c-list-icon-item-icon-color: #{RGB(var(--color-text-secondary-light))};
}

.w-detail-loan__group:empty {
	display: none;
}

.w-detail-loan__group > *:not(:last-child) {
	margin-bottom: 15px;
}

.w-detail-loan__group:last-of-type:not(:first-of-type) {
	border-bottom: 1px solid RGBA(var(--color-primary-surface), 0.2);
}

.w-detail-loan__profiles-list {
	padding-right: 30px;
	overflow: hidden;
}

.w-detail-loan__profiles-list li:not(:last-child):after {
	content: ',';
	margin-right: 5px;
}

.w-detail-loan__profiles-list li {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
