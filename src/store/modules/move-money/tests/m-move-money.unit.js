import moveMoney from '@modules/move-money/m-move-money';
import flushPromises from 'flush-promises';
import accounts from '@tests/fixtures/products/accounts';
import ordererTransfers from '@tests/fixtures/transfers/ordered';
import SessionCache from '@modules/session/session-cache';

const newInstance = createPristineVue();

describe('m-move-money', () => {
	let store;

	const model = {
		transferId: 'transfer-1',
		origin: {
			id: 'account-1',
			alias: 'Cuenta Corriente',
			balance: { amount: 784.03, currency: { id: 'EUR' } },
			productNumber: {
				format: { id: 'IBAN', name: 'IBAN' },
				value: 'ES3102340098375445122708',
			},
		},
		destination: {
			account: { type: 'IBAN', id: 'CH35400381564AIVBCS54', bic: 'BANKCHXXXXX' },
			transferMode: 'SEPA',
			name: 'Elisa Naranjo',
			view: { name: 'Elisa Naranjo', id: '**** **** **** **** **** CS54' },
		},
		amount: { amount: 931.03, currency: { id: 'EUR' } },
		reason: 'A asperiores in aliquam est',
		periodicity: 'scheduled',
		date: '2021-09-08',
		frequency: null,
		maxDate: null,
		fees: {
			fee: { amount: 0, currency: { id: 'EUR' } },
			expense: { amount: 0, currency: { id: 'EUR' } },
			total: { amount: 931.03, currency: { id: 'EUR' } },
		},
	};

	const request = jest
		.fn()
		.mockResolvedValue({ data: { data: [] } })
		.mockResolvedValueOnce({ data: { data: accounts } });

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('service', { request });
		store.registerModule('move-money', moveMoney);
	});

	afterEach(() => {
		jest.clearAllMocks();
		SessionCache.clear();
	});

	it('should request for ordered transfer list', async () => {
		const type = 'ordered';
		await store.dispatch('move-money/getTransfers', { type });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/origins', method: 'GET' } },
				queryParams: { type: 'transferList' },
			})
		);

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/transfers?type=issued', method: 'GET' } },
			})
		);
	});

	it('should request for scheduled transfer list', async () => {
		const type = 'scheduled';
		await store.dispatch('move-money/getTransfers', { type });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/origins', method: 'GET' } },
				queryParams: { type: 'transferList' },
			})
		);

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/transfers/scheduled', method: 'GET' } },
			})
		);
	});

	it('should request for favorite transfer list', async () => {
		const type = 'favorite';
		await store.dispatch('move-money/getTransfers', { type });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/origins', method: 'GET' } },
				queryParams: { type: 'transferList' },
			})
		);

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/favorites', method: 'GET' } },
			})
		);
	});

	it('should return a single transfer', async () => {
		const requestAction = jest
			.fn()
			.mockResolvedValue({ data: { data: ordererTransfers } })
			.mockResolvedValueOnce({ data: { data: accounts } });

		store.mockModule('service', { request: requestAction });

		const type = 'ordered';
		const transferId = 'orderer-1';
		const item = await store.dispatch('move-money/getTransfer', { type, transferId });

		expect(item).toMatchObject({
			...ordererTransfers[0],
			orderer: { fromAccount: { id: 'account-1' } },
		});

		await store.dispatch('move-money/getTransfer', { type, transferId });

		expect(requestAction).toHaveBeenCalledTimes(2);

		await store.dispatch('move-money/getTransfer', { type, transferId });

		expect(requestAction).toHaveBeenCalledTimes(2);
	});

	it('should request for a transfer deletion', async () => {
		const type = 'favorite';
		const transferId = 'favorite-1';
		await store.dispatch('move-money/deleteTransfer', { type, transferId });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/favorites/favorite-1', method: 'DELETE' } },
			})
		);
	});

	it('should request for a transfer modification', async () => {
		await store.dispatch('move-money/modifyTransfer', { transferId: 'scheduled-1', model });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/transfers/scheduled/scheduled-1', method: 'PUT' } },
				payload: {
					origin: model.origin.id,
					beneficiary: {
						account: model.destination.account,
						name: model.destination.name,
						favorite: Boolean(model.destination.favorite),
					},
					amount: model.amount,
					date: model.date,
					reason: model.reason,
					transferMode: model.destination.transferMode,
				},
			})
		);
	});

	it('should request for a origin list', async () => {
		await store.dispatch('move-money/getOrigins');
		await flushPromises();

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/origins', method: 'GET' } },
				queryParams: { type: 'transfer' },
			})
		);

		await store.dispatch('move-money/getOrigins');
		expect(request).not.toHaveBeenCalledTimes(2);
	});

	it('should request for a destination list', async () => {
		await store.dispatch('move-money/getDestinations');

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/destinations', method: 'GET' } },
				queryParams: { type: 'transfer' },
			})
		);

		await store.dispatch('move-money/getDestinations');
		expect(request).not.toHaveBeenCalledTimes(2);
	});

	it('should request for a transfer limits', async () => {
		const limits = {
			ownAccounts: 0,
			internalAccounts: 0,
			externalAccounts: 0,
			postedInternalAccounts: 0,
			postedExternalAccounts: 0,
		};
		const requestAction = jest.fn().mockResolvedValue({ data: limits });
		store.mockModule('service', { request: requestAction });
		const customLimits = await store.dispatch('move-money/getLimits');

		expect(requestAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/transfers/limits', method: 'GET' } },
			})
		);

		expect(customLimits).toMatchObject({
			ownOperationLimit: 0,
			internalOperationLimit: 0,
			externalOperationLimit: 0,
			internalDailyLimit: 0,
			externalDailyLimit: 0,
		});
	});

	it('should request for a favorite validation', async () => {
		const alias = 'alias-1';
		const destination = { transferMode: 'INTERNAL' };
		await store.dispatch('move-money/validateFavorite', { alias, destination });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/favorites/validate', method: 'GET' } },
				queryParams: { alias, transferMode: destination.transferMode },
			})
		);
	});

	it('should request for a IBAN validation', async () => {
		const iban = 'ES00';
		const type = 'IBAN';
		const bic = 'bic';
		await store.dispatch('move-money/validateXBAN', { iban, type, bic });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/validateBICIBAN', method: 'GET' } },
				queryParams: { iban, type, bic },
			})
		);
	});

	it('should request for a transfer simulation', async () => {
		await store.dispatch('move-money/simulate', model);

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/transfers/simulate', method: 'POST' } },
				payload: {
					origin: model.origin.id,
					beneficiary: {
						account: model.destination.account,
						name: model.destination.name,
						favorite: Boolean(model.destination.favorite),
					},
					amount: model.amount,
					date: model.date,
					reason: model.reason,
					transferMode: model.destination.transferMode,
					favorite: false,
				},
			})
		);
	});

	it('should add a chargeBearer for international transfers', async () => {
		await store.dispatch('move-money/simulate', {
			...model,
			chargeBearer: 'OWN',
		});

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/transfers/simulate', method: 'POST' } },
				payload: expect.objectContaining({ chargeBearer: 'OWN' }),
			})
		);
	});

	it('should add scheduled to the model on periodic transfers', async () => {
		await store.dispatch('move-money/simulate', {
			...model,
			periodicity: 'periodic',
			frequency: '0.5',
			maxDate: '2020-10-27',
		});

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/transfers/simulate', method: 'POST' } },
				payload: expect.objectContaining({
					scheduled: { frequency: '0.5', lastExecutionDate: '2020-10-27' },
				}),
			})
		);
	});

	it('should request for a transfer', async () => {
		await store.dispatch('move-money/transfer', {
			...model,
			notify: true,
			email: 'example@gmail.com',
		});

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/transfers', method: 'POST' } },
				payload: {
					origin: model.origin.id,
					beneficiary: {
						account: model.destination.account,
						name: model.destination.name,
						favorite: Boolean(model.destination.favorite),
					},
					amount: model.amount,
					date: model.date,
					reason: model.reason,
					transferMode: model.destination.transferMode,
					favorite: false,
					emailInfo: 'example@gmail.com',
				},
			})
		);
	});

	it('should request for a transfer receipt', async () => {
		const reference = '1db5dcd7ed3a';
		const transferMode = 'SEPA';
		const reportType = 'xls';
		await store.dispatch('move-money/getReceipt', { reference, transferMode, reportType });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/transfers/1db5dcd7ed3a/document', method: 'GET' } },
				queryParams: { type: 'issued', reportType: 'xls', mode: 'SEPA' },
			})
		);
	});

	it('should request for an ordered transfer detail', async () => {
		await store.dispatch('move-money/getTransfer', {
			type: 'ordered',
			productId: 'account-1',
			transferId: 'transfer-1',
		});
		await flushPromises();

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/move-money/transfers/detail', method: 'GET' } },
				queryParams: { type: 'issued', transferId: 'transfer-1', productId: 'account-1' },
			})
		);

		await store.dispatch('move-money/getTransfer', {
			type: 'ordered',
			productId: 'account-1',
			transferId: 'transfer-1',
		});

		expect(request).toHaveBeenCalledTimes(2);
	});
});
