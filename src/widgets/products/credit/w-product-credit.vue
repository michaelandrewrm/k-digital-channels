<template>
	<div class="w-product-credit">
		<c-acrylic-sheet :actionable="active" @expand="$emit('expand')">
			<c-icon src="@icons/productCredit" size="" slot="icon" />

			<span class="w-product-credit__alias text-fixed-m-book" v-if="product.alias">
				{{ product.alias }}
			</span>
			<span class="w-product-credit__name text-fixed-l-medium" v-if="product.name">
				{{ product.name }}
			</span>
			<span class="w-product-credit__balance text-fixed-l-bold" v-if="product.balance">
				{{ $nc(product.balance) }}
			</span>
			<span class="w-product-credit__disposed text-fixed-s-medium">
				{{ $t('MY_PRODUCT.CREDIT.BALANCE') }}
			</span>
			<!-- <span v-if="product.id" class="w-product-credit__credit-number text-fixed-s-medium">
				{{ $t('DETAIL.PRODUCT_CREDIT_NUMBER', { disposed: $n(product.id) }) }}
			</span> -->
			<div slot="footer" class="w-product-credit__footer" :tabindex="active - 1">
				<div class="w-product-credit__available-balance">
					<span class="text-m-book">
						{{ $t('MY_PRODUCT.CREDIT.AVAILABLE_BALANCE').concat(':') }}
					</span>
					<span class="text-m-medium">
						{{ $nc(product.postedBalance) }}
					</span>
				</div>
			</div>
		</c-acrylic-sheet>

		<c-translide>
			<c-progress-detail
				v-if="
					product &&
						product.limitAmount &&
						product.limitAmount.amount &&
						product.postedBalance &&
						product.postedBalance.amount
				"
				class="w-product-credit__progress"
				:from="product.limitAmount.amount - product.postedBalance.amount"
				:to="product.limitAmount.amount"
			>
				<dl slot="from">
					<dt class="text-m-medium">
						{{
							$nc({
								amount: product.limitAmount.amount - product.postedBalance.amount,
								currency: product.balance.currency,
							})
						}}
					</dt>
					<dd class="text-s-light">{{ $t('CREDIT.DISPOSED') }}</dd>
				</dl>
				<dl slot="to">
					<dt class="text-m-medium">
						{{ $nc(product.limitAmount) }}
					</dt>
					<dd class="text-s-light">{{ $t('CREDIT.LIMIT') }}</dd>
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

export default {
	name: 'w-product-credit',

	components: {
		CTranslide,
		CProgressDetail,
		CAcrylicSheet,
		CIcon,
	},

	props: { product: Object, active: Boolean },
};
</script>

<style lang="scss" scoped>
.w-product-credit {
	width: 300px;
}

.w-product-credit__alias,
.w-product-credit__name {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	margin-right: 20px;
}

.w-product-credit__name {
	margin-bottom: 10px;
}

.w-product-credit__balance {
	display: flex;
	align-items: center;
}

.w-product-credit__disposed {
	display: inline-flex;
	width: fit-content;
	margin-bottom: 10px;
}

.w-product-credit__credit-number {
	display: inline-flex;
	width: fit-content;
	margin-bottom: 10px;
	padding: 4px 6px;
	border-radius: $border-radius-l;
	background-color: RGBA(var(--color-text-primary-light), 0.17);
}

.w-product-credit__progress {
	margin: 20px auto 0;
	color: RGB(var(--color-text-primary));
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	min-width: 100%;
}

.w-product-credit__footer {
	position: relative;
	padding: 10px;
	border-bottom-left-radius: $border-radius-l;
	border-bottom-right-radius: $border-radius-l;
	background-color: RGBA(var(--color-themed-surface), 0.9);
	color: RGB(var(--color-text-primary-light));
}

.w-product-credit__available-balance {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	text-align: right;
	overflow: hidden;
	& span {
		padding-right: 10px;
	}
}
</style>
