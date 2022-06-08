import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-asset.vue';
import funds from '@tests/fixtures/products/funds';
import fundAssets from '@tests/fixtures/products/fund-assets';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-asset.vue', () => {
	let wp;
	let store;
	let router;

	const productsFetch = jest.fn().mockResolvedValue(funds);
	const get = jest.fn().mockResolvedValue(funds[0]);
	const resourcesFetch = jest.fn().mockResolvedValue({ data: fundAssets });

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('products', { fetch: productsFetch, get });
		store.mockModule('resources', { fetch: resourcesFetch, get });
		store.registerModule('profiles', { namespaced: true, state: { defaultProfile: null } });

		wp = shallowMount(Component, { localVue, store, router });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-asset', () => {
		expect(wp.vm.$options.name).toBe('v-asset');
	});

	it('should browse to the following asset', async () => {
		await router.push({
			name: 'asset',
			params: {
				familyId: 'fund',
				productId: 'fund-1',
				assetId: 'fund-asset-1',
			},
		});

		await wp.setProps({ productId: 'fund-1', assetId: 'fund-asset-1' });
		await flushPromises();

		const replace = jest.spyOn(router, 'replace');

		wp.vm.goto(1);
		await flushPromises();

		expect(replace).toHaveBeenNthCalledWith(1, {
			name: 'asset',
			params: { productId: 'fund-1', assetId: 'fund-asset-2' },
		});
	});

	it('should not browse to the same asset', async () => {
		router.push({
			name: 'asset',
			params: {
				familyId: 'fund',
				productId: 'fund-1',
				assetId: 'fund-asset-1',
			},
		});

		await wp.setProps({ productId: 'fund-1', assetId: 'fund-asset-1' });
		await flushPromises();

		const replace = jest.spyOn(router, 'replace');

		wp.vm.goto(0);
		await flushPromises();

		expect(replace).not.toHaveBeenCalled();

		wp.vm.goto(0);
		await flushPromises();

		expect(replace).not.toHaveBeenCalled();
	});

	it('should set last visited resource', async () => {
		router.push({
			name: 'asset',
			params: {
				familyId: 'fund',
				productId: 'fund-1',
				assetId: 'fund-asset-1',
			},
		});
		await flushPromises();

		router.push({
			name: 'movement',
			params: {
				productId: 'fund-1',
				movementId: 'fund-movement-1',
				productType: 'fund-asset',
			},
		});
		await flushPromises();

		const from = router.currentRoute;
		await router.back();

		const next = jest.fn((cb) => cb(wp.vm));
		Component.beforeRouteEnter.call(wp.vm, router.currentRoute, from, next);

		expect(wp.vm.lastResource).toBe('fund-movement-1');
	});
});
