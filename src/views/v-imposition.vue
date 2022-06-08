<template>
	<l-details>
		<h1 slot="printable-header" v-if="movement">
			<div class="text-xl-medium">
				{{ $t('OPERATION_RECEIPT').concat(' - ', $t('MOVEMENT.MODEL_NAME')) }}
			</div>
			<div class="text-l-light">{{ movement.accountName }}</div>
		</h1>

		<h2 slot="header" tabindex="-1" ref="title">
			{{
				isCanceled
					? $t('MOVEMENT.IMPOSITION_CANCELED_DETAIL')
					: $t('MOVEMENT.IMPOSITION_LIVE_DETAIL')
			}}
		</h2>

		<div class="v-imposition__header" slot="widget">
			<c-translide>
				<w-movement-sheet-deposit v-if="movement" :movement="movement" v-bind="$attrs" />
			</c-translide>
		</div>

		<div class="v-imposition__limit">
			<c-translide>
				<w-movement-detail-deposit v-if="movement" :movement="movement" v-on="$listeners" />
			</c-translide>
		</div>
	</l-details>
</template>

<script>
import { mapState } from 'vuex';
import LDetails from '@layouts/l-details';
import moduleResources from '@modules/resources/m-resources';
import WMovementSheetDeposit from '@widgets/products/deposit/w-movement-sheet-deposit';
import WMovementDetailDeposit from '@widgets/products/deposit/w-movement-detail-deposit';
import CTranslide from '@components/c-translide';

export default {
	name: 'v-imposition',

	modules: {
		resources: moduleResources,
	},

	components: {
		CTranslide,
		LDetails,
		WMovementSheetDeposit,
		WMovementDetailDeposit,
	},

	data() {
		return { movement: null };
	},

	props: {
		productId: { type: null },
		movementId: { type: null },
	},

	computed: {
		...mapState('app', ['companyId']),

		isBancofar({ companyId }) {
			return companyId === 'BF';
		},

		isCanceled({ movement }) {
			return movement?.state?.id === '00';
		},
	},

	watch: {
		productId: {
			immediate: true,
			handler(productId) {
				const { movementId: resourceId, isBancofar } = this;
				let resource = 'movements';

				/* istanbul ignore else */
				if (isBancofar) {
					resource = 'impositions';
				}

				/* istanbul ignore else */
				if (productId && resourceId) {
					this.$store
						.dispatch('resources/get', {
							resource,
							productId,
							resourceId,
							useCache: isBancofar,
						})
						.then((movement) => {
							this.movement = movement;
						})
						.catch(() => {
							this.$router.back();
						});
				}
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.v-imposition__header {
	margin-left: 20px;
	margin-right: 20px;
	max-width: 400px;
	flex-grow: 1;
	width: 100%;
}

.v-imposition__limit {
	max-width: 400px;
	margin: 0 auto;
}

@media print {
	.v-imposition__limit {
		max-width: none;
	}
}
</style>
