import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bizum-welcome.vue';
import CButton from '@tests/stubs/c-button.stub';
import flushPromises from 'flush-promises';
import { typesByTitle } from '@modules/products/product-types';
import { subtypesByTitle } from '@modules/products/product-subtypes';

const newInstance = createPristineVue();
const { localVue } = newInstance;

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

describe('v-bizum-welcome.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(async () => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		const isActive = jest.fn().mockResolvedValue(false);
		const getTerms = jest.fn().mockResolvedValue();
		const byService = jest.fn().mockResolvedValue(fixture);
		const getPersonalDetails = jest.fn().mockResolvedValue({ data: { phone: '112' } });

		store.mockModule('bizum', { getTerms, isActive });
		store.mockModule('products', { byService });
		store.mockModule('user', { getPersonalDetails });
	});

	it("has a name equal 'v-bizum-welcome'", () => {
		wp = shallowMount(Component, { localVue, store, router, stubs: { CButton } });
		expect(wp.vm.$options.name).toBe('v-bizum-welcome');
	});

	/**
	 * Al cargar la vista, debería mostrar todos los productos y poder
	 * permitir la selección de uno de ellos haciendo click en él.
	 * Al seleccionar un producto, debería permitir enviar el formulario.
	 * Al enviar el formulario, debería redirigir a bizum-register pasando
	 * como parámetro el producto seleccionado.
	 */
	it('select second account', async () => {
		wp = shallowMount(Component, { localVue, store, router, stubs: { CButton } });
		await flushPromises();
		expect(wp.find('[data-testid="start"]').exists()).toBeTruthy();

		await wp.find('[data-testid="start"]').trigger('click');

		expect(wp.find('[data-testid="start"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeTruthy();
		expect(wp.findAll('[data-testid="product-select"]').length).toBe(2);
		expect(wp.find('[data-testid="submit"]').exists()).toBeFalsy();

		await wp
			.findAll('[data-testid="product-select"]')
			.at(-1)
			.trigger('click');

		expect(wp.find('[data-testid="submit"]').exists()).toBeTruthy();

		await wp.find('[data-testid="submit"]').trigger('click');

		expect(router.history.current.name).toBe('bizum-register');
		expect(router.history.current.params).toMatchObject({
			productId: 'account-2',
		});
	});

	/**
	 * El usuario debería poder seleccionar y quitar la selección
	 * de cualquier cuenta.
	 */
	it('user can select and deselect a product', async () => {
		wp = shallowMount(Component, { localVue, store, router, stubs: { CButton } });
		await flushPromises();
		await wp.find('[data-testid="start"]').trigger('click');

		expect(wp.findAll('[data-testid="product-select"]').length).toBe(2);
		expect(wp.find('[data-testid="submit"]').exists()).toBeFalsy();

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

		expect(wp.find('[data-testid="submit"]').exists()).toBeTruthy();
	});

	/**
	 * Al cargar la vista con solo un producto, éste debería estar
	 * preseleccionado por defecto.
	 */
	it('preselect the only product returned', async () => {
		const byService = jest.fn().mockResolvedValue([fixture[0]]);

		store.mockModule('products', { byService });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CButton } });
		await flushPromises();

		expect(wp.find('[data-testid="start"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="submit"]').exists()).toBeFalsy();

		await wp.find('[data-testid="start"]').trigger('click');

		expect(wp.findAll('[data-testid="product-select"]').length).toBe(1);
		expect(wp.find('[data-testid="submit"]').exists()).toBeTruthy();
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

		await wp.find('[data-testid="start"]').trigger('click');

		expect(wp.findAll('[data-testid="product-select"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="submit"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="operation-error"]').exists()).toBeTruthy();
	});

	/**
	 * Si el usuario ya tiene bizum activado, no puede volver a registrarse.
	 * Entonces, al entrar a esta página debería ir hacia atrás en el historial.
	 */
	it('exit page if user has bizum active', async () => {
		const isActive = jest.fn().mockResolvedValue(true);
		const getTerms = jest.fn().mockResolvedValue();

		await router.push({ name: 'bizum' });
		await router.push({ name: 'bizum-welcome' });

		store.mockModule('bizum', { getTerms, isActive });
		wp = shallowMount(Component, { localVue, store, router, stubs: { CButton } });
		await flushPromises();

		expect(router.currentRoute.name).toBe('bizum');
	});
});
