import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-sirvase-detail';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-sirvase-detail.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { localRouter, shallowStore } = newInstance;

		store = shallowStore;
		router = localRouter;

		wp = shallowMount(Component, { localVue, store, router, propsData: { requestId: '' } });
	});

	it('has a name equal to v-sirvase-detail', () => {
		expect(wp.vm.$options.name).toBe('v-sirvase-detail');
	});
});
