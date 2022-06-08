<template>
	<l-page>
		<h1 data-testid="header" slot="header" tabindex="-1" id="v-product-group-title">
			{{ pageTitle }}
		</h1>

		<c-translide slot="main-fixed-header">
			<div class="v-product-group__main-header">
				<div
					data-testid="tabs"
					v-if="isDeposit && !singleDeposit && !isBancofar"
					class="v-product-group__main-nav"
				>
					<c-tabs-nav
						data-testid="tabs-nav"
						v-if="Object.keys(tabs).length"
						class="v-product-group__main-header-nav"
						:tabs="tabs"
						data-expanded
						@select="selectedTab = $event"
					/>
				</div>
				<div
					v-if="totalAmount && familyId !== 'debit-card'"
					class="v-product-group__card"
					role="text"
					data-testid="balance-card"
				>
					<span class="text-xxl-book v-product-group__card-balance">
						{{ totalAmount }}
					</span>
					<span class="v-product-group__card-sub-title text-m-bold">
						{{ balanceTitle }}
					</span>
				</div>
			</div>
		</c-translide>

		<div ref="content" data-testid="content" class="v-product-group__main">
			<div class="v-product-group__list" role="list" aria-labelledby="v-product-group-title">
				<button
					data-testid="product-item"
					class="v-product-group__product-card"
					v-for="item in group"
					:key="item.id"
					@click="goto(item.id)"
					:data-type="familyId"
					role="listitem"
				>
					<c-card-item
						:type="item.type"
						:icon="item.icon"
						:title="item.title"
						:sub-title="item.subtitle"
						:accessible-sub-title="item.accessibleSubtitle"
						:info="item.info"
						:sub-info="item.subinfo"
					/>
				</button>
			</div>
		</div>
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import mq from '@utils/matchMedia';
import { onDesktop } from '@theme';
import CTranslide from '@components/c-translide';
import CCardItem from '@components/c-card-item';
import CTabsNav from '@components/c-tabs-nav';
import LPage from '@layouts/l-page';
import productsModule from '@modules/products/m-products';
import { subtypesById } from '@modules/products/product-subtypes';
import iconsByFamily from '@modules/products/product-icons';
import sumAmounts from '@modules/products/product-sum-amounts';

