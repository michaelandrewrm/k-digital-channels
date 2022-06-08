<template>
	<div class="w-product-widget" :class="classNames">
		<component
			:is="widget"
			v-bind="$attrs"
			v-on="$listeners"
			:product="product"
			:active="active"
			:type="type"
			@expand="openDetails"
		/>
	</div>
</template>

<script>
import { subtypesById } from '@modules/products/product-subtypes';

export default {
	name: 'w-product-widget',

	props: {
		product: { type: Object },
		type: { type: String, required: true },
		active: { type: Boolean },
	},

	computed: {
		widget({ type }) {
			return () => import(`@widgets/products/${type}/w-product-${type}`);
		},

		classNames({ type }) {
			const isCard = type === 'card';

			return {
				'--size-card': isCard,
				'--size-standard': !isCard,
			};
		},
	},

	methods: {
		openDetails() {
			const { product } = this;
			const productId = product.id;
			let { productFamily } = product;

			/* istanbul ignore next */
			if (productFamily === 'managed-product') {
				productFamily = subtypesById[(product.productSubtype?.id)];
			}

			/* istanbul ignore next */
			if (productFamily === 'managed-rsi-product') {
				productFamily = subtypesById[(product.productSubtype?.id)];
			}

			/* istanbul ignore next */
			if (productFamily?.includes('currency')) {
				const currencyId = product.balance?.currency?.id.toLowerCase();
				productFamily = productFamily.replace(/currency/g, `currency-${currencyId}`);
			}

			return this.$router.push({
				name: 'product-detail',
				params: { productId, familyId: productFamily },
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.w-product-widget.--size-standard {
	width: 300px;
}

.w-product-widget.--size-card {
	width: 260px;
}
</style>
