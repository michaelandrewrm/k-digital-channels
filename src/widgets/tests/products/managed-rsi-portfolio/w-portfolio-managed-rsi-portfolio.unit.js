import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@widgets/products/managed-rsi-portfolio/w-portfolio-managed-rsi-portfolio.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-portfolio-managed-rsi-portfolio.vue', () => {
	let wp;
	let store;
	let router;

	const product = {
		id: 'managed-rsi-portfolio-1',
		name: 'GESTIÓN DISCRECIONAL DE CARTERAS',
		alias: 'CARTERA GESTIONADA',
		productNumber: { value: '7580', format: { id: 'CCV', name: 'CCV' } },
		productType: { id: 's-01' },
		productSubtype: { id: 's-01' },
		balance: { amount: 0, currency: { id: 'UNDEFINED' } },
		productFamily: 'managed-rsi-portfolio',
	};

	const fixture = [
		{
			id: 'managed-currency-account-1',
			alias: 'Cuenta Corriente en dólares',
			productType: { id: '01' },
			productSubtype: { id: 'm-03' },
			relationType: { id: '01' },
			balance: { amount: 123.45, currency: { id: 'USD' } },
			productNumber: { format: { id: 'IBAN' }, value: '3212' },
			parentId: 'managed-rsi-portfolio-1',
			productFamily: 'managed-product',
		},
		{
			id: 'managed-currency-account-2',
			alias: 'Cuenta Corriente en libras',
			productType: { id: '01' },
			productSubtype: { id: 'm-03' },
			relationType: { id: '01' },
			balance: { amount: 123.45, currency: { id: 'GBP' } },
			productNumber: { format: { id: 'IBAN' }, value: '3231' },
			parentId: 'managed-rsi-portfolio-1',
			productFamily: 'managed-product',
		},
		{
			id: 'managed-currency-account-3',
			alias: 'Cuenta Corriente en libras',
			productType: { id: '01' },
			productSubtype: { id: 'm-03' },
			relationType: { id: '01' },
			balance: { amount: 123.45, currency: { id: 'GBP' } },
			productNumber: { format: { id: 'IBAN' }, value: '2998' },
			parentId: 'managed-rsi-portfolio-1',
			productFamily: 'managed-product',
		},
		{
			id: 'managed-deposit-1',
			alias: 'Depósito Caminos',
			productType: { id: '03' },
			productSubtype: { id: 'm-08' },
			relationType: { id: '01' },
			balance: { amount: 123.45, currency: { id: 'EUR' } },
			productNumber: { format: { id: 'FIDES' }, value: '1755' },
			parentId: 'managed-rsi-portfolio-1',
			productFamily: 'managed-product',
		},
		{
			id: 'debit-card-1',
			alias: 'Tarjeta débito',
			productType: { id: '02' },
			productSubtype: { id: '06' },
			relationType: { id: '01' },
			balance: { amount: 0, currency: { id: 'EUR' } },
			productNumber: { format: { id: 'FIDES' }, value: '0031' },
			parentId: 'managed-rsi-portfolio-1',
			productFamily: 'managed-product',
		},
	];

	const get = jest.fn().mockReturnValue(product);

	beforeEach(async () => {
		const { shallowStore, shallowRouter } = newInstance;

		store = shallowStore;
		router = shallowRouter;

		router.addRoute({ name: 'sso-lighthouse', path: '/sso-lighthouse/:productId' });
		router.addRoute({ name: 'product', path: '/product/:familyId/:productId' });

		store.mockModule('products', { get });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { source: fixture, productId: 'managed-rsi-portfolio-1' },
		});

		await flushPromises();
	});

	it('has a name equal to w-portfolio-managed-rsi-portfolio', () => {
		expect(wp.vm.$options.name).toBe('w-portfolio-managed-rsi-portfolio');
	});

	it('renders correctly', () => {
		expect(wp.element).toMatchSnapshot();
	});

	/**
	 * El primer elemento debe ser el mismo producto padre, o sea la cartera gestionada.
	 * Debe redirigir al hacer click a la página de lighthouse.
	 */
	it('the first item should redirect to lighthouse', async () => {
		await wp
			.findAll('button')
			.at(0)
			.trigger('click');

		expect(router.history.current).toMatchObject({
			name: 'sso-lighthouse',
			params: {
				productId: 'managed-rsi-portfolio-1',
				operative: 'portfolioAssessment',
			},
		});
	});

	/**
	 * El segundo elemento debe ser el un producto hijo de la cartera gestionada.
	 * Debe redirigir al hacer click a la página del producto.
	 */
	it('the second item should redirect to product view', async () => {
		await wp
			.findAll('button')
			.at(1)
			.trigger('click');

		expect(router.history.current).toMatchObject({
			name: 'product',
			params: {
				productId: 'managed-currency-account-1',
				familyId: 'managed-product',
			},
		});
	});
});
