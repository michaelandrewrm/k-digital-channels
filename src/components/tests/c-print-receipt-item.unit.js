import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-print-receipt-item';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-print-receipt-item.vue', () => {
	it("has a name equal 'c-print-receipt-item'", () => {
		const wp = shallowMount(Component, { localVue });

		expect(wp.vm.$options.name).toBe('c-print-receipt-item');
	});
});
