<template>
	<div class="w-product-list">
		<transition name="placeholder" mode="out-in">
			<c-placeholder-movement v-if="loading" key="placeholder" data-testid="loading" />

			<div
				class="w-product-list__main w-product-list__message"
				v-else-if="error"
				data-testid="error"
			>
				<c-icon
					class="w-product-list__message-icon color-text-error"
					src="@icons/modalExclamation"
				/>

				<p class="text-m-book">
					{{ $t('RESOURCE.PRODUCT.ERROR') }}

					<a href="#" class="w-product-list__message-link-text" @click.prevent="refreshProducts">
						{{ $t('RETRY') }}
					</a>
				</p>
			</div>

			<div
				class="w-product-list__main w-product-list__list"
				v-else-if="products && products.length"
				key="resources"
				data-testid="list"
			>
				<template v-for="(product, index) in productsCard">
					<button
						class="w-product-list__button"
						:key="product.id"
						:data-type="product.familyId"
						@click="goto(product.link)"
					>
						<c-card-item
							class="w-product-list__card"
							:icon="product.icon"
							:title="product.title"
							:sub-title="product.subtitle"
							:accessible-sub-title="product.accessibleSubtitle"
							:info="product.info"
							:sub-info="product.subinfo"
							:active="product.active"
							data-testid="product-card-item"
						/>
					</button>

					<div
						:key="`${product.familyId}_banner`"
						class="w-product-list__banner"
						data-testid="banner-slot"
						v-if="$slots.banner && shouldInsertTheBannerHere(index)"
					>
						<slot name="banner" />
					</div>
				</template>
			</div>

			<div
				class="w-product-list__main w-product-list__message"
				v-if="!loading && !error && fetched && !products.length"
				key="warning"
				data-testid="warning"
			>
				<c-icon
					class="w-product-list__message-icon color-text-secondary-light"
					src="@icons/modalExclamation"
				/>
				<p class="text-l-medium">{{ $t('RESOURCE.PRODUCT.WARNING.TITLE') }}</p>

				<p class="text-m-book">
					{{
						defaultProfile && !products.length
							? $t('RESOURCE.PROFILES.WARNING.DESC')
							: $t('RESOURCE.PRODUCT.WARNING.DESC')
					}}
				</p>
			</div>
		</transition>

		<transition name="placeholder">
			<c-placeholder-movement v-if="loading" />
		</transition>

		<transition name="placeholder">
			<c-placeholder-movement v-if="loading" />
		</transition>
	</div>
</template>

<script>
/* eslint-disable no-param-reassign */
import CCardItem from '@components/c-card-item';
import CPlaceholderMovement from '@components/c-placeholder-movement';
import CIcon from '@components/c-icon';

import { subtypesById } from '@modules/products/product-subtypes';
import productFamilies from '@modules/products/product-families';
import iconsByFamily from '@modules/products/product-icons';
import sumAmounts from '@modules/products/product-sum-amounts';

import productsModule from '@modules/products/m-products';
import { mapState } from 'vuex';

