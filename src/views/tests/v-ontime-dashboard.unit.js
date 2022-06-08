import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import component from '@views/v-ontime-dashboard';
import accounts from '@tests/fixtures/products/accounts';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-ontime-dashboard.vue', () => {
	let wp;
	let store;
	let router;

	const WActions = {
		template: `
			<div>
				<button
					v-for="option in options"
					:key="option.id"
					:data-testid="option.id"
					@click="option.action()"
				>{{ option.title }}</button>
			</div>
		`,
		props: ['options'],
	};

	const productsFixture = accounts.map((item) => ({ ...item, onTime: false }));
	const movementsFixture = [
		{
			productId: 'account-1',
			movements: [
				{
					amount: { amount: 123.45, currency: { id: 'EUR' } },
					balance: { amount: 123.45, currency: { id: 'EUR' } },
					id: 'movement-1',
					movementCoreId: 'movement-1',
					operationDate: '2022-04-12',
					reason: 'reason',
					type: { id: 'TF', name: 'Traspaso' },
					valueDate: '2022-04-18',
				},
			],
		},
	];

	const get = jest.fn().mockResolvedValue(productsFixture);
	const getMovements = jest.fn().mockResolvedValue(movementsFixture);
	const setWelcome = jest.fn();
	const fetch = jest.fn().mockResolvedValue();

	beforeEach(async () => {
		const { shallowStore, localRouter } = newInstance;
		store = shallowStore;
		router = localRouter;

		store.registerModule('ontime', {
			namespaced: true,
			state: { isWelcome: false, productsOntime: [] },
			actions: { get, getMovements, setWelcome },
		});
		store.mockModule('resources', { fetch });

		await router.replace('/');

		wp = shallowMount(component, { localVue, store, router, stubs: { WActions } });
	});

	it('has a name equal to v-ontime-dashboard', () => {
		expect(wp.vm.$options.name).toBe('v-ontime-dashboard');
	});

	it('should navigate to welcome ontime page', () => {
		expect(router.currentRoute.name).toBe('ontime-welcome');
	});

	it('should navigate to ontime create page', async () => {
		await wp.find('[data-testid="configure-products"]').trigger('click');
		expect(router.currentRoute.name).toBe('ontime-create');
	});

	it('should show a warning when no ontime products', async () => {
		store.unregisterModule('ontime');
		store.registerModule('ontime', {
			namespaced: true,
			state: { isWelcome: true, productsOntime: [] },
			actions: { get, getMovements, setWelcome },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { WActions } });

		await flushPromises();

		expect(
			wp
				.find('[data-testid="warning"]')
				.text()
				.replace(/\s/g, ' ')
		).toBe(
			'Actualmente no tienes ningún producto seleccionado. Accede a través de "Seleccionar cuentas y tarjetas" ubicado en el botón inferior.'
		);
	});

	it('should show a warning when no movements', async () => {
		const productsOntime = [{ ...accounts[0], onTime: true }];
		const getAction = jest.fn().mockResolvedValue(productsOntime);
		const getMovementsAction = jest.fn().mockResolvedValue([]);

		store.unregisterModule('ontime');
		store.registerModule('ontime', {
			namespaced: true,
			state: { isWelcome: true, productsOntime },
			actions: { get: getAction, getMovements: getMovementsAction, setWelcome },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { WActions } });

		await flushPromises();

		expect(
			wp
				.find('[data-testid="warning"]')
				.text()
				.replace(/\s/g, ' ')
		).toBe('Vaya, parece que no ha habido movimientos en los últimos 30 días.');
	});

	it('should show an error', async () => {
		const productsOntime = [{ ...accounts[0], onTime: true }];
		const getAction = jest.fn().mockResolvedValue();
		const getMovementsAction = jest.fn().mockRejectedValue([]);

		store.unregisterModule('ontime');
		store.registerModule('ontime', {
			namespaced: true,
			state: { isWelcome: true, productsOntime },
			actions: { get: getAction, getMovements: getMovementsAction, setWelcome },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { WActions } });

		await flushPromises();

		expect(
			wp
				.find('[data-testid="error"]')
				.text()
				.replace(/\s/g, ' ')
		).toBe(
			'Ha habido un error al obtener la información solicitada. Puedes intentar de nuevo más tarde o ponerte en contacto con nosotros en:'
		);
	});

	it('should render correctly', async () => {
		const productsOntime = [{ ...accounts[0], onTime: true }];
		const getAction = jest.fn().mockResolvedValue(productsOntime);
		const getMovementsAction = jest.fn().mockResolvedValue(movementsFixture);

		store.unregisterModule('ontime');
		store.registerModule('ontime', {
			namespaced: true,
			state: { isWelcome: true, productsOntime: [] },
			actions: { get: getAction, getMovements: getMovementsAction, setWelcome },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { WActions } });

		await flushPromises();

		expect(
			wp
				.find('[data-testid="list-title"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('mar., 12/4/2022'); // TODO: There is a issue with our $d mock

		expect(
			wp
				.find('[data-testid="list-item"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('reason 123,45 € Traspaso Cuenta Corriente 2708');
	});

	it('should navigate to movement detail page', async () => {
		const productsOntime = [{ ...accounts[0], onTime: true }];
		const getAction = jest.fn().mockResolvedValue(productsOntime);
		const getMovementsAction = jest.fn().mockResolvedValue(movementsFixture);

		store.unregisterModule('ontime');
		store.registerModule('ontime', {
			namespaced: true,
			state: { isWelcome: true, productsOntime },
			actions: { get: getAction, getMovements: getMovementsAction, setWelcome },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { WActions } });

		await flushPromises();
		await wp.find('[data-testid="list-item"]').trigger('click');
		await flushPromises();

		expect(router.currentRoute.name).toBe('movement');
	});
});
