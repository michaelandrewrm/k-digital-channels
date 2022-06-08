import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bizum-settings.vue';
import flushPromises from 'flush-promises';
import CButton from '@tests/stubs/c-button.stub';
import { typesByTitle } from '@modules/products/product-types';
import { subtypesByTitle } from '@modules/products/product-subtypes';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-bizum-settings.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = [
		{
			id: 'account-1',
			alias: 'Cuenta Corriente',
			productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: '2708' },
			balance: { amount: 1801.14, currency: { id: 'EUR' } },
			productType: { id: typesByTitle.account },
			productSubtype: { id: subtypesByTitle['checking-account'] },
			productFamily: 'account',
		},
		{
			id: 'account-2',
			alias: 'Cuenta Transparente',
			productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: '8557' },
			balance: { amount: 826.74, currency: { id: 'EUR' } },
			productType: { id: typesByTitle.account },
			productSubtype: { id: subtypesByTitle.account },
			productFamily: 'account',
		},
	];

	beforeEach(async () => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		const open = jest.fn().mockResolvedValue();
		const byService = jest.fn().mockResolvedValue(fixture);
		const getProduct = jest.fn().mockResolvedValue(fixture[0]);
		const setProduct = jest.fn().mockResolvedValue();

		store.mockModule('products', { byService });
		store.mockModule('notification', { open });
		store.mockModule('bizum', { getProduct, setProduct });
	});

	it("has a name equal 'v-bizum-settings'", () => {
		wp = shallowMount(Component, { localVue, store, router, stubs: { CButton } });

		expect(wp.vm.$options.name).toBe('v-bizum-settings');
	});

	/**
	 * Al cargar la vista, debería mostrar todos los productos y poder
	 * permitir la selección de uno de ellos haciendo click en él.
	 * Al seleccionar un producto, debería permitir enviar el formulario.
	 * Al enviar el formulario, debería redirigir a la página anterior y
	 * mostrar una notificación de que la operación ha sido exitosa.
	 */
	it('select second account', async () => {
		wp = shallowMount(Component, { localVue, store, router, stubs: { CButton } });
		await flushPromises();

		expect(wp.find('[data-testid="list"]').exists()).toBeTruthy();
		expect(wp.findAll('[data-testid="product-select"]').length).toBe(2);
		expect(wp.find('[data-testid="submit"]').exists()).toBeFalsy();

		await wp
			.findAll('[data-testid="product-select"]')
			.at(-1)
			.trigger('click');

		expect(wp.find('[data-testid="submit"]').exists()).toBeTruthy();

		await wp.find('[data-testid="submit"]').trigger('click');
		await flushPromises();

		expect(store.mockedActions['bizum/setProduct']).toHaveBeenCalledWith(
			expect.anything(),
			'account-2'
		);
		expect(store.mockedActions['notification/open']).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({ text: wp.vm.$t('BIZUM.REGISTER.CHANGE_ACCOUNT.SUCCESS') })
		);
	});

	/**
	 * Al enviar el formulario, si el servicio devuelve un error,
	 * debería mostrar una notificación de error.
	 */
	it('select second account failed', async () => {
		const getProduct = jest.fn().mockResolvedValue(fixture[0]);
		const setProduct = jest.fn().mockRejectedValue();

		store.mockModule('bizum', { getProduct, setProduct });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CButton } });
		await flushPromises();

		expect(wp.find('[data-testid="list"]').exists()).toBeTruthy();
		expect(wp.findAll('[data-testid="product-select"]').length).toBe(2);

		await wp
			.findAll('[data-testid="product-select"]')
			.at(-1)
			.trigger('click');

		await wp.find('[data-testid="submit"]').trigger('click');
		await flushPromises();

		expect(store.mockedActions['bizum/setProduct']).toHaveBeenCalledWith(
			expect.anything(),
			'account-2'
		);
		expect(store.mockedActions['notification/open']).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({ text: wp.vm.$t('BIZUM.REGISTER.CHANGE_ACCOUNT.ERROR') })
		);
	});

	/**
	 * El usuario debería poder seleccionar y quitar la selección
	 * de cualquier cuenta.
	 */
	it('user can select and deselect a product', async () => {
		wp = shallowMount(Component, { localVue, store, router, stubs: { CButton } });
		await flushPromises();

		await wp
			.findAll('[data-testid="product-select"]')
			.at(-1)
			.trigger('click');

		expect(wp.find('[data-testid="submit"]').exists()).toBeTruthy();

		await wp
			.findAll('[data-testid="product-select"]')
			.at(-1)
			.trigger('click');

		expect(wp.find('[data-testid="submit"]').exists()).toBeFalsy();

		await wp
			.findAll('[data-testid="product-select"]')
			.at(0)
			.trigger('click');

		expect(wp.find('[data-testid="submit"]').exists()).toBeFalsy();
	});

	/**
	 * Si el servicio devuelve un error, debería mostrarse un error
	 * en la vista y no debería dejar continuar.
	 */
	it('shows an error when service fails', async () => {
		const byService = jest.fn().mockRejectedValue();

		store.mockModule('products', { byService });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CButton } });
		await flushPromises();

		expect(wp.findAll('[data-testid="product-select"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="submit"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="operation-error"]').exists()).toBeTruthy();
	});
});
