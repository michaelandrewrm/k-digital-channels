<template>
	<l-page :loading="loading">
		<h1 slot="header" tabindex="-1" data-testid="header">{{ $t('ONTIME.TITLE') }}</h1>

		<c-operation-success v-if="success" slot="state">
			<template v-slot:title>
				{{ $t('ONTIME.CONFIGURE.SUCCESS.TITLE') }}
			</template>

			<p class="text-m-book">{{ $t('ONTIME.CONFIGURE.SUCCESS.DESC') }}</p>

			<c-button raised slot="buttons" data-testid="continue" @click="$router.back()">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</c-operation-success>

		<c-operation-error v-if="error" slot="state" contactUs @confirm="$router.back()">
			<template v-slot:title>
				{{ $t('ONTIME.CONFIGURE.ERROR.TITLE') }}
			</template>

			<p class="text-m-book">{{ $t('ONTIME.CONFIGURE.ERROR.DESC') }}</p>

			<c-button raised slot="buttons" data-testid="continue">
				{{ $t('ACTIONS.ACCEPT') }}
			</c-button>
		</c-operation-error>

		<div class="v-ontime-create__content">
			<div class="v-ontime-create__content-title text-m-medium">
				{{ $t('ONTIME.CONFIGURE.CONTENT.TITLE', { companyName }) }}
			</div>
			<div class="v-ontime-create__content-desc text-m-book">
				{{ $t('ONTIME.CONFIGURE.CONTENT.DESC') }}
			</div>
			<div class="v-ontime-create__products-list">
				<transition name="placeholder" mode="out-in">
					<c-placeholder-movement v-if="loadingItems && !fetchedItems" data-testid="placeholder" />

					<div
						v-else-if="fetchedItems && errorItems"
						class="v-ontime-create__error"
						data-testid="error"
					>
						<c-icon class="v-ontime-create__error-icon" src="@icons/modalExclamation" />
						<p class="text-m-book">{{ $t('ONTIME.DASHBOARD.ERROR.MOVEMENTS') }}</p>
						<c-contact-support-info />
					</div>

					<div v-else-if="fetchedItems && Object.keys(productsGroup).length">
						<div class="v-ontime-create__wrapper" v-for="group in productsGroup" :key="group.id">
							<ul :id="group.id" class="v-ontime-create__list">
								<li class="v-ontime-create__list-title text-m-medium">
									<c-checkbox
										class="v-ontime-create__list-title-checkbox"
										v-model="group.selected"
										@change="toggleGroup(group)"
										:data-testid="group.id"
									/>
									<div>{{ group.title }}</div>
								</li>
								<li
									class="v-ontime-create__list-item"
									v-for="item in group.products"
									:key="item.id"
								>
									<c-ontime-product
										v-model="item.selected"
										:id="item.id"
										:title="item.title"
										:subtitle="item.subtitle"
										:info="item.info"
										:subinfo="item.subinfo"
										@select-item="toggleItem(group, item)"
									/>
								</li>
							</ul>
						</div>
					</div>
				</transition>

				<transition name="placeholder">
					<c-placeholder-movement v-if="loadingItems && !fetchedItems" />
				</transition>

				<transition name="placeholder">
					<c-placeholder-movement v-if="loadingItems && !fetchedItems" />
				</transition>
			</div>
		</div>

		<w-actions v-if="Object.keys(productsGroup).length" :options="actionOptions" slot="buttons" />
	</l-page>
</template>

<script>
import { mapState } from 'vuex';
import LPage from '@layouts/l-page';
import COperationError from '@components/c-operation-error';
import COperationSuccess from '@components/c-operation-success';
import COntimeProduct from '@components/c-profile-product';
import CCheckbox from '@components/c-checkbox';
import CButton from '@components/c-button';
import CPlaceholderMovement from '@components/c-placeholder-movement';
import CContactSupportInfo from '@components/c-contact-support-info';
import CIcon from '@components/c-icon';
import WActions from '@widgets/w-actions';
import SessionCache from '@modules/session/session-cache';
// import { intervenersById } from '@modules/products/product-interveners';
import { subtypesById } from '@modules/products/product-subtypes';
import productFamilies from '@modules/products/product-families';

