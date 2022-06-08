<template>
	<div class="w-portfolio-managed-portfolio__list">
		<button
			class="w-portfolio-managed-portfolio__button"
			v-for="product in group"
			:key="product.id"
			@click="$router.push(product.link)"
		>
			<c-card-item
				slot="default"
				:icon="product.icon"
				:title="product.title"
				:sub-title="product.subTitle"
				:accessible-sub-title="product.accessibleSubTitle"
				:info="product.info"
				:sub-info="product.subinfo"
				data-testid="product-card-item"
			/>
		</button>
	</div>
</template>

<script>
import sumAmounts from '@modules/products/product-sum-amounts';
import { subtypesById } from '@modules/products/product-subtypes';
import iconsByFamily from '@modules/products/product-icons';
import CCardItem from '@components/c-card-item';

export default {
	name: 'w-portfolio-managed-portfolio',

	components: {
		CCardItem,
	},

	props: {
		source: { type: Array },
		productId: { type: String },
	},

	computed: {
		group({ source, productId }) {
			/* istanbul ignore next */
			if (!source) {
				return;
			}

			const groupByCurrency = source.reduce((reducer, product) => {
				const currencyId = product.balance.currency.id;
				const subtypeId = product.productSubtype.id;

				if (product.parentId === productId) {
					if (!reducer[currencyId]) {
						Object.assign(reducer, { [currencyId]: [] });
					}
					if (!reducer[currencyId].includes(subtypeId)) {
						reducer[currencyId].push(subtypeId);
					}
				}

				return reducer;
			}, {});

			return Object.entries(groupByCurrency).reduce((reducer, [currencyId, subtypes]) => {
				subtypes.forEach((subtypeId) => {
					const subtype = subtypesById[subtypeId];
					const namedType = subtype?.toUpperCase();
					const prefix = 'managed-';
					const realSubtype = subtype.slice(prefix.length);
					const productsBySubType = source.filter((product) => {
						const isSameParent = product.parentId === productId;
						const isSameSubtype = product.productSubtype.id === subtypeId;
						const isSameCurrency = product.balance.currency.id === currencyId;

						return isSameParent && isSameSubtype && isSameCurrency;
					});

					/* istanbul ignore else */
					if (productsBySubType.length) {
						const { length } = productsBySubType;
						const product = productsBySubType[0];
						const id = product?.id;
						const icon =
							iconsByFamily[realSubtype] || /* istanbul ignore next */ iconsByFamily.account;
						const currency = this.$t(`CURRENCY.${currencyId?.toUpperCase()}`);
						const hasMoreThanOne = length > 1;
						const title = this.$tc(`MY_PRODUCT.${namedType}`, length, { currency });
						const subTitle = hasMoreThanOne ? '' : this.$pn(product.productNumber);
						const accessibleSubTitle = hasMoreThanOne
							? ''
							: this.$t('PRODUCT_NUMBER_ENDED_IN', { productNumber: product.productNumber.value });
						const totalBalance = sumAmounts(productsBySubType);
						const info = this.$nc(totalBalance);
						const subinfo = this.$tc(`MY_PRODUCT.${namedType}.BALANCE`, length, { currency });
						const familyId = subtype.includes('currency')
							? subtype.replace(/currency/g, `currency-${currencyId.toLowerCase()}`)
							: subtype;
						const link = {
							name: 'product',
							params: { productId: product.id, familyId },
						};

						reducer.push({
							id,
							icon,
							title,
							subTitle,
							accessibleSubTitle,
							info,
							subinfo,
							productFamily: product.productFamily,
							link,
						});
					}
				});

				return reducer;
			}, []);
		},
	},
};
</script>

<style lang="scss" scoped>
.w-portfolio-managed-portfolio__button {
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

.w-portfolio-managed-portfolio__button:not(:first-child) {
	margin-top: 10px;
}
</style>
