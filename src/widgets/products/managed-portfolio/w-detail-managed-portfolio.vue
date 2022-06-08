<template>
	<div class="w-detail-managed-portfolio">
		<div class="w-detail-managed-portfolio__group">
			<c-list-icon-item
				v-if="detail.productNumber"
				:title="$t('DETAIL.MANAGED_ACCOUNT_NUMBER')"
				:description="$pn(detail.productNumber, 'format')"
				icon="@icons/wallet"
			/>
		</div>

		<div class="w-detail-managed-portfolio__group">
			<w-interveners v-if="detail.productNumber" :interveners="detail.interveners" />
		</div>

		<div class="w-detail-managed-portfolio__group">
			<c-list-icon-item
				v-if="detail.createDate"
				:title="$t('DETAIL.DATE_APERTURE')"
				:description="$d(new Date(detail.createDate), 'numeric')"
				icon="@icons/calendarArrow"
			/>
		</div>

		<div
			v-if="detail"
			class="w-detail-managed-portfolio__group"
			data-testid="profiles"
			@click="
				$router.push({
					name: 'product-profiles',
					params: { familyId: 'managed-portfolio', productId: detail.productId },
				})
			"
		>
			<c-list-icon-item
				class="w-detail-managed-portfolio__profiles"
				:title="this.$t('DETAIL.PROFILES.PROFILE')"
				:description="profilesDescription"
				icon="@icons/interveners"
				actionable
			>
				<ul class="w-detail-managed-portfolio__profiles-list">
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
	name: 'w-detail-managed-portfolio',

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
.w-detail-managed-portfolio__group {
	display: block;
	border-top: 1px solid RGBA(var(--color-primary-surface), 0.2);
	padding: 20px;
	--c-list-icon-item-icon-color: #{RGB(var(--color-text-secondary-light))};
}

.w-detail-managed-portfolio__group:empty {
	display: none;
}

.w-detail-managed-portfolio__group > *:not(:last-child) {
	margin-bottom: 15px;
}

.w-detail-managed-portfolio__product-profitability {
	padding-bottom: 8px;
}

.w-detail-managed-portfolio__group:last-of-type:not(:first-of-type) {
	border-bottom: 1px solid RGBA(var(--color-primary-surface), 0.2);
}

.w-detail-managed-portfolio__profiles-list {
	padding-right: 30px;
	overflow: hidden;
}

.w-detail-managed-portfolio__profiles-list li:not(:last-child):after {
	content: ',';
	margin-right: 5px;
}

.w-detail-managed-portfolio__profiles-list li {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
