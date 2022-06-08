import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-withholdings.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-withholdings.vue', () => {
	let wp;
	let store;
	let router;
	const fixture = {
		id: 'withholding-1',
		reason: 'Traspaso',
		amount: { amount: -123.45, currency: { id: 'EUR', code: '978' } },
		operationDate: '2021-01-11',
	};

	const fetch = jest.fn().mockResolvedValue({ data: [fixture] });

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('resources', { fetch });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: 'product-1' },
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-withholdings', () => {
		expect(wp.vm.$options.name).toBe('v-withholdings');
	});

	it('renders correctly', () => {
		expect(
			wp
				.find('[data-testid="sheet"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Importe retenido -123,45 €');

		expect(
			wp
				.find('[data-testid="movement"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Traspaso -123,45 € 11/1/2021');
	});

	it('should go back after no response', async () => {
		const back = jest.spyOn(router, 'back');
		const fetchAction = jest.fn().mockResolvedValue({ data: [] });
		store.mockModule('resources', { fetch: fetchAction });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: 'product-1' },
		});

		await flushPromises();

		expect(back).toHaveBeenCalled();
	});
});
