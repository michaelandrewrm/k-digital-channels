import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bizum-details.vue';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-bizum-details.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(async () => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;
	});

	it("has a name equal 'v-bizum-details'", () => {
		const getPersonalDetails = jest.fn().mockResolvedValue({
			data: { phone: '657136655', email: 'esada@bancocaminos.es' },
		});
		const getProduct = jest.fn().mockResolvedValue({
			alias: 'Cuenta transparente',
			productNumber: { format: 'IBAN', value: 'ES7921000813610123456789' },
		});

		store.mockModule('user', { getPersonalDetails });
		store.mockModule('bizum', { getProduct });
		jest.useFakeTimers();

		wp = shallowMount(Component, { localVue, store, router });

		expect(wp.vm.$options.name).toBe('v-bizum-details');
	});

	/**
	 * Al cargar la vista debería mostrar la información personal
	 * y la cuenta asociada.
	 */
	it('display personal information on view ', async () => {
		const getPersonalDetails = jest.fn().mockResolvedValue({
			data: { phone: '657136655', email: 'esada@bancocaminos.es' },
		});
		const getProduct = jest.fn().mockResolvedValue({
			alias: 'Cuenta transparente',
			productNumber: { format: 'IBAN', value: 'ES7921000813610123456789' },
		});

		store.mockModule('user', { getPersonalDetails });
		store.mockModule('bizum', { getProduct });
		jest.useFakeTimers();

		wp = shallowMount(Component, { localVue, store, router });
		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="phone"]').attributes('description')).toBe('657136655');
		expect(wp.find('[data-testid="email"]').attributes('description')).toBe(
			'esada@bancocaminos.es'
		);
		expect(wp.find('[data-testid="unregister-button"]').exists()).toBeTruthy();
	});

	it('should go back when no data is received', async () => {
		const back = jest.spyOn(router, 'back');
		const getPersonalDetails = jest.fn().mockResolvedValue({
			data: undefined,
		});
		const getProduct = jest.fn();

		store.mockModule('user', { getPersonalDetails });
		store.mockModule('bizum', { getProduct });

		wp = shallowMount(Component, { localVue, store, router });

		jest.advanceTimersToNextTimer(1);

		await flushPromises();

		expect(back).toHaveBeenCalled();
	});
});
