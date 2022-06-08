<template>
	<l-details
		class="v-product"
		:class="{ '--is-search': search, '--is-hefame-account': isHefame }"
		@beforeLift="viewProductInfoButton = false"
		@beforeDrop="viewProductInfoButton = true"
	>
		<div v-if="isHefame" class="v-product__page-title" slot="header">
			<div class="v-product__hefame-logo"></div>
		</div>

		<h1 v-else tabindex="-1" slot="header">{{ pageTitle }}</h1>

		<c-translide slot="widget">
			<c-slider
				data-testid="slider"
				v-if="products"
				class="v-product__slider"
				:selected="selected"
				@change="goto"
			>
				<w-product-widget
					class="v-product__item-header"
					v-for="product in products"
					:key="product.id"
					:active="product.id == productId && viewProductInfoButton"
					:product="product"
					:type="productFamily"
				/>
			</c-slider>
		</c-translide>

		<c-translide slot="main-header">
			<div v-if="products" class="v-product__search-header">
				<c-icon-button
					data-testid="cancel-search"
					class="v-product__search-header__cancel-search-button"
					icon="@icons/close"
					:aria-label="$t('MOVEMENT.CANCEL_SEARCH')"
					v-if="search"
					@click="$router.back()"
				/>
				<c-tabs-nav
					v-if="Object.keys(tabs).length"
					class="v-product__search-header__nav"
					:tabs="tabs"
					@select="selectedTab = $event"
				/>
				<c-icon-button
					data-testid="search"
					class="v-product__search-header__search-button"
					icon="@icons/search"
					:aria-label="$t('MOVEMENT.SEARCH_TITLE')"
					v-if="isSearchEnabled && !search"
					@click="
						$router.push({
							name: 'search-movements',
							params: { productId, familyId },
						})
					"
				/>
			</div>
		</c-translide>

		<c-translide>
			<c-tabs v-if="product" :external-nav="true">
				<c-tab key="contentInvestmentPortfolio" v-if="enableTabInvestmentPortfolio">
					<w-investment-portfolio
						data-testid="resource-list"
						:type="familyId"
						:product-id="productId"
					/>
				</c-tab>
				<c-tab key="contentPortfolio" v-if="enableTabManagedPortfolio">
					<w-product-portfolio
						data-testid="resource-list"
						:type="productFamily"
						:product-id="productId"
					/>
				</c-tab>
				<c-tab key="contentRSIPortfolio" v-if="enableTabManagedRSIPortfolio">
					<w-product-rsi-portfolio
						data-testid="resource-list"
						:type="productFamily"
						:product-id="productId"
					/>
				</c-tab>
				<c-tab key="contentCaminosEq" v-if="enableTabCaminosEq || enableTabEndorsement">
					<w-product-position
						data-testid="resource-list"
						:type="productFamily"
						:product-id="productId"
					/>
				</c-tab>
				<c-tab key="contentFund" v-if="enableTabFunds" v-show="tabs.funds.active">
					<w-product-resource-list
						data-testid="resource-list"
						resource="asset"
						:type="`${productFamily}-asset`"
						:product-id="productId"
						:product-family="productSubtype"
						:last-resource="lastResource"
					/>
				</c-tab>
				<c-tab key="contentEquities" v-if="enableTabEquities" v-show="tabs.equities.active">
					<w-product-resource-list
						data-testid="resource-list"
						resource="asset"
						:type="`${productFamily}-asset`"
						:product-id="productId"
						:product-family="productSubtype"
						:last-resource="lastResource"
					/>
				</c-tab>
				<c-tab key="contentImpositions" v-if="enableTabImpositions && tabs.impositions.active">
					<w-product-resource-list
						data-testid="resource-list"
						resource="imposition"
						:type="productFamily"
						:product-id="productId"
						:product-family="productSubtype"
						:last-resource="lastResource"
					/>
				</c-tab>
				<c-tab key="contentMovements" v-if="enableTabMovements" v-show="tabs.movements.active">
					<w-product-resource-list
						data-testid="resource-list"
						resource="movement"
						:type="productFamily"
						:product-id="productId"
						:query="{
							dateFrom: $route.query.dateFrom,
							dateTo: $route.query.dateTo,
							reason: $route.query.reason,
						}"
						:last-resource="lastResource"
						:reload="reloadMovementList"
					/>
				</c-tab>
			</c-tabs>
		</c-translide>

		<w-product-actions
			v-if="isActionEnabled"
			:product="product"
			:type="productFamily"
			slot="buttons"
			@download-document="onDownloadDocument"
		/>
	</l-details>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import LDetails from '@layouts/l-details';
