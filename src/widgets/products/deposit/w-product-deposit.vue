<template>
	<div class="w-product-deposit">
		<c-acrylic-sheet :actionable="active" @expand="$emit('expand')">
			<c-icon src="@icons/productDeposit" size="" slot="icon" />

			<span class="w-product-deposit__title text-fixed-m-medium" v-if="product.alias">
				{{ product.alias }}
			</span>
			<span class="w-product-deposit__balance text-fixed-l-bold" v-if="product.balance">
				{{ $nc(product.balance) }}
			</span>
			<span
				class="w-product-deposit__subtitle text-fixed-s-medium"
				v-if="product.productNumber"
				aria-hidden="true"
			>
				{{ $pn(product.productNumber) }}
			</span>
			<span class="a11y-hide">
				{{ $t('PRODUCT_NUMBER_ENDED_IN', { productNumber: product.productNumber.value }) }}
			</span>

			<div
				slot="footer"
				class="w-product-deposit__footer"
				:tabindex="active - 1"
				data-testid="info-icon"
				@click="openAvailableBalanceInfo"
				@keypress.enter="openAvailableBalanceInfo"
				v-if="isDemandDeposit && product.postedBalance && product.postedBalance.amount"
			>
				<div class="w-product-deposit__available-balance">
					<span class="text-m-book">
						{{ $t('MY_PRODUCT.DEPOSIT.AVAILABLE_BALANCE').concat(':') }}
					</span>
					<span class="text-m-medium">
						{{ $nc(product.postedBalance) }}
					</span>
					<c-icon src="@icons/info" size="l" />
				</div>
			</div>
		</c-acrylic-sheet>
	</div>
</template>

<script>
import CIcon from '@components/c-icon';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import MAvailableBalance from '@modals/m-available-balance';

export default {
	name: 'w-product-deposit',

	components: {
		CAcrylicSheet,
		CIcon,
	},

	props: {
		product: { type: Object },
		active: { type: Boolean },
	},

	computed: {
		isDemandDeposit({ product }) {
			return product && product.productSubtype.id === '09';
		},
	},

	methods: {
		openAvailableBalanceInfo() {
			return this.$store.dispatch('modal/open', MAvailableBalance);
		},
	},
};
</script>

<style lang="scss" scoped>
.w-product-deposit {
	width: 300px;
}

.w-product-deposit__title {
	margin-bottom: 10px;
	margin-right: 30px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.w-product-deposit__balance {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}

.w-product-deposit__subtitle {
	display: flex;
	align-items: flex-end;
}

.w-product-deposit__footer {
	position: relative;
	padding: 10px;
	border-bottom-left-radius: $border-radius-l;
	border-bottom-right-radius: $border-radius-l;
	background-color: RGBA(var(--color-themed-surface), 0.9);
	color: RGB(var(--color-text-primary-light));
}

.w-product-deposit__available-balance {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	text-align: right;
	overflow: hidden;
	& span {
		padding-right: 10px;
	}
	& .c-icon {
		@media (hover) {
			cursor: pointer;
		}
	}
}
</style>
