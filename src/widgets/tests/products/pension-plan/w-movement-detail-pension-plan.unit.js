import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/pension-plan/w-movement-detail-pension-plan.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-detail-pension-plan.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {},
			},
		});
	});

	it('has a name equal to w-movement-detail-pension-plan', () => {
		expect(wp.vm.$options.name).toBe('w-movement-detail-pension-plan');
	});
});
