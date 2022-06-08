<template>
	<l-details @beforeLift="viewProductInfoButton = false" @beforeDrop="viewProductInfoButton = true">
		<h1 slot="header" tabindex="-1">{{ pageTitle }}</h1>

		<c-translide slot="widget">
			<c-slider
				v-if="source"
				data-testid="slider"
				class="v-composition__slider"
				:selected="selected"
				@change="changeType"
			>
				<w-widget-composition
					v-for="composition in group"
					:source="composition"
					:active="composition.type === type"
					:key="composition.type"
				></w-widget-composition>
			</c-slider>
		</c-translide>

		<c-translide slot="main-header">
			<div v-if="source" class="v-composition__search-header">
				<c-tabs-nav
					data-testid="tabs-nav"
					class="v-composition__search-header__nav"
					:tabs="tabs"
					@select="changeTab(Object.keys(tabs)[$event])"
				/>
			</div>
		</c-translide>

		<c-translide>
			<c-tabs v-if="source" :external-nav="true">
				<c-tab
					key="contentComposition"
					v-show="tabs.composition.active"
					data-testid="data-composition"
					:data-active="tabs.composition.active"
				>
					<router-link
						v-for="asset in assets"
						:key="asset.isin"
						tag="button"
						class="v-composition__asset"
						:to="{ name: 'investment-asset', params: { productId, familyId, assetId: asset.isin } }"
					>
						<div class="v-composition__asset__wrapper">
							<span class="text-m-medium">{{ asset.isinDescription }}</span>
							<span class="text-m-medium v-composition__asset__wrapper_col2">
								{{
									$nc({
										amount: asset.availableTitles * asset.marketPrice.amount,
										currency: asset.marketPrice.currency,
									})
								}}
							</span>
							<span class="text-s-book">{{ asset.isin }}</span>
							<span class="text-s-book v-composition__asset__wrapper_titles">
								{{
									$tc('DETAIL.EQUITIES_QUANTITY', asset.availableTitles, {
										n: $n(asset.availableTitles),
									})
								}}
							</span>
						</div>
					</router-link>
				</c-tab>

				<c-tab
					key="contentMovements"
					v-show="tabs.movements.active"
					data-testid="data-movements"
					:data-active="tabs.movements.active"
				>
					<w-product-resource-list
						resource="movement"
						type="investment-portfolio"
						:product-id="productId"
						:query="{
							dateFrom: $route.query.dateFrom,
							dateTo: $route.query.dateTo,
							reason: $route.query.reason,
							type,
						}"
					/>
				</c-tab>
			</c-tabs>
		</c-translide>
	</l-details>
</template>

<script>
import CSlider from '@components/c-slider';
import CTranslide from '@components/c-translide';
import CTabs from '@components/c-tabs';
import CTab from '@components/c-tab';
import CTabsNav from '@components/c-tabs-nav';
import LDetails from '@layouts/l-details';
import WWidgetComposition from '@widgets/products/investment-portfolio/w-widget-composition';
import WProductResourceList from '@widgets/w-product-resource-list';

import moduleProducts from '@modules/products/m-products';

export default {
	name: 'v-composition',

	modules: {
		products: moduleProducts,
	},

	components: {
		LDetails,
		CTranslide,
		CSlider,
		CTabs,
		CTab,
		CTabsNav,
		WWidgetComposition,
		WProductResourceList,
	},

	data() {
		return {
			source: null,
		};
	},

	props: {
		familyId: { type: String },
		productId: { type: String },
		type: { type: String },
		tab: {
			type: String,
			default: 'composition',
			validator: (value) => ['composition', 'movements'].includes(value),
		},
	},

	computed: {
		pageTitle({ source }) {
			return source?.alias || '';
		},

		tabs({ tab: tabName }) {
			const model = {
				composition: {
					hash: 'composition',
					active: false,
					header: this.$t('MOVEMENT.BROKER_COMPOSITION'),
				},

				movements: {
					hash: 'movements',
					active: false,
					header: this.$t('MOVEMENT.LAST_MOVEMENTS'),
				},
			};

			return Object.fromEntries(
				Object.entries(model).map(([key, tab]) => {
					if (key === tabName) {
						Object.assign(tab, { active: true });
					}
					return [key, tab];
				})
			);
		},

		group({ source }) {
			return source.assets.reduce((reducer, { productTypeCode, marketPrice, availableTitles }) => {
				if (reducer[productTypeCode]) {
					reducer[productTypeCode].balance += availableTitles * marketPrice; // eslint-disable-line no-param-reassign
				} else {
					// eslint-disable-next-line no-param-reassign
					reducer[productTypeCode] = {
						type: productTypeCode,
						balance: availableTitles * marketPrice,
					};
				}

				return reducer;
			}, {});
		},

		assets({ source, type }) {
			return source.assets.filter(({ productTypeCode }) => productTypeCode === type);
		},

		selected({ group, type: typeParam }) {
			return Object.keys(group).findIndex((type) => type === typeParam);
		},
	},

	watch: {
		productId: {
			immediate: true,
			async handler(productId) {
				if (productId) {
					this.source = await this.$store.dispatch('products/get', productId);
				}
			},
		},
	},

	methods: {
		changeTab(tab) {
			const { type, productId, familyId } = this;

			this.$router.replace({
				name: this.$route.name,
				params: { familyId, productId, type, tab },
			});
		},

		changeType(index) {
			const { group, type, tab, productId, familyId } = this;
			const selectedType = Object.keys(group)[index];

			/* istanbul ignore else */
			if (type !== selectedType) {
				this.$router.replace({
					name: this.$route.name,
					params: { familyId, productId, type: selectedType, tab },
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.v-composition__search-header {
	display: flex;
	align-items: center;
	color: RGB(var(--color-text-primary));
	position: relative;
}

.v-composition__search-header__nav {
	flex-grow: 1;
}

.v-composition__asset {
	appearance: none;
	background: RGB(var(--color-surface-light));
	border: 0;
	padding: 15px 10px;
	display: block;
	width: 100%;
	text-align: left;
	border-radius: $border-radius-xs;
	box-shadow: 0 4px 8px -3px rgba(0, 0, 0, 0.07);
	margin: 10px 0;
	position: relative;
}

.v-composition__asset__wrapper {
	color: RGB(var(--color-text-primary));
	display: grid;
	grid-template-columns: 1fr fit-content(100px);
	grid-template-rows: min-content;
	grid-gap: 10px;
	align-items: center;
}

.v-composition__asset__wrapper_col2 {
	text-align: right;
}

.v-composition__asset__wrapper_titles {
	text-align: right;
	width: fit-content;
	padding: 4px 6px;
	background-color: RGB(var(--color-surface-dark));
	border-radius: 4px;
	white-space: nowrap;
	justify-self: flex-end;
}
</style>
