import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/hefame-account/w-movement-hefame-account';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-hefame-account', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: {
				source: {
					id: 'movement-1',
					reason: 'COMPRA',
					amount: { currency: { id: 'EUR' }, amount: 123.45 },
					operationDate: '2020-01-02T00:00:00.000Z',
					balance: { currency: { id: 'EUR' }, amount: 123.45 },
					comment: {},
				},
			},
		});
	});

	it('has a name equal to w-movement-hefame-account', () => {
		expect(wp.vm.$options.name).toBe('w-movement-hefame-account');
	});
});
