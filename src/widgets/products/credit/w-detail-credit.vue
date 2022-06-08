<template>
	<div class="w-detail-credit">
		<div class="w-detail-credit__group">
			<c-list-icon-item
				v-if="detail.id"
				:title="$t('DETAIL.CREDIT_NUMBER')"
				:description="detail.id"
				icon="@icons/paper"
				copyable
			/>
			<c-list-icon-item
				v-if="detail.connectedAccount && detail.connectedAccount.value"
				:title="$t('DETAIL.ASSOCIATED_ACCOUNT')"
				:description="detail.connectedAccount.value"
				icon="@icons/paper"
			/>
		</div>

		<div class="w-detail-credit__group">
			<w-interveners v-if="detail.interveners" :interveners="detail.interveners" />
		</div>

		<div class="w-detail-credit__group">
			<c-list-icon-item
				v-if="detail.startDate"
				:title="$t('DETAIL.INIT_DATE')"
				:description="$d(new Date(detail.startDate), 'numeric')"
				icon="@icons/calendarArrow"
			/>
			<c-list-icon-item
				v-if="detail.reviewDate"
				:title="$t('DETAIL.CHECKING_DATE')"
				:description="$d(new Date(detail.reviewDate), 'numeric')"
				icon="@icons/calendarTime"
			/>
			<c-list-icon-item
				v-if="detail.expiryDate"
				:title="$t('DETAIL.EXPIRED_DATE')"
				:description="$d(new Date(detail.expiryDate), 'numeric')"
				icon="@icons/calendarCross"
			/>
			<c-list-icon-item
				v-if="detail.outstandingAmount"
				:title="$t('DETAIL.DISPOSED_BALANCE')"
				:description="$nc(detail.outstandingAmount)"
				icon="@icons/walletMoney"
			/>
			<c-list-icon-item
				v-if="detail.interest && detail.interest.creditorInterest"
				:title="$t('DETAIL.INTEREST_TYPE.CREDITOR')"
				:description="$n(detail.interest.creditorInterest / 100, '%')"
				icon="@icons/profitability"
			/>
			<c-list-icon-item
				v-if="detail.interest && detail.interest.debtorInterest"
				:title="$t('DETAIL.INTEREST_TYPE.DEBTOR')"
				:description="$n(detail.interest.debtorInterest / 100, '%')"
				icon="@icons/profitability"
			/>
		</div>

		<div
			v-if="detail"
			class="w-detail-credit__group"
			data-testid="profiles"
			@click="
				$router.push({
					name: 'product-profiles',
					params: { familyId: 'credit', productId: detail.productId },
				})
			"
		>
			<c-list-icon-item
				class="w-detail-credit__profiles"
				:title="this.$t('DETAIL.PROFILES.PROFILE')"
				:description="profilesDescription"
				icon="@icons/interveners"
				actionable
			>
				<ul class="w-detail-credit__profiles-list">
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
	name: 'w-detail-credit',

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
};
</script>

<style lang="scss" scoped>
.w-detail-credit__group {
	display: block;
	border-top: 1px solid RGBA(var(--color-primary-surface), 0.2);
	padding: 20px;
	--c-list-icon-item-icon-color: #{RGB(var(--color-text-secondary-light))};
}

.w-detail-credit__group:empty {
	display: none;
}

.w-detail-credit__group > *:not(:last-child) {
	margin-bottom: 15px;
}

.w-detail-credit__group:last-of-type:not(:first-of-type) {
	border-bottom: 1px solid RGBA(var(--color-primary-surface), 0.2);
}

.w-detail-credit__profiles-list {
	padding-right: 30px;
	overflow: hidden;
}

.w-detail-credit__profiles-list li:not(:last-child):after {
	content: ',';
	margin-right: 5px;
}

.w-detail-credit__profiles-list li {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
