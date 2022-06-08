<template>
	<l-details class="v-premium">
		<h1 v-if="pageTitle" slot="header">{{ pageTitle }}</h1>

		<c-translide slot="widget">
			<div class="v-premium__slider" v-if="pageTitle">
				<c-acrylic-sheet>
					<c-icon src="@icons/productPremium" size="" slot="icon" />

					<span class="v-premium__title text-fixed-m-medium" v-if="pageTitle">
						{{ pageTitle }}
					</span>

					<span class="v-premium__balance text-fixed-l-bold" v-if="pageBalance">
						{{ $nc(pageBalance) }}
					</span>
				</c-acrylic-sheet>
			</div>
		</c-translide>

		<div class="v-premium__list">
			<router-link
				class="v-premium__button"
				tag="button"
				v-for="item in group"
				:key="item.id"
				:to="{ name: 'product', params: { productId: item.id } }"
				:data-type="item.name"
			>
				<c-card-item
					slot="default"
					:icon="item.icon"
					:title="$tc(`MY_PRODUCT.${item.name.toUpperCase()}`, item.products.length)"
					:sub-title="$pn(item.productNumber)"
					:accessible-sub-title="
						item.productNumber.value
							? $t('PRODUCT_NUMBER_ENDED_IN', { productNumber: item.productNumber.value })
							: ''
					"
					:info="$nc(item.balance)"
					:sub-info="$tc(`MY_PRODUCT.${item.name.toUpperCase()}.BALANCE`, item.products.length)"
					data-testid="product-card-item"
				/>
			</router-link>
		</div>
	</l-details>
</template>

<script>
import CTranslide from '@components/c-translide';
import CCardItem from '@components/c-card-item';
import CIcon from '@components/c-icon';
import CAcrylicSheet from '@components/c-acrylic-sheet';
import LDetails from '@layouts/l-details';
import { subtypesById } from '@modules/products/product-subtypes';
import iconsByFamily from '@modules/products/product-icons';
import productFamilies from '@modules/products/product-families';
import sumAmounts from '@modules/products/product-sum-amounts';

import productsModule from '@modules/products/m-products';

export default {
	name: 'v-premium',

	modules: {
		products: productsModule,
	},

	props: {
		familyId: { type: null },
	},

	components: {
		LDetails,
		CTranslide,
		CCardItem,
		CAcrylicSheet,
		CIcon,
	},

	data() {
		return {
			products: [],
		};
	},

	computed: {
		pageTitle({ familyId, group }) {
			return this.$tc(`MY_PRODUCT.${familyId.toUpperCase()}`, group.length);
		},

		pageBalance({ group }) {
			/* istanbul ignore next */
			if (!group || !group.length) {
				return false;
			}

			return sumAmounts(group, 'balance', ({ name }) =>
				['premium-account', 'premium-deposit'].includes(name)
			);
		},

		group({ familyId, products }) {
			/* istanbul ignore next */
			if (!products) {
				return [];
			}

			const families = productFamilies[familyId];

			return families.reduce((reducer, subtype) => {
				const productsBySubType = products.filter(
					({ productSubtype }) => subtypesById[productSubtype.id] === subtype
				);
				const isCreditCard = subtype?.endsWith('credit-card');
				const property = isCreditCard ? 'postedBalance' : 'balance';

				if (productsBySubType.length > 0) {
					reducer.push({
						name: subtype,
						products: productsBySubType,
						balance: sumAmounts(productsBySubType, property),
						id: productsBySubType[0].id,
						icon: iconsByFamily[subtype],
						productNumber:
							productsBySubType.length > 1 /* istanbul ignore next */
								? ''
								: productsBySubType[0].productNumber,
					});
				}

				return reducer;
			}, []);
		},
	},

	watch: {
		familyId: {
			immediate: true,
			async handler() {
				this.products = await this.$store.dispatch('products/fetch');
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.v-premium__slider {
	width: 300px;
}

.v-premium__list {
	margin: 0 auto;
	width: 100%;
	max-width: 800px;
	padding-bottom: 20px;
	display: flex;
	flex-direction: column;
	--c-card-item-icon-color: RGB(var(--color-secondary-light));
}

.v-premium__button[data-type='premium-debit-card'] /deep/ {
	.c-card-item__info,
	.c-card-item__subinfo {
		opacity: 0;
	}
}

.v-premium__button {
	appearance: none;
	background: transparent;
	border: 0;
	margin: 0;
	padding: 0;
	display: block;
	width: 100%;
	text-align: left;
	position: relative;
}

.v-premium__button:not(:first-child) {
	margin-top: 10px;
}

.v-premium__balance {
	margin-top: 10px;
}
</style>