import CSlider from '@components/c-slider';
import CTranslide from '@components/c-translide';
import CIconButton from '@components/c-icon-button';
import CTabs from '@components/c-tabs';
import CTab from '@components/c-tab';
import CTabsNav from '@components/c-tabs-nav';
import moduleProducts from '@modules/products/m-products';
import { subtypesById } from '@modules/products/product-subtypes';
import WDownloadDocument from '@widgets/w-download-document';
import b64toBlob from '@utils/b64toBlob';

import WProductWidget from '@widgets/w-product-widget';
import WProductActions from '@widgets/w-product-actions';
import WProductResourceList from '@widgets/w-product-resource-list';
import WProductPosition from '@widgets/w-product-position';
import WProductPortfolio from '@widgets/w-product-portfolio';
import WProductRsiPortfolio from '@widgets/w-product-rsi-portfolio';
import WInvestmentPortfolio from '@widgets/w-investment-portfolio';

export default {
	name: 'v-product',

	modules: { products: moduleProducts },

	components: {
		LDetails,
		CTranslide,
		CSlider,
		CIconButton,
		CTabs,
		CTab,
		CTabsNav,
		WProductWidget,
		WProductActions,
		WProductResourceList,
		WProductPosition,
		WProductPortfolio,
		WProductRsiPortfolio,
		WInvestmentPortfolio,
	},

	props: {
		productId: { type: null },
		familyId: { type: null },
	},

	beforeRouteEnter(to, from, next) {
		next((vm) => vm.tabsHandler(from));
	},

	data() {
		return {
			products: null,
			product: null,
			selected: 0,
			viewProductInfoButton: true,
			selectedTab: 0,
			lastResource: null,
			reloadMovementList: null,
		};
	},

	computed: {
		...mapState('app', ['companyId']),

		...mapState('profiles', ['defaultProfile']),

		isBancofar({ companyId }) {
			return companyId === 'BF';
		},

		productSubtype({ product }) {
			return subtypesById[(product?.productSubtype?.id)];
		},

		isHefame({ productSubtype }) {
			return productSubtype === 'hefame-account';
		},

		isCurrency({ productSubtype }) {
			return productSubtype?.includes('currency');
		},

		isSearchEnabled({ productFamily, productSubtype }) {
			const enabledList = ['account', 'card'];

			return enabledList.includes(productFamily) || productSubtype === 'demand-deposit';
		},

		search({ isSearchEnabled, $route: { query } }) {
			return isSearchEnabled && query.search;
		},

		pageTitle({ productSubtype, product, products, isCurrency, isHefame }) {
			if (product) {
				const { length } = products;
				const uppercaseSubtype = productSubtype.toUpperCase();
				const uppercaseProductFamily = product.productFamily.toUpperCase();
				let currency;

				if (isCurrency) {
					currency = this.$t(`CURRENCY.${product.balance.currency.id}`);
				}

				if (isHefame) {
					return this.$t('MY_PRODUCT.HEFAME-GROUP');
				}

				if (
					['DEPOSIT', 'SUBSCRIPTION', 'MANAGED-PRODUCT', 'MANAGED-RSI-PRODUCT'].includes(
						uppercaseProductFamily
					)
				) {
					return this.$tc(`MY_PRODUCT.${uppercaseSubtype}`, length, { currency });
				}

				return this.$tc(`MY_PRODUCT.${uppercaseProductFamily}`, length, { currency });
			}

			return '';
		},

		isActionEnabled({ productSubtype, isBancofar }) {
			const disabledList = [
				'caminos-equities',
				'managed-portfolio',
				'managed-rsi-portfolio',
				'managed-rsi-account',
				'managed-rsi-currency-account',
				'managed-account',
				'managed-currency-account',
				'managed-investment-portfolio',
				'pending-movements',
				'managed-equities',
				'endorsement',
				'endorsement-line',
				'investment-account-rto',
				'investment-account-advised',
				'investment-pension-plan',
			];

			/* istanbul ignore else */
			if (isBancofar) {
				disabledList.push('guarantee-policy-fixed', 'guarantee-policy-var');
			}

			return !disabledList.includes(productSubtype);
		},

		productFamily({ product, productSubtype }) {
			if (product) {
				let { productFamily } = product;

				if (productFamily === 'subscription') {
					const prefix = 'premium-';
					productFamily = productSubtype.slice(prefix.length);
				}

				if (productFamily === 'managed-product') {
					const prefix = 'managed-';
					productFamily = productSubtype.slice(prefix.length);
				}

				if (productFamily === 'managed-rsi-product') {
					const prefix = 'managed-rsi-';
					productFamily = productSubtype.slice(prefix.length);
				}

				if (productFamily.startsWith('currency-')) {
					const prefix = 'currency-';
					productFamily = productFamily.slice(prefix.length);
				}

				if (['credit-card', 'debit-card'].includes(productFamily)) {
					return 'card';
				}

				if (
					productFamily === 'investment-pension-plan' ||
					productFamily === 'investment-portfolio'
				) {
					return 'investment-portfolio';
				}

				return productFamily;
			}

			return '';
		},

		enableTabFunds({ productFamily }) {
			return productFamily === 'fund';
		},

		enableTabEquities({ productFamily }) {
			return productFamily === 'equities';
		},

		enableTabImpositions({ productFamily, isBancofar }) {
			return productFamily === 'deposit' && isBancofar;
		},

		enableTabMovements({ productFamily }) {
			return (
				productFamily !== 'investment-portfolio' &&
				productFamily !== 'caminos-equities' &&
				productFamily !== 'managed-portfolio' &&
				productFamily !== 'managed-rsi-portfolio' &&
				productFamily !== 'endorsement'
			);
		},

		enableTabPendingMovements({ productFamily }) {
			return productFamily === 'pending-movements';
		},

		enableTabEndorsement({ productFamily }) {
			return productFamily === 'endorsement';
		},

		enableTabCaminosEq({ productFamily }) {
			return productFamily === 'caminos-equities';
		},

		enableTabManagedPortfolio({ productFamily }) {
			return productFamily === 'managed-portfolio';
		},

		enableTabManagedRSIPortfolio({ productFamily }) {
			return productFamily === 'managed-rsi-portfolio';
		},

		enableTabInvestmentPortfolio({ productFamily }) {
			return productFamily === 'investment-portfolio';
		},

		tabs({
			enableTabFunds,
			enableTabEquities,
			enableTabMovements,
			enableTabImpositions,
			enableTabPendingMovements,
			enableTabInvestmentPortfolio,
			search,
			selectedTab,
		}) {
			const movementHeader = search
				? this.$t('MOVEMENT.SEARCH_RESULTS')
				: this.$t('MOVEMENT.LAST_MOVEMENTS');

			const model = {
				funds: {
					hash: 'funds',
					enable: enableTabFunds,
					active: false,
					header: this.$t('MOVEMENT.FUNDS'),
				},
				equities: {
					hash: 'equities',
					enable: enableTabEquities || enableTabInvestmentPortfolio,
					active: false,
					header: this.$t('MOVEMENT.BROKER_COMPOSITION'),
				},
				impositions: {
					hash: 'impositions',
					enable: enableTabImpositions,
					active: false,
					header: this.$t('MOVEMENT.IMPOSITIONS'),
				},
				movements: {
					hash: 'movements',
					enable: enableTabMovements,
					active: false,
					header: enableTabPendingMovements
						? this.$t('MOVEMENT.PENDING_MOVEMENTS')
						: movementHeader,
				},
			};

			return Object.fromEntries(
				Object.entries(model)
					.map(([key, tab]) => {
						return tab.enable ? [key, tab] : null;
					})
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

	watch: {
		productId: {
			immediate: true,
			async handler(productId) {
				if (productId) {
					const product = await this.$store.dispatch('products/get', productId);
					const siblings = await this.$store.dispatch('products/getSiblings', productId);
					const products = siblings.filter(
						({ productFamily, productSubtype, parentId, balance }) => {
							const isSameSubtype = product.productSubtype.id === productSubtype.id;
							const isSameParent = product.parentId === parentId;
							const isSameCurrency = product.balance.currency.id === balance.currency.id;

							if (['deposit', 'subscription'].includes(productFamily)) {
								return isSameCurrency && isSameSubtype;
							}

							if (productFamily === 'managed-product' || productFamily === 'managed-rsi-product') {
								return isSameCurrency && isSameSubtype && isSameParent;
							}

							if (productFamily === 'investment-portfolio') {
								return isSameSubtype;
							}

							return isSameCurrency && isSameParent;
						}
					);
					this.product = product;
					this.products = products;
					this.selected = this.products.findIndex(({ id }) => productId === id);
				}
			},
		},

		$route(context, lastContext) {
			/* istanbul ignore next */
			if (lastContext.query?.search) {
				this.lastResource = null;
				this.reloadMovementList = true;
			}
		},
	},

	methods: {
		tabsHandler({ params, path }) {
			const { familyId, movementId } = params;
			const parts = path.split('/');
			const isMovement = parts.includes('movement');
			const validFamilies = ['fund', 'equities', 'managed-fund', 'managed-equities', 'deposit'];
			this.lastResource = movementId;

			/* istanbul ignore else */
			if (validFamilies.includes(familyId) && isMovement && movementId) {
				this.selectedTab = 1;
			}
		},

		goto(index) {
			const { products, productId } = this;
			if (products && productId !== products[index].id) {
				this.$store.dispatch('modal/close');
				this.$router.replace({
					name: this.$route.name,
					params: { productId: products[index].id },
				});
			}
		},

		onDownloadDocument(extension) {
			this.download(extension);
		},

		download(extension) {
			const channel = new MessageChannel();

			this.$store.dispatch('notification/open', {
				template: Vue.extend(WDownloadDocument),
				props: {
					channel,
					extension: extension.toUpperCase(),
					title: this.$t('MOVEMENT.TITLE'),
				},
				timeout: 5000,
			});

			this.$store
				.dispatch('products/getReceipt', {
					productId: this.productId,
					query: {
						dateFrom: this.$route.query.dateFrom,
						dateTo: this.$route.query.dateTo,
						reason: this.$route.query.reason,
					},
					reportType: extension,
				})
				.then((content) => {
					const blobStore = b64toBlob(content, extension);

					channel.port1.postMessage({ name: 'downloaded', blob: blobStore, b64Data: content });
				})
				.catch(() => {
					channel.port1.postMessage({ name: 'error' });
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.v-product.--is-search .v-product__search-header__nav {
	padding-left: 25px;
}

.v-product__page-title {
	display: flex;
	align-items: center;
	font-style: italic;
	& .c-icon {
		margin-right: 10px;
	}
}

.v-product.--is-hefame-account /deep/ .l-details__header {
	background: rgb(255, 204, 0);
}

.v-product.--is-hefame-account /deep/ .l-details__nav .l-details__back {
	color: RGB(var(--color-primary-dark));
}

.v-product__hefame-logo {
	width: 160px;
	height: 30px;
	background-size: contain;
	background-image: url(~@assets/img/logo-hefame.png);
	background-repeat: no-repeat;
	background-position: center;
	background-color: none;
}

.v-product__search-header {
	display: flex;
	align-items: center;
	color: RGB(var(--color-text-primary));
	position: relative;
}

.v-product__search-header__nav {
	flex-grow: 1;
}

.v-product__search-header__cancel-search-button {
	justify-content: flex-start;
	padding: 0;
	margin: 0;
	position: absolute;
	left: 0;
	font-size: 14px;
	padding-bottom: 10px;
}

.v-product__search-header__search-button {
	position: absolute;
	right: 0;
}
</style>
