<template>
	<l-page>
		<div class="v-bizum-welcome__popup" slot="state" v-if="!welcomed">
			<img class="v-bizum-welcome__bizum-image" src="@assets/img/mockup-bizum-ios.jpg" alt="" />
			<img
				class="v-bizum-welcome__bizum-logo"
				src="@assets/img/bizumLogo.svg"
				alt=""
				width="110"
				height="33"
			/>

			<c-translide>
				<c-button
					class="v-bizum-welcome__bizum-cta"
					v-if="!welcomed && fetched"
					raised
					@click="welcomed = true"
					data-testid="start"
				>
					{{ $t('ACTIONS.START') }}
				</c-button>
			</c-translide>
		</div>

		<h1 slot="header" tabindex="-1">{{ $t('BIZUM.TITLE') }}</h1>

		<div v-if="error" class="v-bizum-welcome__error" data-testid="operation-error">
			<c-icon class="v-bizum-welcome__error-icon" src="@icons/modalExclamation" />
			<p class="text-m-book">{{ errorDetail }}</p>
		</div>

		<section v-if="!error">
			<h2 class="v-bizum-welcome__mbottom text-m-medium">{{ $t('BIZUM.REGISTER.TITLE') }}</h2>
			<p class="v-bizum-welcome__mbottom text-s-light">{{ $t('BIZUM.REGISTER.DESC') }}</p>

			<div v-if="fetched" key="resources" data-testid="list" class="v-bizum-welcome__list">
				<template v-for="product in viewProducts">
					<button
						data-testid="product-select"
						:key="product.id"
						class="v-bizum-welcome__button"
						@click="select(product.id)"
					>
						<c-card-item
							class="w-product-list__card"
							:icon="product.icon"
							:title="product.alias"
							:sub-title="$pn(product.productNumber)"
							:accessible-sub-title="
								$t('PRODUCT_NUMBER_ENDED_IN', { productNumber: product.productNumber.value })
							"
							:info="$nc(product.balance)"
							:sub-info="product.info"
							data-testid="product-card-item"
							:active="selected === product.id"
						/>
					</button>
				</template>

				<div class="v-bizum-welcome__phone">
					<c-list-icon-item
						:title="$t('DETAIL.LINKED_PHONE')"
						:description="phone"
						icon="@icons/cellphone"
					/>
				</div>
			</div>
		</section>

		<c-button
			v-if="welcomed && selected"
			raised
			slot="buttons"
			data-testid="submit"
			@click="submit"
		>
			{{ $t('ACTIONS.CONTINUE') }}
		</c-button>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import bizumModule from '@modules/bizum/m-bizum';
import productsModule from '@modules/products/m-products';
import CCardItem from '@components/c-card-item';
import iconsByFamily from '@modules/products/product-icons';
import CListIconItem from '@components/c-list-icon-item';
import CButton from '@components/c-button';
import CTranslide from '@components/c-translide';
import CIcon from '@components/c-icon';

export default {
	name: 'v-bizum-welcome',

	modules: {
		products: productsModule,
		bizum: bizumModule,
	},

	components: {
		LPage,
		CCardItem,
		CListIconItem,
		CButton,
		CTranslide,
		CIcon,
	},

	data() {
		return {
			fetched: false,
			loading: false,
			error: false,
			errorDetail: '',
			products: null,
			phone: null,
			selected: null,
			welcomed: false,
		};
	},

	computed: {
		viewProducts({ products }) {
			return products?.map((product) => {
				const { id, alias, productNumber, balance } = product;
				const type = product.productFamily;
				const namedType = type.toUpperCase();
				const icon = iconsByFamily[type] || /* istanbul ignore next */ iconsByFamily.account;
				const info = this.$tc(`MY_PRODUCT.${namedType}.BALANCE`, 1);

				return {
					id,
					icon,
					info,
					alias,
					balance,
					productNumber,
				};
			});
		},
	},

	created() {
		this.refresh();
	},

	methods: {
		refresh() {
			this.fetch();
		},

		async fetch() {
			const { dispatch } = this.$store;
			const getProducts = dispatch('products/byService', 'bizum');
			const getPersonalDetails = dispatch('user/getPersonalDetails');
			const getTerms = dispatch('bizum/getTerms');
			const isActive = await dispatch('bizum/isActive');

			this.error = false;
			this.fetched = false;
			this.loading = true;

			if (isActive) {
				return this.$router.back();
			}

			return Promise.all([getProducts, getPersonalDetails, getTerms])
				.then(([products, { data: { phone } }]) => {
					this.products = products;
					this.phone = phone;

					if (!products?.length) {
						this.error = true;
						this.errorDetail = this.$t('BIZUM.REGISTER_WITH_NO_PRODUCTS');
					} else if (products.length === 1) {
						this.selected = products[0].id;
					}
				})
				.catch(() => {
					this.error = true;
					this.errorDetail = this.$t('BIZUM.TEMP_ERROR');
				})
				.finally(() => {
					this.loading = false;
					this.fetched = true;
				});
		},

		select(id) {
			if (this.selected === id) {
				this.selected = null;
			} else {
				this.selected = id;
			}
		},

		submit() {
			this.$router.push({ name: 'bizum-register', params: { productId: this.selected } });
		},
	},
};
</script>

<style lang="scss" scoped>
.v-bizum-welcome__list {
	margin-top: 25px;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	grid-gap: 10px;
}

.v-bizum-welcome__button {
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

.v-bizum-welcome__mbottom {
	margin-bottom: 10px;
}

.v-bizum-welcome__phone {
	margin-top: 20px;
	padding-top: 20px;
	padding-bottom: 20px;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.v-bizum-welcome__popup {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
}

.v-bizum-welcome__bizum-logo {
	margin-bottom: 30px;
	margin-top: 40px;
	color: white;
	position: relative;
	z-index: 0;
}

.v-bizum-welcome__bizum-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	position: absolute;
}

.v-bizum-welcome__bizum-cta {
	width: 100%;
	max-width: 280px;
	margin-bottom: 30px;
}

.v-bizum-welcome__error {
	text-align: center;
	margin: 10px 0;
}

.v-bizum-welcome__error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
}
</style>
