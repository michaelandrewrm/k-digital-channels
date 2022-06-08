<template>
	<div class="w-portfolio-managed-rsi-portfolio__list">
		<button
			class="w-portfolio-managed-rsi-portfolio__button"
			v-for="product in group"
			:key="product.id"
			@click="goto(product.id)"
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
	name: 'w-portfolio-managed-rsi-portfolio',

	components: {
		CCardItem,
	},

	data() {
		return {
			ownData: null,
		};
	},

	props: {
		source: { type: Array },
		productId: { type: String },
	},

	watch: {
		productId: {
			immediate: true,
			async handler(productId) {
				this.ownData = await this.$store.dispatch('products/get', productId);
			},
		},
	},

	computed: {
		group({ source, productId, ownData }) {
			if (!source?.length || !ownData) {
				return [];
			}

			const results = [];

			/* istanbul ignore else */
			if (ownData) {
				const { productSubtype, id, alias, name, productNumber, balance } = ownData;
				const subtype = subtypesById[(productSubtype?.id)];
				const namedType = subtype?.toUpperCase();

				results.push({
					id,
					icon: iconsByFamily.account,
					title: alias || name,
					subTitle: this.$pn(productNumber),
					accessibleSubTitle: this.$t('PRODUCT_NUMBER_ENDED_IN', {
						productNumber: productNumber?.value,
					}),
					info: balance?.currency?.id ? this.$nc(balance) : '',
					subinfo: this.$t(`MY_PRODUCT.${namedType}.BALANCE`, 1),
				});
			}

			const groupByCurrency = source.reduce((reducer, product) => {
				const currencyId = product.balance?.currency?.id;
				const subtypeId = product.productSubtype?.id;

				/* istanbul ignore else */
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

			Object.entries(groupByCurrency).forEach(([currencyId, subtypes]) => {
				subtypes.forEach((subtypeId) => {
					const subtype = subtypesById[subtypeId];
					const namedType = subtype?.toUpperCase();
					const prefix = 'managed-';
					const realSubtype = subtype.slice(prefix.length);
					const productsBySubType = source.filter((product) => {
						const isSameParent = product.parentId === productId;
						const isSameSubtype = product.productSubtype?.id === subtypeId;
						const isSameCurrency = product.balance?.currency?.id === currencyId;

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
							: this.$t('PRODUCT_NUMBER_ENDED_IN', {
									productNumber: product.productNumber.value,
							  });
						const totalBalance = sumAmounts(productsBySubType);
						const info = this.$nc(totalBalance);
						const subinfo = this.$tc(`MY_PRODUCT.${namedType}.BALANCE`, length, { currency });

						results.push({
							id,
							icon,
							title,
							subTitle,
							accessibleSubTitle,
							info,
							subinfo,
							products: productsBySubType,
						});
					}
				});
			});

			return results;
		},
	},

	methods: {
		goto(productId) {
			const product =
				this.ownData.id === productId
					? this.ownData
					: this.source.find(({ id }) => id === productId);

			/* istanbul ignore next */
			if (!product) {
				return;
			}

			let familyId = product?.productFamily;

			if (['investment-account', 'managed-rsi-portfolio'].includes(familyId)) {
				return this.$router.push({
					name: 'sso-lighthouse',
					params: { productId, operative: 'portfolioAssessment' },
				});
			}

			if (['managed-rsi-product'].includes(familyId)) {
				familyId = subtypesById[product.productSubtype.id];
			}

			if (familyId.includes('currency') && product.balance?.currency?.id) {
				familyId = familyId.replace(
					/currency/g,
					`currency-${product.balance.currency.id?.toLowerCase()}`
				);
			}

			this.$router
				.push({
					name: 'product',
					params: { productId, familyId },
				})
				.catch(() => this.$router.back());
		},
	},
};
</script>

<style lang="scss" scoped>
.w-portfolio-managed-rsi-portfolio__button {
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

.w-portfolio-managed-rsi-portfolio__button:not(:first-child) {
	margin-top: 10px;
}
</style>
