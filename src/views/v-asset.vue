<template>
	<l-details @beforeLift="viewProductInfoButton = false" @beforeDrop="viewProductInfoButton = true">
		<h1 slot="header" tabindex="-1">{{ pageTitle }}</h1>

		<c-translide slot="widget">
			<c-slider v-if="assets" class="v-asset__slider" :selected="selected" @change="goto">
				<w-product-widget
					class="v-asset__item-header"
					v-for="asset in assets"
					:key="asset.id"
					:active="asset.id == assetId && viewProductInfoButton"
					:product="asset"
					type="fund-asset"
				/>
			</c-slider>
		</c-translide>

		<c-translide slot="main-header">
			<div v-if="assets" class="v-asset__search-header">
				<c-icon-button
					class="v-asset__search-header__cancel-search-button"
					icon="@icons/close"
					:aria-label="$t('MOVEMENT.CANCEL_SEARCH')"
					v-if="search && false"
					@click="$router.back()"
				/>
				<c-tabs-nav
					class="v-asset__search-header__nav"
					:tabs="tabs"
					@select="selectedTab = $event"
				/>
				<c-icon-button
					class="v-asset__search-header__search-button"
					icon="@icons/search"
					:aria-label="$t('MOVEMENT.SEARCH_TITLE')"
					v-if="!search && false"
					@click="
						$router.push({
							name: 'search-movements',
							params: { productId: asset.id },
						})
					"
				/>
			</div>
		</c-translide>

		<c-translide>
			<c-tabs v-if="asset" :external-nav="true">
				<c-tab key="contentMovements" v-show="tabs.movements.active">
					<w-product-resource-list
						resource="movement"
						type="fund-asset"
						:product-id="`${productId}/assets/${assetId}`"
						:query="{
							dateFrom: $route.query.dateFrom,
							dateTo: $route.query.dateTo,
							reason: $route.query.reason,
						}"
						:last-resource="lastResource"
					/>
				</c-tab>
			</c-tabs>
		</c-translide>

		<w-product-actions :product="asset" type="fund" slot="buttons" />
	</l-details>
</template>

<script>
import CSlider from '@components/c-slider';
import CTranslide from '@components/c-translide';
import CIconButton from '@components/c-icon-button';
import CTabs from '@components/c-tabs';
import CTab from '@components/c-tab';
import CTabsNav from '@components/c-tabs-nav';
import LDetails from '@layouts/l-details';
import WProductWidget from '@widgets/w-product-widget';
import WProductActions from '@widgets/w-product-actions';
import WProductResourceList from '@widgets/w-product-resource-list';

import moduleResources from '@modules/resources/m-resources';
import moduleProducts from '@modules/products/m-products';

export default {
	name: 'v-asset',

	modules: {
		products: moduleProducts,
		resources: moduleResources,
	},

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
	},

	data() {
		return {
			assets: null,
			asset: null,
			selected: 0,
			viewProductInfoButton: true,
			selectedTab: 0,
			lastResource: '',
		};
	},

	props: {
		productId: { type: null },
		assetId: { type: null },
	},

	beforeRouteEnter(to, from, next) {
		next((vm) => vm.tabsHandler(from));
	},

	computed: {
		search({ $route: { query } }) {
			return query.search;
		},

		pageTitle({ asset, assets }) {
			/* istanbul ignore next */
			if (!asset || !assets) {
				return '';
			}

			return this.$tc('MY_PRODUCT.FUND', assets.length);
		},

		tabs({ search, selectedTab }) {
			const model = {
				movements: {
					hash: 'movements',
					active: false,
					header: search
						? /* istanbul ignore next */ this.$t('MOVEMENT.SEARCH_RESULTS')
						: this.$t('MOVEMENT.LAST_MOVEMENTS'),
				},
			};

			return Object.fromEntries(
				Object.entries(model).map(([key, tab], index) => {
					/* istanbul ignore else */
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
					const { dispatch } = this.$store;
					const product = await dispatch('products/get', productId);
					const { data } = await dispatch('resources/fetch', { resource: 'assets', productId });

					const newAssets = data.reduce((reducer, asset) => {
						const newAsset = {
							...asset,
							alias: asset.name,
							asset: true,
							balance: asset.effectiveValue,
							multifundName: product.name,
							productId,
							productSubtype: product.productSubtype,
							productType: product.productType,
							productFamily: product.productFamily,
						};
						reducer.push(newAsset);
						return reducer;
					}, []);

					this.assets = newAssets;
					this.asset = this.assets.find(({ id }) => this.assetId === id);
					this.selected = this.assets.findIndex(({ id }) => this.assetId === id);
				}
			},
		},
	},

	methods: {
		tabsHandler({ params }) {
			const { movementId } = params;
			this.lastResource = movementId;
		},

		goto(index) {
			const { assets, assetId, productId } = this;

			if (assets && assets[index]?.id !== assetId) {
				this.$router.replace({
					name: this.$route.name,
					params: { productId, assetId: assets[index].id },
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.v-asset__search-header {
	display: flex;
	align-items: center;
	color: RGB(var(--color-text-primary));
	position: relative;
}

.v-asset__search-header__nav {
	flex-grow: 1;
}

.v-asset__search-header__cancel-search-button {
	justify-content: flex-start;
	padding: 0;
	margin: 0;
}

.v-asset__search-header__search-button {
	position: absolute;
	right: 0;
}
</style>
