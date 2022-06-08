<template>
	<l-page>
		<h1 slot="header" tabindex="-1">{{ $t('BIZUM.TITLE').concat(' - ', $t('SETTINGS')) }}</h1>

		<div v-if="error" class="v-bizum-settings__error" data-testid="operation-error">
			<c-icon class="v-bizum-settings__error-icon" src="@icons/modalExclamation" />
			<p class="text-m-book">{{ $t('BIZUM.TEMP_ERROR') }}</p>
		</div>

		<section v-if="!error">
			<h2 class="v-bizum-settings__mbottom text-m-medium">
				{{ $t('BIZUM.REGISTER.ASSOCIATED_ACCOUNT') }}
			</h2>
			<p class="v-bizum-settings__mbottom text-s-light">
				{{ $t('BIZUM.REGISTER.SELECT_ACCOUNT') }}
			</p>

			<div class="v-bizum-settings__wrapper">
				<transition name="placeholder" mode="out-in">
					<div v-if="fetched" key="resources" data-testid="list" class="v-bizum-settings__list">
						<template v-for="product in viewProducts">
							<button
								data-testid="product-select"
								:key="product.id"
								class="v-bizum-settings__button"
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
					</div>

					<c-placeholder-movement v-if="loading" key="placeholder" />
				</transition>

				<transition name="placeholder">
					<c-placeholder-movement v-if="loading" />
				</transition>

				<transition name="placeholder">
					<c-placeholder-movement v-if="loading" />
				</transition>
			</div>
		</section>

		<c-button
			v-if="selected && product.id !== selected"
			raised
			slot="buttons"
			data-testid="submit"
			@click="submit"
		>
			{{ $t('ACTIONS.CONFIRM') }}
		</c-button>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import bizumModule from '@modules/bizum/m-bizum';
import productsModule from '@modules/products/m-products';
import CCardItem from '@components/c-card-item';
import iconsByFamily from '@modules/products/product-icons';
import CButton from '@components/c-button';
import CIcon from '@components/c-icon';
import CPlaceholderMovement from '@components/c-placeholder-movement';

export default {
	name: 'v-bizum-settings',

	modules: {
		products: productsModule,
		bizum: bizumModule,
	},

	components: {
		LPage,
		CCardItem,
		CButton,
		CIcon,
		CPlaceholderMovement,
	},

	data() {
		return {
			sending: false,
			fetched: false,
			loading: false,
			error: false,
			product: null,
			products: null,
			selected: null,
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

			const getProduct = dispatch('bizum/getProduct');
			const getProducts = dispatch('products/byService', 'bizum');

			this.error = false;
			this.fetched = false;
			this.loading = true;
			this.sending = false;

			Promise.all([getProduct, getProducts])
				.then(([product, products]) => {
					this.product = product;
					this.products = products;
					this.selected = product.id;
				})
				.catch(() => {
					this.error = true;
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
			const { dispatch } = this.$store;
			const SUCCESS_MESSAGE = this.$t('BIZUM.REGISTER.CHANGE_ACCOUNT.SUCCESS');
			const ERROR_MESSAGE = this.$t('BIZUM.REGISTER.CHANGE_ACCOUNT.ERROR');

			/* istanbul ignore else */
			if (!this.sending) {
				this.sending = true;

				dispatch('bizum/setProduct', this.selected)
					.then(() => {
						dispatch('notification/open', { text: SUCCESS_MESSAGE });
					})
					.catch(() => {
						dispatch('notification/open', { text: ERROR_MESSAGE });
					})
					.then(() => this.$router.back());
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.v-bizum-settings__wrapper {
	margin-top: 25px;
}

.v-bizum-settings__list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.v-bizum-settings__button {
	appearance: none;
	background: transparent;
	border: 0;
	margin: 0;
	padding: 0;
	display: block;
	width: 100%;
	text-align: left;
	position: relative;
	margin-bottom: 10px;
}

.v-bizum-settings__mbottom {
	margin-bottom: 10px;
}

.v-bizum-settings__phone {
	margin-top: 20px;
	padding-top: 20px;
	padding-bottom: 20px;
	border-top: 1px solid RGBA(var(--color-text-primary), 0.15);
	border-bottom: 1px solid RGBA(var(--color-text-primary), 0.15);
}

.v-bizum-settings__error {
	text-align: center;
	margin: 10px 0;
}

.v-bizum-settings__error-icon {
	margin-bottom: 10px;
	color: RGB(var(--color-accent-error));
	font-size: 30px;
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
</style>
