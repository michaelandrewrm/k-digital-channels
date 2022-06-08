import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bizum-unregister.vue';
import flushPromises from 'flush-promises';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const LPage = {
	template: `
		<div class="l-page">
			<slot name="header" />
			<slot name="state" />
			<slot />
			<slot name="buttons" />
		</div>
	`,
};

const CTranslide = { template: '<div><slot /></div>' };
const stubs = { LPage, CTranslide, CButton };

describe('v-bizum-unregister.vue', () => {
	let wp;
	let store;
	let router;

	const product = {
		alias: 'Cuenta invisible',
		productNumber: { format: { id: 'IBAN' }, value: 'ES3102340098375445122708' },
	};

	beforeEach(async () => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;
	});

	it("has a name equal 'v-bizum-unregister'", () => {
		const getProduct = jest.fn().mockResolvedValue();
		const getPersonalDetails = jest.fn().mockResolvedValue();

		store.mockModule('bizum', { getProduct });
		store.mockModule('user', { getPersonalDetails });

		wp = shallowMount(Component, { localVue, store, router });

		expect(wp.vm.$options.name).toBe('v-bizum-unregister');
	});

	/**
	 * Al montar la vista, debería pintar el teléfono y el producto
	 * usado en bizum en la vista y habilitar el botón para dar de
	 * baja bizum.
	 */
	it('display product and phone on main screen', async () => {
		const getProduct = jest.fn().mockResolvedValue(product);
		const getPersonalDetails = jest.fn().mockResolvedValue({ data: { phone: '657136655' } });

		store.mockModule('bizum', { getProduct });
		store.mockModule('user', { getPersonalDetails });

		wp = shallowMount(Component, { localVue, store, router, stubs });
		await flushPromises();

		expect(wp.find('[data-testid="account"]').text()).toBe(
			'Cuenta invisible **** **** **** **** **** 2708'
		);
		expect(wp.find('[data-testid="phone"]').text()).toBe('657136655');
		expect(wp.find('[data-testid="submit"]').exists()).toBeTruthy();
	});

	/**
	 * Si al pedir el teléfono y el producto asociado en bizum el servicio
	 * devuelve un error, debería mostrar un mensaje de error general.
	 */
	it('display error if product and phone are not found', async () => {
		const getProduct = jest.fn().mockResolvedValue({ data: { product } });
		const getPersonalDetails = jest.fn().mockRejectedValue();

		store.mockModule('bizum', { getProduct });
		store.mockModule('user', { getPersonalDetails });

		wp = shallowMount(Component, { localVue, store, router, stubs });
		await flushPromises();

		expect(wp.find('[data-testid="operation-error"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="submit"]').exists()).toBeFalsy();
	});

	/**
	 * Al hacer click en el botón de confirmar, debería llamar al servicio
	 * dando de baja la cuenta en bizum y mostrar un mensaje de éxito si todo
	 * ha salido bien.
	 */
	it('show a success message when confirm unregister', async () => {
		const getProduct = jest.fn().mockResolvedValue({ data: { product } });
		const getPersonalDetails = jest.fn().mockResolvedValue({ data: { phone: '657136655' } });
		const unregister = jest.fn().mockResolvedValue();

		store.mockModule('bizum', { getProduct, unregister });
		store.mockModule('user', { getPersonalDetails });

		jest.useFakeTimers();

		wp = shallowMount(Component, { localVue, store, router, stubs });
		await flushPromises();

		await wp.find('[data-testid="submit"]').trigger('click');
		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="operation-success"]').exists()).toBeTruthy();

		await wp.find('[data-testid="continue"]').trigger('click');
		expect(router.currentRoute.name).toBe('transfers');
	});

	/**
	 * Al hacer click en el botón de confirmar, debería llamar al servicio
	 * dando de baja la cuenta en bizum y mostrar un mensaje de error si el
	 * servicio no ha respondido como debería.
	 */
	it('show a error message when confirm unregister if service fails', async () => {
		const getProduct = jest.fn().mockResolvedValue({ data: { product } });
		const getPersonalDetails = jest.fn().mockResolvedValue({ data: { phone: '657136655' } });
		const unregister = jest.fn().mockRejectedValue();

		store.mockModule('bizum', { getProduct, unregister });
		store.mockModule('user', { getPersonalDetails });

		jest.useFakeTimers();

		wp = shallowMount(Component, { localVue, store, router, stubs });
		await flushPromises();

		await wp.find('[data-testid="submit"]').trigger('click');
		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="operation-error"]').exists()).toBeTruthy();
	});
});
