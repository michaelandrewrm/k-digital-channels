import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/hefame-account/w-actions-hefame-account';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-actions-hefame-account', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.registerModule('resources', { namespaced: true, state: { hasResult: true } });

		wp = shallowMount(Component, { localVue, store, router });
	});

	it('has a name equal to w-actions-hefame-account', () => {
		expect(wp.vm.$options.name).toBe('w-actions-hefame-account');
	});
});
