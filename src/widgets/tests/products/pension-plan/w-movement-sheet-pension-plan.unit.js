import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/pension-plan/w-movement-sheet-pension-plan.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-sheet-pension-plan.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {
					reason: 'COMPRA SUPERMERCADO',
					amount: { currency: { id: 'EUR' }, amount: 100531.4 },
				},
			},
		});
	});

	it('has a name equal to w-movement-sheet-pension-plan', () => {
		expect(wp.vm.$options.name).toBe('w-movement-sheet-pension-plan');
	});
});
