import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/credit/w-movement-sheet-credit.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-sheet-credit.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {
					reason: 'Traspaso a favor:',
					amount: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
				},
			},
		});
	});

	it('has a name equal to w-movement-sheet-credit', () => {
		expect(wp.vm.$options.name).toBe('w-movement-sheet-credit');
	});
});