export default {
	name: 'w-product-list',

	modules: {
		products: productsModule,
	},

	components: {
		CCardItem,
		CPlaceholderMovement,
		CIcon,
	},

	data() {
		return {
			loading: false,
			timerLoading: null,
			fetched: false,
			error: false,
			products: [],
			bannerPosition: 2,
		};
	},

	props: {
		selectedFamily: { type: String, default: '' },
	},

	computed: {
		...mapState('profiles', ['defaultProfile']),

		activeProduct({ selectedFamily }) {
			return selectedFamily;
		},

		categorizedProducts({ products, selectedFamily }) {
			/* istanbul ignore next */
			if (!products?.length) {
				return;
			}

			return products.reduce((reducer, item) => {
				const productSubtype = subtypesById[item.productSubtype.id];
				const families = Object.entries(productFamilies);
				const familyGroup = families.find(([, group]) => group.includes(productSubtype));

				if (familyGroup && !item.parentId) {
					let [familyName] = familyGroup;

					if (familyName === 'managed-rsi-product') {
						return reducer;
					}

					if (familyName?.includes('currency')) {
						const currency = item.balance.currency.id.toLowerCase();
						familyName = familyName.replace(/currency-/g, `currency-${currency}-`);
					}

					if (!reducer[familyName]) {
						reducer[familyName] = { active: false, products: [] };
					}

					reducer[familyName].active =
						familyName === selectedFamily ||
						(selectedFamily.endsWith('-asset') && selectedFamily.startsWith(familyName));

					reducer[familyName].products.push(item);
				}

				return reducer;
			}, {});
		},

		productsCard({ categorizedProducts }) {
			const normalizeFamilyId = (str) => str?.replace(/currency-\w+\b-/g, 'currency-');

			return Object.entries(categorizedProducts).reduce(
				(reducer, [family, { active, products }]) => {
					const familyId = family.includes('/') ? family.split('/')[0] : family;
					const productType = normalizeFamilyId(familyId);
					const isLoan = familyId === 'loan';
					const isCurrency = familyId?.includes('currency');
					const isSubscription = familyId === 'subscription';
					const isInvestmentProduct = familyId === 'investment';
					const hasMoreThanOne = products?.length > 1;
					const product = products[0];
					const currencyId = product?.balance?.currency?.id?.toLowerCase();
					let link = { name: 'product', params: { familyId, productId: product?.id } };

					if (hasMoreThanOne && !isSubscription) {
						link = { name: 'product-group', params: { familyId } };
					}

					if (isSubscription) {
						link = { name: 'premium', params: { familyId } };
					}

					if (isInvestmentProduct) {
						link = {
							name: 'sso-lighthouse',
							params: { productId: product?.id, operative: 'portfolioAssessment' },
						};
					}

					const { length } = products;
					const uppercaseType = productType.toUpperCase();
					const currency = isCurrency ? this.$t(`CURRENCY.${currencyId.toUpperCase()}`) : '';
					const title = this.$tc(`MY_PRODUCT.${uppercaseType}`, length, { currency });
					const subtitle =
						!hasMoreThanOne && !isInvestmentProduct ? this.$pn(product.productNumber) : '';
					const productNumber = product?.productNumber?.value;
					const accessibleSubtitle =
						!hasMoreThanOne && !isInvestmentProduct
							? this.$t('PRODUCT_NUMBER_ENDED_IN', {
									productNumber: productNumber?.substring(productNumber.length - 4),
							  })
							: '';
					const isHefame = familyId === 'hefame-account';
					const isCreditCard = familyId === 'credit-card';
					const sumProperty = isCreditCard || isHefame ? 'postedBalance' : 'balance';
					const info = !isInvestmentProduct
						? this.$nc(sumAmounts(products, sumProperty), { absolute: isLoan })
						: '';
					const subinfo = info ? this.$tc(`MY_PRODUCT.${uppercaseType}.BALANCE`, length) : '';
					const icon = iconsByFamily[familyId];

					reducer.push({
						familyId,
						active,
						icon,
						link,
						title,
						subtitle,
						accessibleSubtitle,
						info,
						subinfo,
					});

					return reducer;
				},
				[]
			);
		},
	},

	methods: {
		refreshProducts() {
			this.getProducts(true);
		},

		async getProducts(refresh) {
			this.fetched = false;
			this.error = false;

			clearTimeout(this.timerLoading);
			this.timerLoading = setTimeout(() => {
				this.timerLoading = null;
				this.loading = true;
			}, 200);

			try {
				this.products = await this.$store.dispatch('products/fetch', { refresh });
				this.$emit('products', this.products);
			} catch {
				this.error = true;
			}

			clearTimeout(this.timerLoading);
			this.timerLoading = null;
			this.loading = false;
			this.fetched = true;
		},

		goto(link) {
			if (this.$route.name !== 'global') {
				window.history.pushState({}, '', this.$router.resolve({ name: 'global' }).href);
			}

			this.$router.push(link).catch(() => window.history.back());
		},

		shouldInsertTheBannerHere(index) {
			const { productsCard, bannerPosition } = this;
			const itemsCount = productsCard.length;

			return (
				(itemsCount >= bannerPosition + 1 && index === bannerPosition - 1) ||
				(itemsCount < bannerPosition + 1 && index === itemsCount - 1)
			);
		},
	},

	created() {
		this.getProducts();
	},
};
</script>

<style lang="scss" scoped>
.w-product-list {
	color: RGB(var(--color-text-primary));
	display: flex;
	flex-direction: column;
}

.w-product-list__button {
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

.w-product-list__banner {
	grid-column: 1/-1;
}

.w-product-list__button[data-type='debit-card'] /deep/ {
	.c-card-item__info,
	.c-card-item__subinfo {
		opacity: 0;
	}
}

.w-product-list__card {
	width: 100%;
}

.placeholder-enter {
	opacity: 0;
	transform: translateY(-5px);
}

.placeholder-leave-active {
	opacity: 0;
	transform: translateY(40%);
}

.placeholder-enter-active {
	transition: transform 400ms ease-in-out, opacity 400ms ease-in-out;
}

.placeholder-leave-active {
	transition: opacity 400ms ease-in-out, transform 400ms ease-in-out;
	transition-delay: 400ms;
}

.placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 200ms;
}

.placeholder-leave-active ~ .placeholder-leave-active ~ .placeholder-leave-active {
	transition-delay: 0ms;
}

.w-product-list__list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	grid-gap: 10px;
}

.w-product-list__main {
	flex-grow: 1;
}

.w-product-list__main.placeholder-leave-active {
	transform: translateY(0);
	transition: opacity 0s ease-in-out;
	transition-delay: 0ms;
}

.w-product-list__message {
	text-align: center;
	margin: 10px 0;
}

.w-product-list__message p {
	padding-top: 10px;
}

.w-product-list__message-icon {
	font-size: 30px;
}

.w-product-list__message-link-text {
	display: block;
	text-decoration: underline;
	padding-top: 10px;
}
</style>
