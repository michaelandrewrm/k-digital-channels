import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-imposition.vue';
import deposits from '@tests/fixtures/products/deposits';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-imposition.vue', () => {
	let wp;
	let store;
	let router;
	const fixture = {
		creationDate: '2021-08-23',
		expirationDate: '2021-12-23',
		id: 'imposition-1',
		impositionAmount: { amount: 1000, currency: { id: 'EUR' } },
		nextDate: '2021-12-23',
		reason: 'Imposición',
		reference: '',
		state: { id: '01', name: 'VIVA' },
		typeInterest: '0.1',
	};

	const getResource = jest.fn().mockResolvedValue(fixture);
	const getProduct = jest.fn().mockResolvedValue(deposits[0]);

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('resources', { get: getResource });
		store.mockModule('products', { get: getProduct });
		store.registerModule('app', { namespaced: true, state: { companyId: 'BF' } });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: 'product-1', movementId: 'movement-1' },
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-imposition', () => {
		expect(wp.vm.$options.name).toBe('v-imposition');
	});

	it('should show a cancel title', async () => {
		expect(wp.find('h2').text()).toBe('Detalle de la imposición');

		const getAction = jest
			.fn()
			.mockResolvedValue({ ...fixture, state: { id: '00', name: 'CANCELADA' } });
		store.mockModule('resources', { get: getAction });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: 'product-1', movementId: 'movement-1' },
		});

		await flushPromises();

		expect(wp.find('h2').text()).toBe('Detalle de la imposición cancelada');
	});

	it('should request an imposition resource when bancofar', () => {
		expect(getResource).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				useCache: true,
				productId: 'product-1',
				resource: 'impositions',
				resourceId: 'movement-1',
			})
		);
	});

	it('should go back after error getting a resource', async () => {
		const back = jest.spyOn(router, 'back');
		const getAction = jest.fn().mockRejectedValue();
		store.mockModule('resources', { get: getAction });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: 'product-1', movementId: 'movement-1' },
		});

		await flushPromises();

		expect(back).toHaveBeenCalled();
	});
});
