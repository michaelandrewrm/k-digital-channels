import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/hefame-account/w-movement-detail-hefame-account';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-detail-hefame-account', () => {
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
			propsData: { movement: {} },
		});
	});

	it('has a name equal to w-movement-detail-hefame-account', () => {
		expect(wp.vm.$options.name).toBe('w-movement-detail-hefame-account');
	});
});