export default {
	name: 'v-product-group',

	modules: {
		products: productsModule,
	},

	components: {
		LPage,
		CTranslide,
		CCardItem,
		CTabsNav,
	},

	props: {
		closable: { type: Boolean, default: true },
		familyId: { type: String },
	},

	data() {
		return {
			products: null,
			selectedTab: 0,
			singleDeposit: true,
		};
	},

	computed: {
		...mapState('app', ['companyId']),

		isBancofar({ companyId }) {
			return companyId === 'BF';
		},

		isDesktop: mq(onDesktop),

		isDeposit({ familyId }) {
			return familyId?.endsWith('deposit');
		},

		isCurrency({ familyId }) {
			return familyId?.startsWith('currency');
		},

		pageTitle({ familyId, isCurrency }) {
			let typeName = familyId?.toUpperCase();

			if (isCurrency) {
				const fracture = typeName.split('-');
				const currency = this.$t(`CURRENCY.${fracture[1]}`);
				typeName = `CURRENCY-${fracture[fracture.length - 1]}`;
				return this.$t(`MY_PRODUCT.ALL.${typeName}`, { currency });
			}

			return this.$t(`MY_PRODUCT.ALL.${typeName}`);
		},

		balanceTitle({ familyId, isCurrency }) {
			let typeName = familyId?.toUpperCase();

			if (isCurrency) {
				const fracture = typeName.split('-');
				const currency = this.$t(`CURRENCY.${fracture[1]}`);
				typeName = `CURRENCY-${fracture[fracture.length - 1]}`;
				return this.$t(`MY_PRODUCT.ALL.${typeName}.BALANCE`, { currency });
			}

			return this.$t(`MY_PRODUCT.ALL.${typeName}.BALANCE`);
		},

		totalAmount({ group = [], familyId }) {
			const isCreditCard = familyId === 'credit-card';
			const isLoan = familyId === 'loan';
			const property = isCreditCard ? 'postedBalance' : 'balance';
			const amount = sumAmounts(group, property);
			const formattedAmount = !amount?.currency?.id ? '' : this.$nc(amount, { absolute: isLoan });

			return formattedAmount;
		},

		group({ familyId, isDeposit, isCurrency, singleDeposit, products, tabs }) {
			if (!products || !familyId) {
				return;
			}

			let typeName = familyId;
			let currency;
			const [activeTab] = Object.entries(tabs)
				.flatMap(([, i]) => i)
				.filter(({ active }) => active);
			let currentProducts = [];

			if (isCurrency) {
				const fracture = typeName.split('-');
				typeName = `currency-${fracture[fracture.length - 1]}`;
				currency = this.$t(`CURRENCY.${fracture[1].toUpperCase()}`);
				currentProducts = products[typeName][familyId];
			} else if (isDeposit && !singleDeposit) {
				const { hash } = activeTab;
				currentProducts = products[typeName][hash];
			} else {
				currentProducts = Object.entries(products[typeName]).flatMap(([, items]) => items);
			}

			const isCard = familyId.endsWith('-card');
			const isCreditCard = familyId === 'credit-card';
			const isLoan = familyId === 'loan';

			return currentProducts.map((item) => {
				const subtypeName = typeName.toUpperCase();
				const { alias, productNumber, balance, postedBalance } = item;
				const type = isCard ? familyId : '';
				const icon = isCard ? '' : iconsByFamily[typeName];
				const title = alias || this.$tc(`MY_PRODUCT.${subtypeName}`, 1, { currency });
				const subtitle = this.$pn(productNumber);
				const accessibleSubtitle = productNumber
					? this.$t('PRODUCT_NUMBER_ENDED_IN', { productNumber: productNumber.value })
					: '';
				const info = isCreditCard
					? this.$nc(postedBalance)
					: this.$nc(balance, { absolute: isLoan });
				const subinfo = this.$tc(`MY_PRODUCT.${subtypeName}.BALANCE`, 1);

				return {
					...item,
					type,
					icon,
					title,
					subtitle,
					accessibleSubtitle,
					info,
					subinfo,
				};
			});
		},

		tabs({ selectedTab }) {
			const model = {
				'term-deposit': {
					hash: 'term-deposit',
					enable: true,
					active: false,
					header: this.$tc('MY_PRODUCT.TERM-DEPOSIT', 1),
				},
				'demand-deposit': {
					hash: 'demand-deposit',
					enable: true,
					active: false,
					header: this.$tc('MY_PRODUCT.DEMAND-DEPOSIT', 1),
				},
			};

			return Object.fromEntries(
				Object.entries(model)
					.map(([key, tab]) => (tab.enable ? [key, tab] : null))
					.filter(Boolean)
					.map(([key, tab], index) => {
						if (index === selectedTab) {
							Object.assign(tab, { active: true });
						}
						return [key, tab];
					})
			);
		},
	},

	methods: {
		goto(productId) {
			/* istanbul ignore next */
			if (['investment-account', 'investment-pension-plan'].includes(this.familyId)) {
				return this.$router.push({
					name: 'sso-lighthouse',
					params: { productId, operative: 'portfolioAssessment' },
				});
			}

			return this.$router
				.push({ name: 'product', params: { productId, familyId: this.familyId } })
				.catch(() => this.$router.back());
		},
	},

	watch: {
		familyId: {
			async handler(familyId) {
				/* istanbul ignore else */
				if (familyId) {
					const { isCurrency, isDeposit } = this;
					const products = await this.$store.dispatch('products/fetch');
					const fracture = familyId.split('-');
					const typeName = isCurrency ? `currency-${fracture[fracture.length - 1]}` : familyId;
					const currentProducts = products.filter(
						({ productFamily }) => productFamily === typeName
					);

					this.products = currentProducts.reduce(
						(reducer, item) => {
							const { productSubtype, balance } = item;
							const currency = balance?.currency?.id;
							const subtypeName = isCurrency
								? `currency-${currency.toLowerCase()}-${fracture[fracture.length - 1]}`
								: subtypesById[productSubtype.id];

							if (!reducer[typeName][subtypeName]) {
								// eslint-disable-next-line no-param-reassign
								reducer[typeName][subtypeName] = [];
							}

							reducer[typeName][subtypeName].push(item);

							return reducer;
						},
						{ [typeName]: {} }
					);

					if (!isCurrency && isDeposit) {
						this.singleDeposit = Object.entries(this.products[typeName])?.length === 1;
					}
				}
			},
			immediate: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.v-product-group {
	position: relative;
	background: RGB(var(--color-primary));
	display: flex;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
}

.v-product-group__list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	grid-gap: 10px;
	flex-grow: 1;
	padding: 0 0 70px;
}

.v-product-group__product-card {
	appearance: none;
	background: transparent;
	border: 0;
	margin: 0;
	padding: 0;
	display: block;
	width: 100%;
	text-align: left;
	position: relative;
	border-radius: $border-radius-m;
}

.v-product-group__main-nav {
	padding: 20px 0px;
}

.v-product-group__main-header,
.v-product-group__main {
	display: flex;
	width: 100%;
	max-width: 800px;
	margin: 0 auto;
	flex-direction: column;
}

.v-product-group__main-header {
	color: RGB(var(--color-text-primary));
	&:not(:empty) {
		padding: 20px 20px 10px;
	}
}

.v-product-group__card {
	display: flex;
	position: relative;
	width: 100%;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: RGB(var(--color-surface-dark));
	padding: 10px;
	box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 0.3);
	border-radius: $border-radius-m;
	color: RGB(var(--color-text-primary));
	text-align: center;
}

.v-product-group__product-card[data-type='debit-card'] /deep/ {
	.c-card-item__info,
	.c-card-item__subinfo {
		opacity: 0;
	}
}

@media ($on-desktop) {
	.v-product-group__card {
		padding: 13px 15px;
		line-height: 1.6;
	}
}
</style>
