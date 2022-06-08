import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/investment-portfolio/w-movement-detail-investment-portfolio';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-detail-investment-portfolio', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {
					operationDate: '2019-12-26',
					titles: 12310,
					originMovementAmount: { amount: 266.2, currency: { id: 'EUR' } },
					netPrice: { amount: 13223.4, currency: { id: 'EUR' } },
				},
			},
			stubs: { CAcrylicSheet: { template: '<div><slot/></div>' } },
		});
	});

	it('has a name equal to w-movement-detail-investment-portfolio', () => {
		expect(wp.vm.$options.name).toBe('w-movement-detail-investment-portfolio');
	});
});
