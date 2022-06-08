import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-sirvase-create.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-sirvase-create.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, shallowRouter } = newInstance;

		store = shallowStore;
		router = shallowRouter;

		store.mockModule('sirvase', { get: jest.fn(), getTypologies: jest.fn() });
		store.registerModule('session', { namespaced: true, state: { lang: 'es' } });

		wp = shallowMount(Component, { localVue, store, router });
	});

	it('has a name equal to v-sirvase-create', () => {
		expect(wp.vm.$options.name).toBe('v-sirvase-create');
	});
});
