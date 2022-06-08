import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-sirvase-dashboard.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-sirvase-dashboard.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { localRouter, shallowStore } = newInstance;

		router = localRouter;
		store = shallowStore;

		wp = shallowMount(Component, { localVue, store, router });
	});

	it('has a name equal to v-sirvase-dashboard', () => {
		expect(wp.vm.$options.name).toBe('v-sirvase-dashboard');
	});
});
