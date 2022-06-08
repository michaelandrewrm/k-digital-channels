import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-placeholder-detail';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-placeholder-detail.vue', () => {
	it("has a name equal 'c-placeholder-detail'", () => {
		const shallowWrapper = shallowMount(Component, {
			localVue,
			sync: false,
		});

		expect(shallowWrapper.vm.$options.name).toBe('c-placeholder-detail');
	});
});
