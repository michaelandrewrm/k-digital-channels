import { shallowMount } from '@vue/test-utils';
import Component from '@layouts/l-new-transfer.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('l-new-transfer.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it("has a name equal 'l-new-transfer'", () => {
		expect(wp.vm.$options.name).toBe('l-new-transfer');
	});
});
