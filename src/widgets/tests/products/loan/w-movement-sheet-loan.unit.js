import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/loan/w-movement-sheet-loan.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-sheet-loan.vue', () => {
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

	it('has a name equal to w-movement-sheet-loan', () => {
		expect(wp.vm.$options.name).toBe('w-movement-sheet-loan');
	});
});
