import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-icon';
import Icon from '@assets/icons/close';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-icon.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
			propsData: {
				src: Icon,
			},
			sync: false,
		});
	});

	it("has a name equal 'c-icon'", () => {
		expect(shallowWrapper.vm.$options.name).toBe('c-icon');
	});
});