export default {
	name: 'v-ontime-create',

	components: {
		LPage,
		COperationError,
		COperationSuccess,
		COntimeProduct,
		CCheckbox,
		CButton,
		CPlaceholderMovement,
		CContactSupportInfo,
		CIcon,
		WActions,
	},

	data() {
		return {
			loading: false,
			success: false,
			error: false,
			errorItems: false,
			loadingItems: false,
			fetchedItems: false,
			products: [],
			lastProducts: [],
			productsGroup: {},
			disableAction: true,
		};
	},

	computed: {
		...mapState('app', ['companyId']),
		...mapState('ontime', ['isWelcome']),

		companyName({ companyId }) {
			return companyId === 'BC' ? 'Caminos' : 'Bancofar';
		},

		actionOptions({ disableAction }) {
			return [
				{
					id: 'configure',
					title: this.$t('ACTIONS.ACCEPT'),
					action: this.submit,
					disabled: disableAction,
				},
			];
		},
	},

	methods: {
		submit() {
			this.loading = true;

			const productsOnTime = this.products.filter(({ id, onTime }) => {
				const itemData = this.lastProducts.find(({ id: itemId }) => itemId === id);

				return itemData?.onTime !== onTime;
			});

			const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
			const { dispatch } = this.$store;

			wait(1000).then(() =>
				dispatch('ontime/create', { productsOnTime })
					.then(() => dispatch('session/deleteCache'))
					.then(() => {
						this.success = true;

						SessionCache.clear('products');
					})
					.catch(() => {
						this.error = true;
					})
					.finally(() => {
						this.loading = false;
					})
			);
		},

		toggleGroup({ id: groupId, selected, products }) {
			const productsOnTime = products.map((item) => ({ ...item, selected }));
			this.productsGroup[groupId].products = productsOnTime;

			this.updateProducts(productsOnTime);
		},

		toggleItem({ id: groupId, products }, item) {
			this.productsGroup[groupId].selected = products.every(({ selected }) => selected);
			const productsOnTime = [item];

			this.updateProducts(productsOnTime);
		},

		updateProducts(ids) {
			this.products = this.products.map((item) => {
				const itemData = ids.find(({ id }) => id === item.id);

				return itemData ? { ...item, onTime: itemData.selected } : item;
			});
		},

		categorizeProducts(products) {
			const families = Object.entries(productFamilies);

			return products.reduce((reducer, item) => {
				const { balance, productSubtype } = item;
				const subtype = subtypesById[(productSubtype?.id)];
				const [productFamily] =
					families.find(([, group]) => group.includes(subtype)) || /* istanbul ignore next */ [];
				const validFamilies = [
					'account',
					'hefame-account',
					'currency-account',
					'debit-card',
					'credit-card',
					'subscription',
				];

				/* istanbul ignore else */
				if (validFamilies.includes(productFamily)) {
					const splitFamily = productFamily?.split('-');
					const currency = balance?.currency?.id;
					const typeName =
						currency && currency !== 'EUR'
							? `currency-${currency.toLowerCase()}-${splitFamily[splitFamily.length - 1]}`
							: productFamily;

					if (!reducer[typeName]) {
						Object.assign(reducer, { [typeName]: [] });
					}

					reducer[typeName].push(item);
				}

				return reducer;
			}, {});
		},

		createProductsView(products) {
			let currency;
			const group = products.map(
				({
					id,
					alias,
					productSubtype,
					productNumber,
					balance,
					postedBalance,
					// relationType,
					productFamily,
					onTime,
				}) => {
					currency = balance?.currency?.id?.toLowerCase();
					const isCreditCard = productFamily === 'credit-card';
					const isLoan = productFamily === 'loan';
					const title = alias || /* istanbul ignore next */ productSubtype?.name;
					const subtitle = this.$pn(productNumber);
					const info = isCreditCard /* istanbul ignore next */
						? this.$nc(postedBalance)
						: this.$nc(balance, { absolute: isLoan });
					// const relationTypeName = intervenersById[(relationType?.id)];
					// const subinfo = /* istanbul ignore next */ relationTypeName
					// 	? this.$tc(`ONTIME.CONFIGURE.PRODUCTS.${relationTypeName.toUpperCase()}`, 1)
					// 	: '';
					const subinfo = '';
					return { id, title, subtitle, info, subinfo, selected: onTime };
				}
			);

			return { currency, group };
		},

		getProductsOnTime() {
			this.loadingItems = true;
			this.errorItems = false;

			this.$store
				.dispatch('ontime/get')
				.then((products) => {
					/* istanbul ignore else */
					if (!products?.length) {
						return;
					}

					this.lastProducts = products;
					this.products = products;

					const categories = this.categorizeProducts(products);

					Object.entries(categories).forEach(([type, items]) => {
						const { currency, group } = this.createProductsView(items);
						const typeName = currency !== 'eur' ? type.split(`-${currency}-`).join('-') : type;
						const { length } = items;
						const title = this.$tc(`MY_PRODUCT.${typeName.toUpperCase()}`, length, { currency });

						this.$set(this.productsGroup, type, {
							id: type,
							title,
							products: group,
							selected: group?.every(({ selected }) => selected),
						});
					});
				})
				.catch(() => {
					this.errorItems = true;
				})
				.finally(() => {
					this.fetchedItems = true;
					this.loadingItems = false;
				});
		},
	},

	watch: {
		products: {
			deep: true,
			immediate: true,
			handler(products) {
				this.disableAction = this.lastProducts.every(({ id, onTime }) => {
					const itemData = products.find(({ id: itemId }) => itemId === id);

					return itemData?.onTime === onTime;
				});
			},
		},
	},

	created() {
		this.$store.dispatch('ontime/setWelcome');
		this.getProductsOnTime();
	},
};
</script>

<style lang="scss" scoped>
.v-ontime-create__content {
	padding-top: 20px;
}

.v-ontime-create__products-list {
	margin-top: 20px;
}

.v-ontime-create__content-title {
	margin-bottom: 10px;
}

.v-ontime-create__wrapper {
	margin-bottom: 40px;
}

.v-ontime-create__list-item {
	margin-bottom: 10px;
}

.v-ontime-create__list-title {
	display: flex;
	margin-bottom: 20px;
}

.v-ontime-create__list-title-checkbox {
	--c-checkbox-color: var(--color-text-primary);
}

.v-ontime-create__error {
	max-width: 320px;
	text-align: center;
	margin: 0 auto;
	padding: 30px 0 0;
}

.v-ontime-create__error-icon {
	color: RGB(var(--color-accent-error));
	font-size: 30px;
	margin-bottom: 10px;
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
