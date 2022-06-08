import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-product-list';
import categorizeProducts from '@modules/products/product-sort';

import accounts from '@tests/fixtures/products/accounts';
import cards from '@tests/fixtures/products/cards';
import managedPortfolios from '@tests/fixtures/products/managedPortfolios';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-list', () => {
	let wp;
	let store;
	let router;

	const fixture = categorizeProducts([...accounts, ...cards, ...managedPortfolios]);
	const CCardItem = {
		template: `
			<div class="c-card-item">
				<div>{{ title }}</div>
				<div>{{ subTitle }}</div>
				<div>{{ info }}</div>
				<div>{{ subInfo }}</div>
			</div>
		`,
		props: ['title', 'subTitle', 'info', 'subInfo'],
	};

	const fetch = jest.fn().mockResolvedValue(fixture);

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.registerModule('profiles', { namespaced: true, state: { defaultProfile: null } });
		store.mockModule('products', { fetch });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CCardItem } });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to w-product-list', () => {
		expect(wp.vm.$options.name).toBe('w-product-list');
	});

	it('should list the products', async () => {
		await flushPromises();

		expect(
			wp
				.find('[data-type="currency-usd-account"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Cuenta en dólares **** **** **** **** **** 2711 123,45 USD Saldo');

		expect(
			wp
				.find('[data-type="account"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Cuentas 493,80 € Saldo');

		expect(
			wp
				.find('[data-type="debit-card"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Tarjetas de débito 246,90 € Gastado este mes');

		expect(
			wp
				.find('[data-type="credit-card"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Tarjetas de crédito 246,90 € Disponible');

		expect(
			wp
				.find('[data-type="managed-portfolio"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Cartera gestionada ***** ***** 5109 123,45 € Disponible');

		expect(
			wp
				.find('[data-type="subscription"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Suscripción premium 370,35 € Disponible');
	});

	it('should show an error when service fails', async () => {
		const fetchKO = jest.fn().mockRejectedValue();

		store.mockModule('products', { fetch: fetchKO });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CCardItem } });

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
	});

	it('should let user retry when service fails', async () => {
		const fetchKO = jest
			.fn()
			.mockRejectedValueOnce()
			.mockResolvedValue(fixture);

		store.mockModule('products', { fetch: fetchKO });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CCardItem } });

		await flushPromises();
		await wp.find('[data-testid="error"] a').trigger('click');

		jest.advanceTimersToNextTimer(1);

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="loading"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeTruthy();
	});

	it('should not group products with different currency', async () => {
		const extraAccount = {
			id: 'account-7',
			name: 'Cuenta Corriente',
			alias: 'Cuenta Corriente',
			productType: { id: '01', name: 'Cuentas' },
			productSubtype: { id: '03', name: 'Cuenta Corriente' },
			relationType: { id: '01' },
			balance: { amount: 123.45, currency: { id: 'GBP' } },
			postedBalance: { amount: 123.45, currency: { id: 'GBP' } },
			productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: 'ES3102340098375445122714' },
		};
		const otherFixture = categorizeProducts([...accounts, extraAccount]);
		const fetchOK = jest.fn().mockResolvedValue(otherFixture);

		store.mockModule('products', { fetch: fetchOK });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CCardItem } });

		await flushPromises();

		expect(
			wp
				.find('[data-type="currency-usd-account"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Cuenta en dólares **** **** **** **** **** 2711 123,45 USD Saldo');

		expect(
			wp
				.find('[data-type="currency-gbp-account"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Cuenta en libras **** **** **** **** **** 2714 123,45 £ Saldo');
	});

	it('should group investment products', async () => {
		const investmentAccountRTO = {
			id: 'investment-account-rto-1',
			name: 'Cuenta inversora',
			alias: 'Cuenta inversora RTO',
			productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: 'ES3102340098375445122714' },
			balance: null,
			postedBalance: null,
			productType: { id: '13', name: 'Cuentas inversoras' },
			productSubtype: { id: '37', name: 'Cuentas inversoras RTO' },
			relationType: { id: '01' },
		};
		const investmentPensionPlan = {
			id: 'investment-pension-plan-1',
			name: 'Planes de pensiones',
			alias: 'Planes de pensiones',
			productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: 'ES3102340098375445122715' },
			balance: null,
			postedBalance: null,
			productType: { id: '13', name: 'Cuentas inversoras' },
			productSubtype: { id: '38', name: 'Cuentas planes de pensiones' },
			relationType: { id: '01' },
		};
		const otherFixture = categorizeProducts([investmentAccountRTO, investmentPensionPlan]);
		const fetchAction = jest.fn().mockResolvedValue(otherFixture);

		store.mockModule('products', { fetch: fetchAction });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CCardItem } });

		await flushPromises();

		expect(
			wp
				.find('[data-testid="product-card-item"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Caminos Inversión');
	});

	it('should list products with no balance or postedBalance', async () => {
		const extraAccount = {
			id: 'account-7',
			name: 'Cuenta Corriente',
			alias: 'Cuenta Corriente',
			productType: { id: '01', name: 'Cuentas' },
			productSubtype: { id: '03', name: 'Cuenta Corriente' },
			relationType: { id: '01' },
			productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: 'ES3102340098375445122715' },
		};
		const otherFixture = categorizeProducts([...accounts, extraAccount]);
		const fetchOK = jest.fn().mockResolvedValue(otherFixture);

		store.mockModule('products', { fetch: fetchOK });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CCardItem } });

		await flushPromises();

		expect(
			wp
				.find('[data-type="currency-undefined-account"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Cuenta en divisa **** **** **** **** **** 2715');
	});

	it('should render the banner in correct position', async () => {
		store.mockModule('products', {
			fetch: jest
				.fn()
				.mockResolvedValueOnce(fixture)
				.mockResolvedValueOnce(fixture.slice(0, 6))
				.mockResolvedValueOnce(fixture.slice(0, 1)),
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { CCardItem },
			slots: { banner: '<div />' },
		});

		await flushPromises();

		expect(wp.findAll('[data-testid="list"] > *').at(2).element).toHaveAttribute(
			'data-testid',
			'banner-slot'
		);

		wp.vm.refreshProducts();
		await flushPromises();

		expect(wp.findAll('[data-testid="list"] > *').at(2).element).toHaveAttribute(
			'data-testid',
			'banner-slot'
		);
	});

	it('shows a warning when there is not products', async () => {
		store.mockModule('products', { fetch: jest.fn().mockResolvedValue({ data: [] }) });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CCardItem } });

		await flushPromises();

		expect(
			wp
				.find('[data-testid="warning"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Vaya... En estos momentos no tienes productos contratados.');
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
	});

	it('shows a warning when there is not products assigned to the default profile', async () => {
		store.unregisterModule('profiles');
		store.registerModule('profiles', { namespaced: true, state: { defaultProfile: {} } });
		store.mockModule('products', { fetch: jest.fn().mockResolvedValue({ data: [] }) });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CCardItem } });

		await flushPromises();

		expect(
			wp
				.find('[data-testid="warning"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Vaya... En estos momentos no tienes productos asignados al perfil.');
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
	});

	it('should not show TPV products', async () => {
		const tpv = {
			id: 'tpv-1',
			name: 'TPV Comercios',
			alias: 'TPV Comercios',
			productType: { id: '09', name: 'TPV' },
			productSubtype: { id: '22', name: 'TPV' },
			relationType: { id: '01' },
			productNumber: { format: { id: 'INTERNAL', name: 'INTERNAL' }, value: '9488' },
			productFamily: 'tpv',
		};
		const otherFixture = categorizeProducts([...accounts, tpv]);
		const fetchOK = jest.fn().mockResolvedValue(otherFixture);

		store.mockModule('products', { fetch: fetchOK });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CCardItem } });

		await flushPromises();

		expect(wp.find('[data-type="tpv"]').exists()).toBeFalsy();
	});
});
