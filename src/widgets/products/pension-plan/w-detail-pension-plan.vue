<template>
	<div class="w-detail-pension-plan">
		<div class="w-detail-pension-plan__group">
			<w-interveners v-if="detail.interveners" :interveners="detail.interveners" />

			<c-list-icon-item
				v-if="detail.createDate"
				:title="$t('DETAIL.CONTRACT_DATE')"
				:description="$d(new Date(detail.createDate), 'numeric')"
				icon="@icons/calendarArrow"
			/>
		</div>

		<div class="w-detail-pension-plan__group">
			<c-list-icon-item
				v-if="detail.unityQuantity"
				:title="$t('DETAIL.ACCOUNT_UNIT')"
				:description="$n(detail.unityQuantity)"
				icon="@icons/accountUnit"
			/>

			<c-list-icon-item
				v-if="detail.unityValue"
				:title="$t('DETAIL.VALUE_ACCOUNT_UNIT')"
				:description="$nc(detail.unityValue, { minimumFractionDigits: 9 })"
				icon="@icons/valueAccountUnit"
			/>

			<c-list-icon-item
				v-if="detail.netAssetValue"
				:title="$t('DETAIL.NET_ASSET_VALUE')"
				:description="$nc(detail.netAssetValue)"
				icon="@icons/walletMoney"
			/>

			<c-list-icon-item
				v-if="detail.netAssetDate"
				:title="$t('DETAIL.NET_ASSET_DATE')"
				:description="$d(new Date(detail.netAssetDate), 'numeric')"
				icon="@icons/calendar"
			/>

			<c-list-icon-item
				v-if="detail.balanceContributed"
				:title="$t('DETAIL.PAY_DURING_YEAR')"
				:description="$nc(detail.balanceContributed)"
				icon="@icons/inputMoney"
			/>
		</div>

		<p class="w-detail-pension-plan__product-profitability text-m-medium">
			{{ $t('DETAIL.PRODUCT_PROFITABILITY') }}
		</p>

		<div class="w-detail-pension-plan__group">
			<c-list-icon-item
				v-if="detail.costEffectivenessYear"
				:title="$t('DETAIL.CURRENT_YEAR')"
				:description="$n(detail.costEffectivenessYear / 100, '%')"
				icon="@icons/calendar"
			/>

			<c-list-icon-item
				v-if="detail.costEffectivenessPeriod"
				:title="$t('DETAIL.LAST_12_MONTH')"
				:description="$n(detail.costEffectivenessPeriod / 100, '%')"
				icon="@icons/calendarTime"
			/>
		</div>

		<div
			v-if="detail"
			class="w-detail-pension-plan__group"
			data-testid="profiles"
			@click="
				$router.push({
					name: 'product-profiles',
					params: { familyId: detail.productFamily, productId: detail.productId },
				})
			"
		>
			<c-list-icon-item
				class="w-detail-pension-plan__profiles"
				:title="this.$t('DETAIL.PROFILES.PROFILE')"
				:description="profilesDescription"
				icon="@icons/interveners"
				actionable
			>
				<ul class="w-detail-pension-plan__profiles-list">
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
	name: 'w-detail-pension-plan',

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
.w-detail-pension-plan__group {
	display: block;
	border-top: 1px solid RGBA(var(--color-primary-surface), 0.2);
	padding: 20px;
	--c-list-icon-item-icon-color: #{RGB(var(--color-text-secondary-light))};
}

.w-detail-pension-plan__group:empty {
	display: none;
}

.w-detail-pension-plan__group > *:not(:last-child) {
	margin-bottom: 15px;
}

.w-detail-pension-plan__product-profitability {
	padding-bottom: 8px;
}

.w-detail-pension-plan__group:last-of-type:not(:first-of-type) {
	border-bottom: 1px solid RGBA(var(--color-primary-surface), 0.2);
}

.w-detail-pension-plan__profiles-list {
	padding-right: 30px;
	overflow: hidden;
}

.w-detail-pension-plan__profiles-list li:not(:last-child):after {
	content: ',';
	margin-right: 5px;
}

.w-detail-pension-plan__profiles-list li {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
