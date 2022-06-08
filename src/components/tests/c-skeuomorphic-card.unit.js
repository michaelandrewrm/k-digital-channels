import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-skeuomorphic-card';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-skeuomorphic-card.vue', () => {
	it("has a name equal 'c-skeuomorphic-card'", () => {
		const shallowWrapper = shallowMount(Component, {
			localVue,
			sync: false,
		});

		expect(shallowWrapper.vm.$options.name).toBe('c-skeuomorphic-card');
	});
});
