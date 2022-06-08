import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-error.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-error.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { localStore, localRouter } = newInstance;

		store = localStore;
		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { title: '' },
		});
	});

	it('has a name equal to w-transfer-error', () => {
		expect(wp.vm.$options.name).toBe('w-transfer-error');
	});
});
