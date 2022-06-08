import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/investment-portfolio/w-product-investment-portfolio';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-investment-portfolio', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				product: {
					alias: 'Cuenta de inversión',
					balance: { amount: 123.45, currency: { id: 'EUR' } },
					productNumber: {
						format: { id: 'IBAN', name: 'IBAN' },
						value: 'ES3102340098375445122708',
					},
				},
			},
			stubs: { CAcrylicSheet: { template: '<div><slot/></div>' } },
		});
	});

	it('has a name equal to w-product-investment-portfolio', () => {
		expect(wp.vm.$options.name).toBe('w-product-investment-portfolio');
	});

	it('renders correctly', () => {
		expect(wp.find('[data-testid=alias]').text()).toBe('Cuenta de inversión');
		expect(wp.find('[data-testid=balance]').text()).toBe('123,45\xa0€');
	});
});
