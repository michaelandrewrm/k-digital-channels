import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-investment-asset.vue';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-investment-asset.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(async () => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		const fetch = jest.fn().mockResolvedValue();
		const get = jest.fn().mockResolvedValue({
			alias: 'Cuenta asesorada de inversiones',
			assets: [
				{
					productTypeCode: 'RV',
					isin: 'telefonica',
					marketPrice: { amount: 19.99, currency: { id: 'EUR' } },
					availableTitles: 32,
				},
				{
					productTypeCode: 'RV',
					isin: 'santander',
					marketPrice: { amount: 19.99, currency: { id: 'EUR' } },
					availableTitles: 99,
				},
				{
					productTypeCode: 'RF',
					isin: 'eeuu',
					marketPrice: { amount: 15.99, currency: { id: 'EUR' } },
					availableTitles: 12,
				},
			],
		});

		store.mockModule('products', { fetch, get });
		store.registerModule('profiles', { namespaced: true, state: { defaultProfile: null } });
	});

	it("has a name equal 'v-investment-asset'", () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: 'abc123', assetId: 'eeuu' },
		});

		expect(wp.vm.$options.name).toBe('v-investment-asset');
	});

	/**
	 * Debería mostrar el widget de detalle de la composición
	 * de manera correcta al cargarlo desde el servicio.
	 */
	it('render correctly ', async () => {
		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: 'abc123', assetId: 'eeuu' },
		});

		jest.advanceTimersToNextTimer(2);
		await flushPromises();

		expect(wp.find('[data-testid="investment-portfolio-detail"]').exists()).toBeTruthy();
	});

	/**
	 * Debería mostrar un mensaje de error si el servicio
	 * responde con un error.
	 */
	it('shows an error message when service fails ', async () => {
		const fetch = jest.fn().mockResolvedValue();
		const get = jest.fn().mockRejectedValue();

		store.mockModule('products', { fetch, get });

		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { productId: 'abc123', assetId: 'eeuu' },
		});

		jest.advanceTimersToNextTimer(2);
		await flushPromises();

		expect(wp.find('[data-testid="investment-portfolio-detail"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="detail-error"]').exists()).toBeTruthy();
	});
});
