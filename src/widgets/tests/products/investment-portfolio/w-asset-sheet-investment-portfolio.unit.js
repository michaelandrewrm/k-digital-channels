import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/investment-portfolio/w-asset-sheet-investment-portfolio';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-asset-sheet-investment-portfolio', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				source: {
					isinDescription: 'Telefónica',
					isin: 'TLF',
				},
			},
			stubs: { CAcrylicSheet: { template: '<div><slot/></div>' } },
		});
	});

	it('has a name equal to w-asset-sheet-investment-portfolio', () => {
		expect(wp.vm.$options.name).toBe('w-asset-sheet-investment-portfolio');
	});
});
