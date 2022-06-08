import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-product-position';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-position.vue', () => {
	const fixture = {
		id: '6c18e134-d9ea-4719-a809-8d24be6951a3',
		name: 'Acciones Banco Caminos',
		alias: 'Acciones Banco Caminos',
		productType: { id: '06', name: 'Broker' },
		productSubtype: { id: '15', name: 'Acciones Banco Caminos' },
		unityQuantity: 995,
		unityValue: { amount: 253.44, currency: { id: 'EUR' } },
		lastValueDate: '2020-08-18T11:05:26.072Z',
		totalValue: { amount: 732.38, currency: { id: 'EUR' } },
		effectiveUnityValue: { amount: 496.75, currency: { id: 'EUR' } },
	};

	const productsOK = {
		namespaced: true,
		actions: { getPosition: jest.fn().mockResolvedValue(fixture) },
	};

	const productsKO = {
		namespaced: true,
		actions: { getPosition: jest.fn().mockRejectedValue() },
	};

	it('has a name equal to w-product-position', () => {
		const { localStore } = newInstance;
		const store = localStore;

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: '', productId: 'abc123' },
		});

		expect(wp.vm.$options.name).toBe('w-product-position');
	});

	it('renders correctly', async () => {
		const { localStore } = newInstance;
		const store = localStore;
		store.registerModule('products', productsOK);
		jest.useFakeTimers();

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'caminos-equities', productId: 'abc123' },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="data"]').exists()).toBeTruthy();
	});

	it('shows an error when the service fails', async () => {
		const { localStore } = newInstance;
		const store = localStore;
		store.registerModule('products', productsKO);
		jest.useFakeTimers();

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'caminos-equities', productId: 'abc123' },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="data"]').exists()).toBeFalsy();
	});
});
