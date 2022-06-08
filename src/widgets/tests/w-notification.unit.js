import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-notification.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-notification.vue', () => {
	let shallowWrapper;
	let store;
	let router;

	beforeEach(() => {
		const { localStore, localRouter } = newInstance;

		store = localStore;
		router = localRouter;

		shallowWrapper = shallowMount(Component, {
			localVue,
			store,
			router,
			sync: false,
		});
	});

	it('has a name equal to w-notification', () => {
		expect(shallowWrapper.vm.$options.name).toBe('w-notification');
	});
});
