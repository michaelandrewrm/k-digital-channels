import products from '@modules/products/m-products';
import SessionCache from '@modules/session/session-cache';

import accounts from '@tests/fixtures/products/accounts';
import cards from '@tests/fixtures/products/cards';
import deposits from '@tests/fixtures/products/deposits';

const newInstance = createPristineVue();

describe('m-product', () => {
	let store;

	const request = jest.fn().mockResolvedValue({ data: { data: [] } });

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('service', { request });
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: null },
		});
		store.registerModule('products', products);

		SessionCache.clear();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should request products from the cache', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { data: accounts } });
		store.mockModule('service', { request: requestAction });

		await store.dispatch('products/fetch');
		expect(requestAction).toHaveBeenCalled();

		await store.dispatch('products/fetch');
		expect(requestAction).not.toHaveBeenCalledTimes(2);
	});

	it('should return a single product', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { data: accounts } });
		store.mockModule('service', { request: requestAction });
		const product = await store.dispatch('products/get', 'account-1');

		expect(product.id).toBe('account-1');
	});

	it('should request the detail of a sub product', async () => {
		const getAction = jest.fn();
		store.mockModule('resources', { get: getAction });
		await store.dispatch('products/getDetails', 'fund-1/assets/fund-asset-1');

		expect(getAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				productId: 'fund-1',
				resource: 'assets',
				resourceId: 'fund-asset-1',
			})
		);
	});

	it('should request the detail of a product', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { data: accounts[0] } });
		store.mockModule('service', { request: requestAction });
		await store.dispatch('products/getDetails', 'account-1');

		expect(requestAction).toHaveBeenLastCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/products/account-1' } },
			})
		);
	});

	it('should request for an equity position', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { data: deposits } });
		store.mockModule('service', { request: requestAction });
		await store.dispatch('products/getPosition', { productId: 'equity-1' });

		expect(requestAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/products/equity-1/position' } },
			})
		);

		expect(requestAction).toHaveBeenCalledTimes(1);

		await store.dispatch('products/getPosition', { productId: 'equity-1' });

		expect(requestAction).toHaveBeenCalledTimes(1);
	});

	it('should request for a card pan', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { pan: '1234567890123456' } });
		store.mockModule('service', { request: requestAction });
		const pan = await store.dispatch('products/getCardPAN', { productId: 'card-1' });

		expect(requestAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/products/card-1/pan' } },
			})
		);

		expect(pan).toBe('1234567890123456');
	});

	it('should request for a card cvv', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { cvv: '690' } });
		store.mockModule('service', { request: requestAction });
		const cvv = await store.dispatch('products/getCardCVV', { productId: 'card-1' });

		expect(requestAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/products/card-1/cvv' } },
			})
		);

		expect(cvv).toBe('690');
	});

	it('should request for a card pin', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { pin: '7420' } });
		store.mockModule('service', { request: requestAction });
		const pin = await store.dispatch('products/getCardPIN', { productId: 'card-1' });

		expect(requestAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/products/card-1/pin' } },
			})
		);

		expect(pin).toBe('7420');
	});

	it('should sort products by holder', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { data: [...cards, ...accounts] } });
		store.mockModule('service', { request: requestAction });

		const response = await store.dispatch('products/fetch');
		const sortedModel = response.map(({ id, productFamily }) => `${productFamily}/${id}`);

		expect(sortedModel).toEqual([
			'account/account-1',
			'account/account-2',
			'account/account-6',
			'account/account-3',
			'currency-account/account-4',
			'debit-card/card-2',
			'debit-card/card-1',
			'credit-card/card-4',
			'credit-card/card-3',
			'subscription/card-5',
			'subscription/card-6',
			'subscription/account-5',
		]);
	});

	it('should request for a movement detail as PDF', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { content: 'abc' } });
		store.mockModule('service', { request: requestAction });

		await store.dispatch('products/getReceipt', {
			productId: 'account-1',
			movementId: 'movement-1',
			query: { reference: 'ref-1' },
			reportType: 'pdf',
		});

		expect(requestAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: {
					request: {
						url: '/products/account-1/movements/movement-1/document',
						method: 'GET',
					},
				},
				queryParams: { reference: 'ref-1', reportType: 'pdf' },
			})
		);
	});

	it('should request a pdf receipt for a movement list', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { content: '' } });
		store.mockModule('service', { request: requestAction });

		await store.dispatch('products/getReceipt', {
			productId: 'account-1',
			query: { dateFrom: '01/02/2020', generateOtp: true },
			reportType: 'pdf',
		});

		expect(requestAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: {
					request: {
						url: '/products/account-1/movements/document',
						method: 'GET',
					},
				},
				queryParams: { dateFrom: '01/02/2020', generateOtp: true, reportType: 'pdf' },
			})
		);
	});

	it('should request for a transfer certificate', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { content: '' } });
		store.mockModule('service', { request: requestAction });

		await store.dispatch('products/getCertificate', {
			productId: 'account-1',
			movementId: 'movement-1',
			query: { reference: 'reference-1' },
		});

		expect(requestAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: {
					request: {
						url: '/products/account-1/movements/movement-1/transferCertificate',
						method: 'GET',
					},
				},
				queryParams: { reference: 'reference-1' },
			})
		);
	});

	it('should request for bizum products', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { data: accounts } });
		store.mockModule('service', { request: requestAction });

		await store.dispatch('products/byService', 'bizum');

		expect(requestAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/products', method: 'GET' } },
				queryParams: { byService: 'bizum' },
			})
		);
	});

	it('should request for a portfolio', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { data: [] } });
		store.mockModule('service', { request: requestAction });

		await store.dispatch('products/getPortfolio', { productId: 'account-1' });

		expect(requestAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/products/account-1/managedProducts', method: 'GET' } },
			})
		);
	});

	it('should return the products by default profile', async () => {
		const data = accounts.map((item, i) => ({
			...item,
			profiles: i === 0 ? [{ id: 'profile-1' }] : [],
		}));
		const requestAction = jest.fn().mockResolvedValue({ data: { data } });
		store.mockModule('service', { request: requestAction });
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: { id: 'profile-1', name: 'profile' } },
		});

		await store.dispatch('products/fetch');
		const items = await store.dispatch('products/fetch');

		expect(items).toHaveLength(1);
	});

	it('should return the entire products', async () => {
		const data = accounts.map((item, i) => ({
			...item,
			profiles: i === 0 ? [{ id: 'profile-1' }] : [],
		}));
		const requestAction = jest.fn().mockResolvedValue({ data: { data } });
		store.mockModule('service', { request: requestAction });
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: { id: 'profile-1', name: 'profile' } },
		});

		await store.dispatch('products/fetch');
		const items = await store.dispatch('products/fetch', { force: true });

		expect(items).toHaveLength(6);
	});

	it('should not return from cache when refresh', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { data: accounts } });
		store.mockModule('service', { request: requestAction });
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: { id: 'profile-1', name: 'profile' } },
		});

		await store.dispatch('products/fetch');
		expect(requestAction).toHaveBeenCalledTimes(1);

		await store.dispatch('products/fetch', { refresh: true });
		expect(requestAction).toHaveBeenCalledTimes(2);
	});

	it('should request for a new alias and update cache', async () => {
		const requestAction = jest
			.fn()
			.mockResolvedValue()
			.mockResolvedValue({ data: { data: accounts[0] } });

		store.mockModule('service', { request: requestAction });

		await store.dispatch('products/getDetails', 'account-1');
		await store.dispatch('products/putAlias', { alias: 'newAlias', productId: 'account-1' });

		expect(requestAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/products/account-1/alias', method: 'PUT' } },
				payload: { alias: 'newAlias' },
			})
		);
	});
});
