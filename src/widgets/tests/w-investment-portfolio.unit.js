import investmentPortfolio from '@tests/fixtures/products/investmentPortfolio';
import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-investment-portfolio.vue';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-investment-portfolio.vue', () => {
	let wp;
	let store;

	const get = jest.fn().mockResolvedValue(investmentPortfolio[0]);

	beforeEach(async () => {
		jest.useFakeTimers();

		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('products', { get });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: {
				productId: 'investment-account-rto-1',
				type: 'investment-account-rto',
			},
		});

		await flushPromises();
	});

	it('has a name equal to w-investment-portfolio', () => {
		expect(wp.vm.$options.name).toBe('w-investment-portfolio');
	});

	it('render correctly', async () => {
		expect(wp.findAll('[data-testid="portfolio-composition"]')).toHaveLength(3);
	});
});
