import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-product-resource-list';
import flushPromises from 'flush-promises';
import { SCA_REQUIRED } from '@modules/service/constants';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-resource-list.vue', () => {
	let store;

	const fixture = {
		data: [
			{
				id: 'movement-1',
				balance: { amount: 123.45, currency: { id: 'EUR', code: '978' } },
				type: { id: 'COMPRA', name: 'Compra' },
				valueDate: '2020-04-30',
				operationDate: '2020-04-30T17:18:21.650Z',
				amount: { amount: -123.45, currency: { id: 'EUR', code: '978' } },
				reason: 'Compra en Carrefour',
			},
			{
				id: 'movement-2',
				balance: { amount: 123.45, currency: { id: 'EUR', code: '978' } },
				type: { id: 'COMPRA', name: 'Compra' },
				valueDate: '2020-05-01',
				operationDate: '2020-04-30',
				amount: { amount: -123.45, currency: { id: 'EUR', code: '978' } },
				reason: 'Compra en Mercadona',
			},
		],
	};

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore } = newInstance;

		store = shallowStore;

		const fetch = jest.fn().mockResolvedValue({ data: [], paging: {} });

		store.mockModule('resources', { fetch });
	});

	it('has a name equal to w-product-resource-list', () => {
		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'account', productId: '1234', query: {} },
		});

		expect(wp.vm.$options.name).toBe('w-product-resource-list');
	});

	it('renders correctly', async () => {
		const fetch = jest.fn().mockResolvedValue({ data: [], paging: {} });

		store.mockModule('resources', { fetch });

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'account', productId: '1234', query: {} },
		});

		jest.runAllTimers();
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeTruthy();
	});

	/**
	 * Debería mostrar un error si el servicio falla.
	 */
	it('shows an error when the service fails', async () => {
		const fetch = jest.fn().mockRejectedValue({ response: 500 });

		store.mockModule('resources', { fetch });

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'account', productId: '1234', query: {} },
		});

		jest.runAllTimers();
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
	});

	/**
	 * Debería mostrar el botón de cargar más movimientos si el servicio
	 * requiere un nivel superior de seguridad.
	 */
	it('shows a button when the service request sca', async () => {
		const fetch = jest.fn().mockRejectedValue({ response: { data: { errorCode: SCA_REQUIRED } } });

		store.mockModule('resources', { fetch });

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'account', productId: '1234', query: {} },
		});

		jest.runAllTimers();
		await flushPromises();

		expect(wp.find('[data-testid="load-resources-button"]').exists()).toBeTruthy();
	});

	/**
	 * Debería pedir la carga de la siguiente página si el usuario
	 * hace click en el botón de cargar más movimientos y no se
	 * requiere un nivel de seguridad superior.
	 */
	it('should not force the service to require otp after first click on the load button', async () => {
		const fetch = jest.fn().mockResolvedValue({
			data: fixture.data,
			paging: { nextPaginationKey: 'movement-2' },
		});

		store.mockModule('resources', { fetch });

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: {
				type: 'account',
				productId: '1234',
				query: {
					dateFrom: '',
					dateTo: '',
					reason: 'traspaso',
				},
			},
			stubs: { CLoadInstantButton: CButton },
		});

		jest.runAllTimers();
		await flushPromises();

		wp.find('[data-testid="load-resources-button"]').trigger('click');

		jest.advanceTimersToNextTimer(1);

		expect(fetch).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				force: false,
				query: {
					dateFrom: '',
					dateTo: '',
					reason: 'traspaso',
				},
				paginationKey: 'movement-2',
			})
		);
	});

	/**
	 * Debería mostrarse un skeleton de carga mientras el servicio
	 * terminar de responder.
	 */
	it('shows a loading skeleton on delay', async () => {
		const fetch = jest.fn().mockImplementation(() => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(fixture);
				}, 1000);
			});
		});

		store.mockModule('resources', { fetch });

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'account', productId: '1234', query: {} },
		});

		jest.advanceTimersToNextTimer(1);
		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="loading"]').exists()).toBeTruthy();

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="loading"]').exists()).toBeFalsy();
	});

	/**
	 * Si el servicio falla, debería mostrar un mensaje de error
	 * y un enlace para repetir la llamada.
	 */
	it('can retry a request if its fails', async () => {
		const fetch = jest
			.fn()
			.mockRejectedValueOnce({ response: 500 })
			.mockImplementation(() => {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve(fixture);
					}, 1000);
				});
			});

		store.mockModule('resources', { fetch });

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'account', productId: '1234', query: {} },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		await wp.find('[data-testid="error"] a').trigger('click');
		wp.vm.$nextTick();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="loading"]').exists()).toBeTruthy();

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="loading"]').exists()).toBeFalsy();
	});
});
