import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-product-widget';
import accounts from '@tests/fixtures/products/accounts';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-widget', () => {
	let wp;
	let store;
	let router;

	const fixture = {
		...accounts[3],
		productFamily: 'currency-account',
	};
	const fetch = jest.fn().mockResolvedValue();

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.registerModule('app', { namespaced: true, state: { companyId: 'BF' } });
		store.mockModule('resources', { fetch });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { product: fixture, type: 'account' },
			stubs: ['w-product-account'],
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to w-product-widget', () => {
		expect(wp.vm.$options.name).toBe('w-product-widget');
	});

	it('should render a widget', () => {
		expect(wp.findComponent({ name: 'w-product-account' }).exists()).toBeTruthy();
	});

	it('should open a modal', () => {
		const push = jest.spyOn(router, 'push');

		wp.findComponent({ name: 'w-product-account' }).vm.$emit('expand');

		expect(push).toHaveBeenCalledWith({
			name: 'product-detail',
			params: { productId: 'account-4', familyId: 'currency-usd-account' },
		});
	});
});
