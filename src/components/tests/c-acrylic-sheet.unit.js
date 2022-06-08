import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-acrylic-sheet';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-acrylic-sheet.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
			propsData: {
				actionable: true,
				dotted: false,
				theme: 'light',
			},
			sync: false,
		});
	});

	it("has a name equal 'c-acrylic-sheet'", () => {
		expect(shallowWrapper.vm.$options.name).toBe('c-acrylic-sheet');
	});
});
