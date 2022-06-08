import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@widgets/w-product-rsi-portfolio.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-rsi-portfolio.vue', () => {
	let wp;
	let store;
	const fixture = [{ parentId: 'product-1' }];

	const fetch = jest.fn().mockResolvedValue(fixture);
	const get = jest.fn().mockResolvedValue();

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore } = newInstance;

		store = shallowStore;

		store.mockModule('products', { fetch, get });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'managed-rsi-portfolio', productId: 'product-1' },
		});
	});

	it('has a name equal to w-product-rsi-portfolio', () => {
		expect(wp.vm.$options.name).toBe('w-product-rsi-portfolio');
	});

	it('should show a placeholder during loading', async () => {
		const fetchAction = jest.fn().mockResolvedValue(fixture);
		const getAction = jest.fn().mockResolvedValue();

		store.mockModule('products', { fetch: fetchAction, get: getAction });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'managed-rsi-portfolio', productId: 'product-1' },
		});

		jest.runAllTimers();
		await wp.vm.$nextTick();
		expect(wp.find('[data-testid="loading"]').exists()).toBeTruthy();
	});

	it('should show an error', async () => {
		const fetchAction = jest.fn().mockRejectedValue();
		const getAction = jest.fn().mockResolvedValue();

		store.mockModule('products', { fetch: fetchAction, get: getAction });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'managed-rsi-portfolio', productId: 'product-1' },
		});

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
	});
});
