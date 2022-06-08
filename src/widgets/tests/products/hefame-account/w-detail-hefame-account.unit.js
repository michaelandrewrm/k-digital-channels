import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/hefame-account/w-detail-hefame-account';
import accounts from '@tests/fixtures/products/accounts';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-detail-hefame-account', () => {
	let wp;
	let store;
	let router;

	const fixture = {
		...accounts[0],
		interveners: [],
		productFamily: 'account',
	};

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		wp = shallowMount(Component, { localVue, store, router, propsData: { detail: fixture } });
	});

	it('has a name equal to w-detail-hefame-account', () => {
		expect(wp.vm.$options.name).toBe('w-detail-hefame-account');
	});
});
