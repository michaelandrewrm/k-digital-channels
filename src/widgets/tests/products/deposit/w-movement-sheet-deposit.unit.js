import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/deposit/w-movement-sheet-deposit.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-sheet-deposit.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
			sync: false,
			propsData: {
				movement: {
					reason: 'COMPRA SUPERMERCADO',
					amount: { currency: { id: 'EUR' }, amount: 100531.4 },
				},
			},
		});
	});

	it('has a name equal to w-movement-sheet-deposit', () => {
		expect(shallowWrapper.vm.$options.name).toBe('w-movement-sheet-deposit');
	});
});
