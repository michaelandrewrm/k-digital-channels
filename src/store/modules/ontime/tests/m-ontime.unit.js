import ontime from '@modules/ontime/m-ontime';
import accounts from '@tests/fixtures/products/accounts';

const newInstance = createPristineVue();

describe('m-ontime', () => {
	let store;

	const request = jest.fn().mockResolvedValue({ data: { data: [] } });

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('ontime', ontime);
		store.mockModule('service', { request });
	});

	it('should set is welcome', async () => {
		expect(store.state.ontime.isWelcome).toBeFalsy();

		await store.dispatch('ontime/setWelcome');

		expect(store.state.ontime.isWelcome).toBeTruthy();
	});

	it('should request a ontime create', async () => {
		const productsOnTime = [{ id: 'account-1', onTime: true }];

		await store.dispatch('ontime/create', { productsOnTime });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'PATCH', url: '/ontime' } },
				payload: { productsOnTime },
			})
		);

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/ontime' } },
			})
		);
	});

	it('should request a ontime get', async () => {
		const fixture = accounts.map((item) => ({ ...item, onTime: false }));
		const requestAction = jest.fn().mockResolvedValue({ data: { data: fixture } });
		store.mockModule('service', { request: requestAction });

		await store.dispatch('ontime/get');

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/ontime' } },
			})
		);
		expect(store.state.ontime.productsOntime).toHaveLength(6);
	});

	it('should request a ontime get movements', async () => {
		await store.dispatch('ontime/getMovements');

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/ontime' } },
			})
		);
	});
});
