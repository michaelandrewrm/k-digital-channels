import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/equities/w-movement-detail-equities.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-detail-equities.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {},
			},
		});
	});

	it('has a name equal to w-movement-detail-equities', () => {
		expect(wp.vm.$options.name).toBe('w-movement-detail-equities');
	});
});
