import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/investment-portfolio/w-movement-sheet-investment-portfolio';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-sheet-investment-portfolio', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {
					type: { name: 'Compra' },
					amount: { amount: 43.31, currency: { id: 'EUR' } },
					isin: { name: 'Telefónica', id: 'IIS29319' },
				},
			},
			stubs: { CAcrylicSheet: { template: '<div><slot/></div>' } },
		});
	});

	it('has a name equal to w-movement-sheet-investment-portfolio', () => {
		expect(wp.vm.$options.name).toBe('w-movement-sheet-investment-portfolio');
	});
});
