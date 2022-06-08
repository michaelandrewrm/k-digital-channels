import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/hefame-account/w-product-hefame-account';
import accounts from '@tests/fixtures/products/accounts';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-hefame-account', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.registerModule('app', { namespaced: true, state: { companyId: 'BF' } });
		store.mockModule('resources', { fetch: jest.fn().mockResolvedValue() });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { product: accounts[0], active: true },
		});
	});

	it('has a name equal to w-product-hefame-account', () => {
		expect(wp.vm.$options.name).toBe('w-product-hefame-account');
	});
});
