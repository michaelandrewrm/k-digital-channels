<template>
	<div class="w-detail-endorsement">
		<div class="w-detail-endorsement__group">
			<w-interveners v-if="detail.interveners" :interveners="detail.interveners" />
		</div>

		<div class="w-detail-endorsement__group">
			<c-list-icon-item
				v-if="detail.guarantyId"
				:title="$t('DETAIL.ENDORSEMENT_NUMBER')"
				:description="detail.guarantyId"
				icon="@icons/paper"
				copyable
			/>
			<c-list-icon-item
				v-if="detail.productNumber && detail.productNumber.value"
				:title="$t('DETAIL.ENDORSEMENT_ACCOUNT')"
				:description="detail.productNumber.value"
				icon="@icons/paper"
			/>
			<c-list-icon-item
				v-if="detail.connectedAccount && detail.connectedAccount.value"
				:title="$t('DETAIL.ASSOCIATED_ACCOUNT')"
				:description="detail.connectedAccount.value"
				icon="@icons/paper"
			/>
		</div>

		<div class="w-detail-endorsement__group">
			<c-list-icon-item
				v-if="detail.startDate"
				:title="$t('DETAIL.DATE_APERTURE')"
				:description="$d(new Date(detail.startDate), 'numeric')"
				icon="@icons/calendarArrow"
			/>
			<c-list-icon-item
				v-if="detail.endDate"
				:title="$t('DETAIL.CANCELED_DATE')"
				:description="$d(new Date(detail.endDate), 'numeric')"
				icon="@icons/calendarCross"
			/>
			<c-list-icon-item
				v-if="detail.expiryDate"
				:title="$t('DETAIL.EXPIRED_DATE')"
				:description="$d(new Date(detail.expiryDate), 'numeric')"
				icon="@icons/calendarCross"
			/>
		</div>
	</div>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';
import WInterveners from '@widgets/w-interveners';

export default {
	name: 'w-detail-endorsement',

	props: { detail: { type: null } },

	components: { WInterveners, CListIconItem },
};
</script>

<style lang="scss" scoped>
.w-detail-endorsement__group {
	display: block;
	border-top: 1px solid RGBA(var(--color-primary-surface), 0.2);
	padding: 20px;
	--c-list-icon-item-icon-color: #{RGB(var(--color-text-secondary-light))};
}

.w-detail-endorsement__group:empty {
	display: none;
}

.w-detail-endorsement__group > *:not(:last-child) {
	margin-bottom: 15px;
}
</style>
