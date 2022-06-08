<template>
	<l-details>
		<h1 slot="header" tabindex="-1">{{ $t('DETAIL.AMORTIZATION_TABLE') }}</h1>

		<div class="v-amortization-table__header" slot="widget" v-if="totalInstallment">
			<c-acrylic-sheet theme="dark">
				<c-icon src="@icons/document" size="" slot="icon" />

				<span class="v-amortization-table__reason text-fixed-m-medium">
					{{ $t('DETAIL.TOTAL_PENDING_AMOUNT') }}
				</span>

				<span class="text-fixed-l-bold">
					{{ $nc(totalInstallment) }}
				</span>
			</c-acrylic-sheet>
		</div>

		<section>
			<div
				class="v-amortization-table__container"
				v-for="installment in installments"
				:key="installment.number"
				data-testid="installments"
			>
				<span class="v-amortization-table__title text-m-medium">
					{{ $t('DETAIL.INSTALLMENTS_NUMBER', { n: installment.number }) }}
				</span>
				<span class="v-amortization-table__amount text-l-medium">
					{{ $nc(installment.amount) }}
				</span>
				<span class="v-amortization-table__date text-s-light">
					{{ $d(new Date(installment.date), 'numeric') }}
				</span>
				<span class="v-amortization-table__installment text-s-light">
					{{ $t('DETAIL.AMORTIZED_CAPITAL') }} {{ $nc(installment.installment) }}
				</span>
				<span class="v-amortization-table__pending text-s-light">
					{{ $t('DETAIL.PENDING_CAPITAL') }} {{ $nc(installment.pendingAmount) }}
				</span>
				<span class="v-amortization-table__interest text-s-light">
					{{ $t('DETAIL.INTERESTS') }} {{ $nc(installment.interest) }}
				</span>
			</div>
		</section>
	</l-details>
</template>

<script>
import LDetails from '@layouts/l-details';
import moduleRepayments from '@modules/products/m-repayments';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import CIcon from '@components/c-icon';

export default {
	name: 'v-amortization-table',

	modules: {
		repayments: moduleRepayments,
	},

	components: {
		LDetails,
		CAcrylicSheet,
		CIcon,
	},

	data() {
		return {
			installments: null,
			tae: null,
			totalAmount: null,
			totalInterest: null,
			totalInstallment: null,
		};
	},

	props: {
		productId: {
			type: null,
		},
	},

	watch: {
		productId: {
			immediate: true,
			async handler(productId) {
				/* istanbul ignore else */
				if (productId) {
					this.$store.dispatch('repayments/get', productId).then((data) => {
						this.installments = data.elements;
						this.tae = data.tae;
						this.totalAmount = data.totalAmount;
						this.totalInterest = data.totalInterest;
						this.totalInstallment = data.totalInstallment;
					});
				}
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.v-amortization-table__header {
	width: 300px;
}

.v-amortization-table__reason {
	margin-bottom: 10px;
}

.v-amortization-table__container {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content min-content min-content;
	grid-gap: 10px;
	padding: 10px 0;
}

.v-amortization-table__container:not(:last-of-type) {
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.2);
}

.v-amortization-table__amount,
.v-amortization-table__installment,
.v-amortization-table__interest {
	text-align: right;
	white-space: nowrap;
}

.v-amortization-table__title {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
