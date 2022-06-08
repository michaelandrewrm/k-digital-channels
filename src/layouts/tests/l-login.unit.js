import { shallowMount } from '@vue/test-utils';
import Component from '@layouts/l-login.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('l-login.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it("has a name equal 'l-login'", () => {
		expect(wp.vm.$options.name).toBe('l-login');
	});
});
