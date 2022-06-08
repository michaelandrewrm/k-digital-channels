<template>
	<div class="w-detail-account">
		<div class="w-detail-account__group">
			<w-interveners v-if="detail.interveners" :interveners="detail.interveners" />
		</div>

		<div class="w-detail-account__group">
			<c-list-icon-item
				v-if="detail.productNumber"
				:title="$t('DETAIL.IBAN')"
				:description="$pn(detail.productNumber, 'format')"
				icon="@icons/wallet"
				copyable
			/>

			<c-list-icon-item
				v-if="detail.bic"
				:title="$t('DETAIL.BIC')"
				:description="detail.bic"
				icon="@icons/paper"
				copyable
			/>
		</div>

		<div class="w-detail-account__group">
			<c-list-icon-item
				v-if="detail.openingDate"
				:title="$t('DETAIL.DATE_APERTURE')"
				:description="$d(new Date(detail.openingDate), 'numeric')"
				icon="@icons/calendar"
			/>

			<c-list-icon-item
				v-if="detail.lastMovementDate"
				:title="$t('DETAIL.DATE_LAST_MOVEMENT')"
				:description="$d(new Date(detail.lastMovementDate), 'numeric')"
				icon="@icons/calendarTime"
			/>
		</div>

		<div
			v-if="detail && !detail.isNotProfileAllow"
			class="w-detail-account__group"
			data-testid="profiles"
			@click="
				$router.push({
					name: 'product-profiles',
					params: { familyId: detail.productFamily, productId: detail.productId },
				})
			"
		>
			<c-list-icon-item
				class="w-detail-account__profiles"
				:title="this.$t('DETAIL.PROFILES.PROFILE')"
				:description="profilesDescription"
				icon="@icons/interveners"
				actionable
			>
				<ul class="w-detail-account__profiles-list">
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
	name: 'w-detail-account',

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
.w-detail-account__group {
	border-top: 1px solid RGBA(var(--color-primary-surface), 0.2);
	padding: 20px;
	--c-list-icon-item-icon-color: #{RGB(var(--color-text-secondary-light))};
}

.w-detail-account__group:empty {
	display: none;
}

.w-detail-account__group > *:not(:last-child) {
	margin-bottom: 15px;
}

.w-detail-account__group:last-of-type:not(:first-of-type) {
	border-bottom: 1px solid RGBA(var(--color-primary-surface), 0.2);
}

.w-detail-account__profiles-list {
	padding-right: 30px;
	overflow: hidden;
}

.w-detail-account__profiles-list li:not(:last-child):after {
	content: ',';
	margin-right: 5px;
}

.w-detail-account__profiles-list li {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
