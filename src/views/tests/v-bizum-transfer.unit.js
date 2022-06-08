import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bizum-transfer';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-bizum-transfer.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('service', { request: jest.fn() });

		wp = shallowMount(Component, { localVue, store });
	});

	it('has a name equal to v-bizum-transfer', () => {
		expect(wp.vm.$options.name).toBe('v-bizum-transfer');
	});
});
