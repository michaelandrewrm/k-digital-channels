import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/equities/w-movement-sheet-equities.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-sheet-equities.vue', () => {
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

	it('has a name equal to w-movement-sheet-equities', () => {
		expect(wp.vm.$options.name).toBe('w-movement-sheet-equities');
	});
});
