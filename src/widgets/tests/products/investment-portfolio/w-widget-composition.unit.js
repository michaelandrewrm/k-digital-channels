import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/investment-portfolio/w-widget-composition';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-widget-composition', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				source: {
					type: 'IIC',
					balance: { amount: 123.45, currency: { id: 'EUR' } },
				},
			},
			stubs: { CAcrylicSheet: { template: '<div><slot/></div>' } },
		});
	});

	it('has a name equal to w-widget-composition', () => {
		expect(wp.vm.$options.name).toBe('w-widget-composition');
	});

	it('renders correctly', () => {
		expect(wp.find('[data-testid=type]').text()).toBe('Fondos');
		expect(wp.find('[data-testid=balance]').text()).toBe('123,45\xa0€');
	});
});
