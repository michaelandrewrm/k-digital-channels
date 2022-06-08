import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/investment-portfolio/w-asset-detail-investment-portfolio';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-asset-detail-investment-portfolio', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: { detail: {} },
			stubs: { CAcrylicSheet: { template: '<div><slot/></div>' } },
		});
	});

	it('has a name equal to w-asset-detail-investment-portfolio', () => {
		expect(wp.vm.$options.name).toBe('w-asset-detail-investment-portfolio');
	});
});
