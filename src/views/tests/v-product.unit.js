import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-product.vue';
import groupBy from 'lodash/groupBy';
import categorizeProducts from '@modules/products/product-sort';

import accounts from '@tests/fixtures/products/accounts';
import cards from '@tests/fixtures/products/cards';
import deposits from '@tests/fixtures/products/deposits';
import funds from '@tests/fixtures/products/funds';
import loans from '@tests/fixtures/products/loans';
import managedAccounts from '@tests/fixtures/products/managedAccounts';
import managedCurrencyAccounts from '@tests/fixtures/products/managedCurrencyAccounts';
import managedPortfolios from '@tests/fixtures/products/managedPortfolios';
import pensionPlans from '@tests/fixtures/products/pensionPlans';
import positions from '@tests/fixtures/products/positions';
import investmentPortfolio from '@tests/fixtures/products/investmentPortfolio';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const fixture = categorizeProducts([
	...accounts,
	...cards,
	...deposits,
	...managedAccounts,
	...managedCurrencyAccounts,
	...managedPortfolios,
	...loans,
	...funds,
	...pensionPlans,
	...positions,
	...investmentPortfolio,
]);

const blob = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

describe('v-product.vue', () => {
	let wp;
	let store;
	let router;

	const fetch = jest.fn().mockResolvedValue(fixture);
	const get = jest.fn((context, productId) =>
		Promise.resolve(fixture.find(({ id }) => productId === id))
	);
	const getSiblings = jest.fn((context, productId) => {
		const product = fixture.find(({ id }) => productId === id);
		const { productFamily } = product;
		return Promise.resolve(groupBy(fixture, 'productFamily')[productFamily]);
	});
	const close = jest.fn();

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.registerModule('profiles', { namespaced: true, state: { defaultProfile: null } });
		store.registerModule('app', { namespaced: true, state: { companyId: 'BF' } });
		store.mockModule('products', { fetch, get, getSiblings });
		store.mockModule('modal', { close });

		wp = shallowMount(Component, { localVue, store, router });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-product', () => {
		expect(wp.vm.$options.name).toBe('v-product');
	});

	it('shows the correct page title', async () => {
		wp.setProps({ productId: 'account-1' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Cuentas');

		wp.setProps({ productId: 'card-1' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Tarjetas de débito');

		wp.setProps({ productId: 'card-3' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Tarjetas de crédito');

		wp.setProps({ productId: 'deposit-1' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Depósitos a plazo');

		wp.setProps({ productId: 'loan-1' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Préstamos');

		wp.setProps({ productId: 'fund-1' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Fondos');

		wp.setProps({ productId: 'managed-portfolio-1' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Cartera gestionada');

		wp.setProps({ productId: 'account-5' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Cuenta premium');

		wp.setProps({ productId: 'managed-account-1' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Cuenta gestionada');

		wp.setProps({ productId: 'managed-currency-account-1' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Cuenta gestionada en dólares');

		wp.setProps({ productId: 'investment-account-rto-1' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Caminos Inversión');

		wp.setProps({ productId: 'account-4' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Cuenta en dólares');

		wp.setProps({ productId: 'deposit-5' });
		await flushPromises();
		expect(wp.find('h1').text()).toBe('Depósito en dólares');
	});

	it('shows the movement tab when family is account', async () => {
		wp.setProps({ productId: 'account-1' });
		await flushPromises();
		expect(wp.find('[data-testid="resource-list"][resource="asset"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="resource-list"][resource="movement"]').exists()).toBeTruthy();
	});

	it('shows the assets tab when family is fund', async () => {
		wp.setProps({ productId: 'fund-1' });
		await flushPromises();
		expect(wp.find('[data-testid="resource-list"][resource="asset"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="resource-list"][resource="movement"]').exists()).toBeTruthy();
	});

	it('browse between the products', async () => {
		wp.setProps({ productId: 'account-1' });
		await flushPromises();
		const replace = jest.spyOn(router, 'replace').mockImplementation(() => {});

		wp.vm.goto(1);
		wp.setProps({ productId: 'account-2' });
		await flushPromises();
		expect(replace).toHaveBeenCalledWith({
			name: null,
			params: { productId: 'account-2' },
		});

		wp.vm.goto(0);
		wp.setProps({ productId: 'account-1' });
		await flushPromises();
		expect(replace).toHaveBeenCalledWith({
			name: null,
			params: { productId: 'account-1' },
		});

		wp.vm.goto(0);
		wp.setProps({ productId: 'account-1' });
		await flushPromises();
		expect(replace).toHaveBeenCalledTimes(2);
	});

	it('should set last visited resource', async () => {
		await router.push({
			name: 'product',
			params: {
				familyId: 'fund',
				productId: 'fund-1',
			},
		});

		await router.push({
			name: 'movement',
			params: {
				productId: 'fund-1',
				movementId: 'fund-movement-1',
				productType: 'fund',
			},
		});

		const from = router.currentRoute;
		await router.back();

		const next = jest.fn((cb) => cb(wp.vm));
		Component.beforeRouteEnter.call(wp.vm, router.currentRoute, from, next);

		expect(wp.vm.lastResource).toBe('fund-movement-1');
		expect(wp.vm.selectedTab).toBe(1);
	});

	it('should enable search only on account, card and deposit', async () => {
		await wp.setProps({ productId: 'account-1' });
		await flushPromises();
		expect(wp.find('[data-testid="search"]').exists()).toBeTruthy();

		await wp.setProps({ productId: 'pension-plan-1' });
		await flushPromises();
		expect(wp.find('[data-testid="search"]').exists()).toBeFalsy();

		await wp.setProps({ productId: 'card-1' });
		await flushPromises();
		expect(wp.find('[data-testid="search"]').exists()).toBeTruthy();

		await wp.setProps({ productId: 'deposit-1' });
		await flushPromises();
		expect(wp.find('[data-testid="search"]').exists()).toBeFalsy();

		await wp.setProps({ productId: 'deposit-3' });
		await flushPromises();
		expect(wp.find('[data-testid="search"]').exists()).toBeTruthy();
	});

	it('should not show an action button on managed account', async () => {
		wp.setProps({ productId: 'account-1' });
		await flushPromises();

		expect(wp.findComponent({ name: 'w-product-actions' }).exists()).toBeTruthy();

		wp.setProps({ productId: 'managed-account-1' });
		await flushPromises();

		expect(wp.findComponent({ name: 'w-product-actions' }).exists()).toBeFalsy();
	});

	it('should show an action button on currency account', async () => {
		wp.setProps({ productId: 'account-4' });
		await flushPromises();

		expect(wp.findComponent({ name: 'w-product-actions' }).exists()).toBeTruthy();
	});

	it('should not show an action button on managed currency account', async () => {
		wp.setProps({ productId: 'managed-currency-account-1' });
		await flushPromises();

		expect(wp.findComponent({ name: 'w-product-actions' }).exists()).toBeFalsy();
	});

	/**
	 * Al hacer click en descargar documento debería abrir una notificación
	 * con un channel en el que se pase el blob del documento generado.
	 */
	it('should download a pdf of the movements', async () => {
		const getReceipt = jest.fn().mockResolvedValue(blob);
		const open = jest.fn();

		await wp.setProps({ productId: 'account-1' });
		await flushPromises();

		store.mockModule('products', { getReceipt });
		store.mockModule('notification', { open });

		await wp.findComponent({ name: 'w-product-actions' }).vm.$emit('download-document', 'pdf');
		await flushPromises();

		expect(getReceipt).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				productId: 'account-1',
				reportType: 'pdf',
			})
		);

		expect(open.mock.calls[0][1].props.channel.port1.postMessage).toHaveBeenCalledWith({
			name: 'downloaded',
			blob: expect.any(Blob),
			b64Data: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
		});
	});

	/**
	 * Al hacer click en descargar documento debería abrir una notificación
	 * con un channel en el que se pase el blob del documento generado. Pero
	 * si la generación falla, el channel debería lanzar error.
	 */
	it('should fail downloading the pdf of the movements', async () => {
		const getReceipt = jest.fn().mockRejectedValue();
		const open = jest.fn();

		await wp.setProps({ productId: 'account-1' });
		await flushPromises();

		store.mockModule('products', { getReceipt });
		store.mockModule('notification', { open });

		await wp.findComponent({ name: 'w-product-actions' }).vm.$emit('download-document', 'pdf');
		await flushPromises();

		expect(getReceipt).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				productId: 'account-1',
				reportType: 'pdf',
			})
		);

		expect(open.mock.calls[0][1].props.channel.port1.postMessage).toHaveBeenCalledWith({
			name: 'error',
		});
	});
});
