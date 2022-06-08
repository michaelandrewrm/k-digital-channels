<template>
	<div class="w-product-loan">
		<div class="w-product-loan__wrapper">
			<c-acrylic-sheet :actionable="active" @expand="$emit('expand')">
				<c-icon src="@icons/productLoans" size="" slot="icon" />

				<span class="w-product-loan__title text-fixed-m-medium">
					{{ product.alias }}
				</span>

				<span class="w-product-loan__balance text-fixed-l-bold">
					{{ $nc(product.balance, { absolute: true }) }}
				</span>

				<span class="w-product-loan__status text-fixed-s-medium">
					{{ $t('DETAIL.PENDING') }}
				</span>

				<!-- <span
                v-if="product.nextPaymentAmount && product.nextPaymentDate"
                class="w-product-loan__next-payment text-fixed-s-medium"
            >
                {{
                    $t('LOAN.NEXT_FEE', {
                        amount: $nc(product.nextPaymentAmount),
                        date: product.nextPaymentDate,
                    })
                }}
            </span> -->

				<span class="w-product-loan__number text-fixed-s-medium">
					{{ $pn(product.productNumber) }}
				</span>
			</c-acrylic-sheet>
		</div>

		<c-translide>
			<router-link
				:to="{
					name: 'receipts-table',
					params: { familyId: type, productId: product.id },
				}"
				v-if="hasPendingFees && active && areReceiptsChecked"
				class="w-product-loan__pending-fees"
				data-testid="pending-fees"
			>
				<c-alert :amount="$nc(totalDelay)">
					{{ $t('LOAN.RECEIPTS.TITLE') }}
				</c-alert>
			</router-link>

			<c-progress-detail
				v-else-if="!hasPendingFees && active && areReceiptsChecked"
				class="w-product-loan__progress"
				:from="product.postedBalance.amount + product.balance.amount"
				:to="product.postedBalance.amount"
				data-testid="progress-bar"
			>
				<dl slot="from">
					<dt class="text-m-medium">
						{{
							$nc({
								amount: product.balance.amount + product.postedBalance.amount,
								currency: product.balance.currency,
							})
						}}
					</dt>
					<dd class="text-s-light">{{ $t('DETAIL.INSTALLMENT_AMOUNT') }}</dd>
				</dl>
				<dl slot="to">
					<dt class="text-m-medium">
						{{ $nc(product.postedBalance) }}
					</dt>
					<dd class="text-s-light">{{ $t('DETAIL.TOTAL') }}</dd>
				</dl>
			</c-progress-detail>
		</c-translide>
	</div>
</template>

<script>
import CTranslide from '@components/c-translide';
import CProgressDetail from '@components/c-progress-detail';
import CIcon from '@components/c-icon';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CAlert from '@components/c-alert';
import moduleResources from '@modules/resources/m-resources';
import sumAmounts from '@modules/products/product-sum-amounts';

export default {
	name: 'w-product-loan',

	modules: { resources: moduleResources },

	components: {
		CAcrylicSheet,
		CIcon,
		CTranslide,
		CProgressDetail,
		CAlert,
	},

	props: {
		product: { type: Object },
		active: { type: Boolean },
		type: { type: String },
	},

	data() {
		return {
			receipts: null,
			areReceiptsChecked: false,
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

		hasPendingFees({ receipts }) {
			return receipts?.length > 0;
		},
	},

	watch: {
		product: {
			immediate: true,
			async handler(product) {
				/* istanbul ignore else */
				if (product?.id) {
					const response = await this.$store.dispatch('resources/fetch', {
						resource: 'receipts',
						productId: product.id,
					});
					this.receipts = response.data;
					this.areReceiptsChecked = true;
				}
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.w-product-loan {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.w-product-loan__wrapper {
	width: 300px;
	margin: 0 auto;
}

.w-product-loan__title {
	margin-bottom: 10px;
	margin-right: 30px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.w-product-loan__balance {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}

.w-product-loan__number {
	display: flex;
	align-items: flex-end;
}

.w-product-loan__status {
	margin-bottom: 20px;
}

// .w-product-loan__next-payment {
// 	margin-bottom: 8px;
// }

.w-product-loan__progress {
	margin: 20px auto 0;
	color: RGB(var(--color-text-primary));
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	min-width: 100%;
}

.w-product-loan__pending-fees {
	width: 100vw;
	padding: 0 20px;
	display: block;
	max-width: 400px;
	margin-top: 20px;
}

.w-product-loan__pending-fees:hover {
	text-decoration: none;
}
</style>
