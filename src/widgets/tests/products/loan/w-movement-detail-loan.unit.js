import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/loan/w-movement-detail-loan.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-detail-loan.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {},
			},
		});
	});

	it('has a name equal to w-movement-detail-loan', () => {
		expect(wp.vm.$options.name).toBe('w-movement-detail-loan');
	});
});
