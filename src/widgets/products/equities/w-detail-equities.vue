<template>
	<div class="w-detail-equities">
		<div class="w-detail-equities__group">
			<w-interveners v-if="detail.interveners" :interveners="detail.interveners" />

			<c-list-icon-item
				v-if="detail.connectedAccount && detail.connectedAccount.value"
				:title="$t('DETAIL.ASSOCIATED_ACCOUNT')"
				:description="$pn(detail.connectedAccount, 'format')"
				icon="@icons/wallet"
				copyable
			/>
		</div>

		<div class="w-detail-equities__group">
			<c-list-icon-item
				v-if="detail.createDate"
				:title="$t('DETAIL.DATE_APERTURE')"
				:description="$d(new Date(detail.createDate), 'numeric')"
				icon="@icons/calendar"
			/>

			<c-list-icon-item
				v-if="detail.lastValueDate"
				:title="$t('DETAIL.LAST_VALUE_DATE')"
				:description="$d(new Date(detail.lastValueDate), 'numeric')"
				icon="@icons/calendarTime"
			/>

			<c-list-icon-item
				v-if="detail.totalValue"
				:title="$t('DETAIL.NET_ASSET_VALUE')"
				:description="$nc(detail.totalValue)"
				icon="@icons/walletMoney"
			/>
		</div>

		<div
			v-if="detail"
			class="w-detail-equities__group"
			data-testid="profiles"
			@click="
				$router.push({
					name: 'product-profiles',
					params: { familyId: detail.productFamily, productId: detail.productId },
				})
			"
		>
			<c-list-icon-item
				class="w-detail-equities__profiles"
				:title="this.$t('DETAIL.PROFILES.PROFILE')"
				:description="profilesDescription"
				icon="@icons/interveners"
				actionable
			>
				<ul class="w-detail-equities__profiles-list">
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
	name: 'w-detail-equities',

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
.w-detail-equities__group {
	display: block;
	border-top: 1px solid RGBA(var(--color-primary-surface), 0.2);
	padding: 20px;
	--c-list-icon-item-icon-color: #{RGB(var(--color-text-secondary-light))};
}

.w-detail-equities__group:empty {
	display: none;
}

.w-detail-equities__group > *:not(:last-child) {
	margin-bottom: 15px;
}

.w-detail-equities__group:last-of-type:not(:first-of-type) {
	border-bottom: 1px solid RGBA(var(--color-primary-surface), 0.2);
}

.w-detail-equities__profiles-list {
	padding-right: 30px;
	overflow: hidden;
}

.w-detail-equities__profiles-list li:not(:last-child):after {
	content: ',';
	margin-right: 5px;
}

.w-detail-equities__profiles-list li {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
