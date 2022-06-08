import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-my-transfers.vue';
import origins from '@tests/fixtures/products/accounts';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-my-transfers.vue', () => {
	const moveMoneyOK = {
		namespaced: true,
		actions: { getOrigins: jest.fn().mockResolvedValue(origins) },
	};

	it('has a name equal to v-my-transfers', () => {
		const { localStore, localRouter } = newInstance;
		const store = localStore;
		const router = localRouter;

		store.registerModule('move-money', moveMoneyOK);

		const wp = shallowMount(Component, {
			localVue,
			store,
			router,
		});

		expect(wp.vm.$options.name).toBe('v-my-transfers');
	});

	it('selects the first product on first access', async () => {
		const { localStore, localRouter } = newInstance;
		const store = localStore;
		const router = localRouter;

		store.registerModule('move-money', moveMoneyOK);
		router.push({ name: 'my-transfers', params: { productId: 'first' } });

		const wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: 'first' },
		});

		await flushPromises();

		expect(router.app.$route.params.productId).toBe('account-1');

		await wp.setProps({ productId: router.app.$route.params.productId });

		await router.replace({ query: { tab: 1 } });

		const tabs = wp.findAllComponents({ name: 'w-transfer-list' });

		expect(tabs.length).toBe(1);
		expect(tabs.at(0).attributes('type')).toBe('scheduled');
	});

	it('should not replace the route after select an active tab', async () => {
		const { localStore, localRouter } = newInstance;
		const store = localStore;
		const router = localRouter;
		const replaceSpy = jest.spyOn(router, 'replace');

		store.registerModule('move-money', moveMoneyOK);
		router.push({ name: 'my-transfers', params: { productId: 'first' } });

		const wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: 'first' },
		});

		await flushPromises();

		expect(replaceSpy).toHaveBeenCalledTimes(1);

		await wp.find('[data-testid="tabs-nav"]').vm.$emit('select', 0);
		expect(replaceSpy).toHaveBeenCalledTimes(1);

		await wp.find('[data-testid="tabs-nav"]').vm.$emit('select', 0);
		expect(replaceSpy).toHaveBeenCalledTimes(1);

		await wp.find('[data-testid="tabs-nav"]').vm.$emit('select', 1);
		expect(replaceSpy).toHaveBeenCalledTimes(2);
	});

	it('should show the balance in the card', async () => {
		const { localStore, localRouter } = newInstance;
		const store = localStore;
		const router = localRouter;

		store.registerModule('move-money', moveMoneyOK);

		const WProductWidget = {
			template: `
				<div class="w-product-widget">
					<div class="w-product-account">
						<c-acrylic-sheet>
							<c-icon src="@icons/productFolder" size="" slot="icon" />
							<span class="w-product-account__title text-fixed-m-medium" v-if="product.alias">
								{{ product.alias }}
							</span>
							<span class="w-product-account__balance text-fixed-l-bold" v-if="product.balance">
								{{ $nc(product.balance) }}
							</span>
							<span
								class="w-product-account__subtitle text-fixed-s-medium"
								v-if="product.productNumber"
								aria-hidden="true"
							>
								{{ $pn(product.productNumber) }}
							</span>
							<span class="a11y-hide" v-if="product.productNumber">
								{{ $t('PRODUCT_NUMBER_ENDED_IN', { productNumber: product.productNumber.value }) }}
							</span>
						</c-acrylic-sheet>
					</div>
				</div>
			`,
			props: ['product', 'active'],
			components: { CAcrylicSheet: { template: '<div><slot /></div>' } },
		};

		const wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: {
				productId: 'account-1',
			},
			stubs: {
				'c-translide': { template: '<div><slot /></div>' },
				'w-product-widget': WProductWidget,
			},
			sync: false,
		});

		await flushPromises();

		const accountCards = wp.findAll('.w-product-account');

		expect(accountCards.at(0).exists()).toBeTruthy();
		expect(
			accountCards
				.at(0)
				.find('.w-product-account__balance')
				.text()
		).toMatch('123,45');
	});
});
