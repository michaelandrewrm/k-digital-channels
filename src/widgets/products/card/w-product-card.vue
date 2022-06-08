<template>
	<div class="w-product-card" :class="{ '--is-credit-card': isCreditCard }">
		<c-skeuomorphic-card
			class="w-product-card__item-header"
			:style="{ 'background-image': 'url(' + productImage + ')' }"
			:title="product.alias"
			:value="isCreditCard ? $nc(product.postedBalance) : $nc(product.balance)"
			ref="cardHeader"
			:sub-title="isCreditCard ? $t('CARD.AVAILABLE') : $t('CARD.SPENT_THIS_MONTH')"
			:product-number="product.productNumber"
			:actionable="active"
			@expand="$emit('expand')"
		/>
		<c-translide>
			<c-progress-detail
				class="w-product-card__progress"
				v-if="active && isCreditCard"
				:from="product.balance.amount"
				:to="product.postedBalance.amount + product.balance.amount"
			>
				<dl slot="from">
					<dt class="text-m-medium">
						{{ $nc(product.balance) }}
					</dt>
					<dd class="text-s-light">{{ $t('CARD.SPENT') }}</dd>
				</dl>
				<dl slot="to">
					<dt class="text-m-medium">
						{{
							$nc({
								amount: product.balance.amount + product.postedBalance.amount,
								currency: product.balance.currency,
							})
						}}
					</dt>
					<dd class="text-s-light">{{ $t('CARD.LIMIT') }}</dd>
				</dl>
			</c-progress-detail>
		</c-translide>
	</div>
</template>

<script>
import CTranslide from '@components/c-translide';
import CProgressDetail from '@components/c-progress-detail';
import CSkeuomorphicCard from '@components/c-skeuomorphic-card';
import getProductImage from '@modules/products/product-image';
import { subtypesById } from '@modules/products/product-subtypes';

export default {
	name: 'w-product-card',

	components: {
		CSkeuomorphicCard,
		CTranslide,
		CProgressDetail,
	},

	props: {
		product: { type: Object },
		active: { type: Boolean },
	},

	computed: {
		productImage({ product }) {
			return getProductImage(product);
		},

		isCreditCard({ product }) {
			const subtype = subtypesById[product.productSubtype.id];
			return subtype.endsWith('credit-card');
		},
	},
};
</script>

<style lang="scss" scoped>
.w-product-card:not(.--is-credit-card) /deep/ {
	.c-skeuomorphic-card__value,
	.c-skeuomorphic-card__sub-title {
		opacity: 0;
	}
}

.w-product-card__item-header {
	width: 260px;
}

.w-product-card__progress {
	margin: 20px auto 0;
	color: RGB(var(--color-text-primary));
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	min-width: 100%;
}
</style>
