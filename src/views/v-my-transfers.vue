<template>
	<l-page @beforeLift="viewProductInfoButton = false" @beforeDrop="viewProductInfoButton = true">
		<h1 slot="header" tabindex="-1">{{ $t('TRANSFERS.MY_TRANSFERS.TITLE') }}</h1>

		<c-translide slot="widget">
			<c-slider
				data-testid="slider"
				v-if="products && products.length"
				class="v-my-transfers__slider"
				:selected="selected"
				@change="goto"
			>
				<w-product-widget
					class="v-my-transfers__item-header"
					v-for="product in products"
					:key="product.id"
					:active="false"
					:product="product"
					type="account"
				/>
			</c-slider>
		</c-translide>

		<c-translide slot="main-fixed-header">
			<div v-if="products" class="v-my-transfers__search-header">
				<c-tabs-nav
					data-testid="tabs-nav"
					data-expanded
					v-if="Object.keys(tabs).length"
					class="v-my-transfers__search-header__nav"
					:tabs="tabs"
					@select="selectTab"
				/>
			</div>
		</c-translide>

		<c-translide>
			<c-tabs v-if="products" :external-nav="true">
				<c-tab key="contentOrdered" v-if="tabs.ordered.active">
					<w-transfer-list data-testid="list-ordered" type="ordered" :product-id="productId" />
				</c-tab>
				<c-tab key="contentScheduled" v-if="tabs.scheduled.active">
					<w-transfer-list data-testid="list-scheduled" type="scheduled" :product-id="productId" />
				</c-tab>
				<c-tab key="contentFavorites" v-if="tabs.favorites.active">
					<w-transfer-list data-testid="list-favorite" type="favorite" :product-id="productId" />
				</c-tab>
			</c-tabs>
		</c-translide>
	</l-page>
</template>

<script>
import LPage from '@layouts/l-page';
import CSlider from '@components/c-slider';
import CTranslide from '@components/c-translide';
import CTabs from '@components/c-tabs';
import CTab from '@components/c-tab';
import CTabsNav from '@components/c-tabs-nav';
import moveMoneyModule from '@modules/move-money/m-move-money';
import WProductWidget from '@widgets/w-product-widget';
import WTransferList from '@widgets/w-transfer-list';

export default {
	name: 'v-my-transfers',

	modules: { 'move-money': moveMoneyModule },

	components: {
		LPage,
		CTranslide,
		CSlider,
		CTabs,
		CTab,
		CTabsNav,
		WProductWidget,
		WTransferList,
	},

	data() {
		return {
			products: null,
			viewProductInfoButton: true,
		};
	},

	props: {
		productId: { type: null },
	},

	computed: {
		selectedTab({ $route: { query } }) {
			return parseInt(query?.tab || 0, 10);
		},

		selected({ products, productId }) {
			return products.findIndex(({ id }) => productId === id);
		},

		tabs({ selectedTab }) {
			const model = {
				ordered: {
					hash: 'ordered',
					active: false,
					header: this.$t('TRANSFERS.TYPE.ORDERED'),
				},
				scheduled: {
					hash: 'scheduled',
					active: false,
					header: this.$t('TRANSFERS.TYPE.SCHEDULED'),
				},
				favorites: {
					hash: 'favorites',
					active: false,
					header: this.$t('TRANSFERS.TYPE.FAVORITES'),
				},
			};

			return Object.fromEntries(
				Object.entries(model).map(([key, tab], index) => {
					if (index === selectedTab) {
						Object.assign(tab, { active: true });
					}
					return [key, tab];
				})
			);
		},
	},

	watch: {
		productId(id) {
			if (id === 'first' && this.products) {
				this.goto(0);
			}
		},

		products() {
			if (this.productId === 'first') {
				this.goto(0);
			}
		},

		tabs(tabs) {
			const index = Math.max(0, Object.values(tabs).findIndex(({ active }) => Boolean(active)));

			if (this.selectedTab !== index) {
				this.$router.replace({ ...this.$route, query: { tab: index } });
			}
		},
	},

	methods: {
		selectTab(event) {
			const { selectedTab, $route } = this;

			if (selectedTab !== event) {
				this.$router.replace({ ...$route, query: { tab: event } });
			}
		},

		goto(index) {
			const { products, productId } = this;

			/* istanbul ignore else */
			if (products?.length && productId !== products[index].id) {
				this.$store.dispatch('modal/close');
				this.$router.replace({
					...this.$route,
					params: { productId: products[index].id },
				});
			}
		},

		async getOrigins() {
			this.products = await this.$store.dispatch('move-money/getOrigins', {
				type: 'transferList',
			});
		},
	},

	mounted() {
		this.getOrigins();
	},
};
</script>

<style lang="scss" scoped>
.v-my-transfers__search-header {
	display: flex;
	align-items: center;
	color: RGB(var(--color-text-primary));
	position: relative;
	padding: 0 20px;
}

.v-my-transfers__search-header__nav {
	flex-grow: 1;
}
</style>
