import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-progress-detail';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-progress-detail.vue', () => {
	it("has a name equal 'c-progress-detail'", () => {
		const shallowWrapper = shallowMount(Component, {
			localVue,
			sync: false,
		});

		expect(shallowWrapper.vm.$options.name).toBe('c-progress-detail');
	});

	it('has a property called progress', () => {
		const shallowWrapper = shallowMount(Component, {
			localVue,
			propsData: {
				from: 20,
				to: 200,
			},
			sync: false,
		});

		expect(shallowWrapper.vm.progress).toBe(10);
	});
});
