import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/fund/w-movement-sheet-fund';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-sheet-fund.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {
					id: 'abc123',
					amount: {
						amount: 123.45,
						currency: { id: 'EUR', code: '978' },
					},
					operationDate: new Date(),
					unityQuantity: 80.234,
					liquidationValue: {
						amount: 123.45,
						currency: { id: 'EUR', code: '978' },
					},
					effectiveValue: {
						amount: 123.45,
						currency: { id: 'EUR', code: '978' },
					},
				},
			},
		});
	});

	it('has a name equal to w-movement-sheet-fund', () => {
		expect(wp.vm.$options.name).toBe('w-movement-sheet-fund');
	});
});
