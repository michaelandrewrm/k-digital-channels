<template>
	<l-details>
		<h1 slot="header" tabindex="-1">{{ $t('LOAN.RECEIPTS.TITLE') }}</h1>

		<c-translide slot="widget">
			<c-slider v-if="receipts" class="v-receipts-table__slider">
				<c-acrylic-sheet class="v-receipts-table__sheet" theme="dark">
					<c-icon
						src="@icons/modalExclamation"
						size=""
						slot="icon"
						class="v-receipts-table__sheet-icon"
					/>
					<span class="v-receipts-table__sheet-title text-fixed-m-medium">
						{{ $t('LOAN.RECEIPTS.ALIAS') }}
					</span>
					<span class="v-receipts-table__sheet-balance text-fixed-l-bold" data-testid="total">
						{{ $nc(totalDelay) }}
					</span>
				</c-acrylic-sheet>
			</c-slider>
		</c-translide>

		<div class="v-receipts-table__content">
			<w-product-resource-list
				v-if="receipts"
				resource="receipt"
				type="loan"
				:product-id="productId"
			/>
		</div>
	</l-details>
</template>

<script>
import LDetails from '@layouts/l-details';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';
import CTranslide from '@components/c-translide';
import CSlider from '@components/c-slider';
import moduleResources from '@modules/resources/m-resources';
import WProductResourceList from '@widgets/w-product-resource-list';
import sumAmounts from '@modules/products/product-sum-amounts';

export default {
	name: 'v-receipts-table',

	modules: { resources: moduleResources },

	components: {
		LDetails,
		CAcrylicSheet,
		CIcon,
		CTranslide,
		CSlider,
		WProductResourceList,
	},

	props: {
		productId: { type: String },
	},

	data() {
		return {
			receipts: null,
		};
	},

	computed: {
		totalDelay({ receipts }) {
			/* istanbul ignore next */
			if (!receipts) {
				return;
			}

			return sumAmounts(receipts, 'pendingAmount');
		},
	},

	watch: {
		productId: {
			immediate: true,
			async handler(productId) {
				/* istanbul ignore next */
				if (!productId) {
					return;
				}

				const response = await this.$store.dispatch('resources/fetch', {
					resource: 'receipts',
					productId,
				});

				this.receipts = response.data;
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.v-receipts-table__sheet {
	width: 300px;
}

.v-receipts-table__sheet-icon {
	color: RGB(var(--color-accent-error));
}

.v-receipts-table__sheet-title {
	margin-bottom: 10px;
	margin-right: 30px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.v-receipts-table__sheet-balance {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}

.v-receipts-table__view-more-receipts {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 40px 0;
}

.v-receipts-table__view-more-receipts-icon {
	margin-right: 20px;
}

.v-receipts-table__error {
	text-align: center;
	margin: 10px 0;
}

.v-receipts-table__error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}

.v-receipts-table__error-link {
	text-decoration: underline;
	display: block;
}
</style>
