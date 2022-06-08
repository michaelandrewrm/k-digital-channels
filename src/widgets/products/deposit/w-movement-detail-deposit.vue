<template>
	<section>
		<div v-if="movement.state">
			<c-list-icon-item
				class="w-movement-detail-deposit__item media-screen-hide"
				v-if="movement.amount"
				:title="$t('MOVEMENT.AMOUNT')"
				:description="$nc(movement.amount)"
				icon="@icons/walletMoney"
			/>

			<c-list-icon-item
				class="w-movement-detail-deposit__item media-screen-hide"
				v-if="movement.reason"
				:title="$t('TRANSFERS.REASON')"
				:description="movement.reason"
				icon="@icons/paper"
			/>

			<c-list-icon-item
				class="w-movement-detail-deposit__item media-screen-hide"
				v-if="movement.typeInterest"
				:title="$t('DETAIL.INTEREST_TYPE')"
				:description="movement.typeInterest"
				icon="@icons/paper"
			/>

			<c-list-icon-item
				class="w-movement-detail-deposit__item media-screen-hide"
				v-if="movement.balance"
				:title="$t('MOVEMENT.BALANCE')"
				:description="movement.balance"
				icon="@icons/paper"
			/>

			<c-list-icon-item
				class="w-movement-detail-deposit__item"
				v-if="movement.creationDate"
				:title="$t('MOVEMENT.CREATION_DATE')"
				:description="$d(new Date(movement.creationDate), 'numeric')"
				icon="@icons/calendarForward"
			/>

			<c-list-icon-item
				class="w-movement-detail-deposit__item"
				v-if="movement.nextDate && movement.autoRenewal"
				:title="$t('MOVEMENT.NEXT_DATE')"
				:description="$d(new Date(movement.nextDate), 'numeric')"
				icon="@icons/calendarArrow"
			/>

			<c-list-icon-item
				class="w-movement-detail-deposit__item"
				v-if="movement.expirationDate"
				:title="isCanceled ? $t('MOVEMENT.CANCELED_DATE') : $t('MOVEMENT.EXPIRATION_DATE')"
				:description="$d(new Date(movement.expirationDate), 'numeric')"
				icon="@icons/calendarCross"
			/>

			<hr class="w-movement-detail-deposit__separator media-print-hide" />

			<c-list-icon-item
				class="w-movement-detail-deposit__item"
				:title="$t('MOVEMENT.RENEWAL')"
				:description="
					movement.autoRenewal ? $t('MOVEMENT.RENEWAL_AUTO') : $t('MOVEMENT.RENEWAL_MANUAL')
				"
				icon="@icons/renewal"
			/>

			<hr class="w-movement-detail-deposit__separator media-print-hide" />

			<c-list-icon-item
				class="w-movement-detail-deposit__item"
				v-if="movement.countableBalance"
				:title="$t('MOVEMENT.COUNTABLE_BALANCE')"
				:description="$nc(movement.countableBalance)"
				icon="@icons/wallet"
			/>

			<c-list-icon-item
				class="w-movement-detail-deposit__item"
				v-if="movement.availableBalance"
				:title="$t('MOVEMENT.AVAILABLE_BALANCE')"
				:description="$nc(movement.availableBalance)"
				icon="@icons/walletMoney"
			/>
		</div>
		<div v-else>
			<c-list-icon-item
				class="w-movement-detail-deposit__item"
				v-if="movement.id"
				:title="$t('MOVEMENT.ID')"
				:description="movement.id"
				icon="@icons/paper"
			/>

			<c-list-icon-item
				class="w-movement-detail-deposit__item media-screen-hide"
				v-if="movement.amount"
				:title="$t('MOVEMENT.AMOUNT')"
				:description="$nc(movement.amount)"
				icon="@icons/walletMoney"
			/>

			<c-list-icon-item
				class="w-movement-detail-deposit__item media-screen-hide"
				v-if="movement.reason"
				:title="$t('TRANSFERS.REASON')"
				:description="movement.reason"
				icon="@icons/paper"
			/>

			<c-list-icon-item
				class="w-movement-detail-deposit__item"
				v-if="movement.operationDate"
				:title="$t('MOVEMENT.OPERATION_DATE')"
				:description="$d(new Date(movement.operationDate), 'numeric')"
				icon="@icons/calendar"
			/>

			<c-list-icon-item
				class="w-movement-detail-deposit__item"
				v-if="movement.valueDate"
				:title="$t('MOVEMENT.VALUE_DATE')"
				:description="$d(new Date(movement.valueDate), 'numeric')"
				icon="@icons/calendarTime"
			/>

			<c-list-icon-item
				class="w-movement-detail-deposit__item"
				v-if="movement.type"
				:title="$t('MOVEMENT.TYPE')"
				:description="movement.type.name"
				icon="@icons/paper"
			/>
		</div>
	</section>
</template>

<script>
import CListIconItem from '@components/c-list-icon-item';

export default {
	name: 'w-movement-detail-deposit',

	components: {
		CListIconItem,
	},

	props: {
		movement: { type: Object },
	},

	computed: {
		isCanceled({ movement }) {
			return movement?.state?.id === '00';
		},
	},
};
</script>

<style lang="scss" scoped>
.w-movement-detail-deposit__separator:not(:last-child),
.w-movement-detail-deposit__item:not(:last-child) {
	margin-bottom: 18px;
}

.w-movement-detail-deposit__separator {
	border: 0;
	height: 1px;
	background-color: RGBA(var(--color-text-primary), 0.15);
}
</style>
