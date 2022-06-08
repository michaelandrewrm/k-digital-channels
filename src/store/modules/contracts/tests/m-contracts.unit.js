import contracts from '@modules/contracts/m-contracts';

const newInstance = createPristineVue();

describe('m-contracts', () => {
	let store;
	const fixture = {
		connectedContract: null,
		contracts: [
			{
				id: 'owner-1',
				description: 'owner-desc-1',
				type: 'owner',
			},
			{
				id: 'user-1',
				description: 'user-desc-1',
				type: 'user',
			},
		],
	};

	const request = jest.fn().mockResolvedValue({ data: { data: [] } });
	const open = jest.fn().mockResolvedValue(true);

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('contracts', contracts);
		store.mockModule('modal', { open });
		store.registerModule('authn', { namespaced: true, state: { isEmbedded: false } });
		store.mockModule('service', { request });
		store.mockModule('profiles', { get: jest.fn().mockResolvedValue() });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should get some contracts', async () => {
		await store.dispatch('contracts/get');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/contracts' } },
			})
		);
	});

	it('should set a contract', async () => {
		const contract = fixture.contracts[0];
		const requestAction = jest.fn().mockResolvedValue({ data: contract });

		store.mockModule('service', { request: requestAction });

		await store.dispatch('contracts/set', contract);

		expect(requestAction).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: {
					request: { method: 'PATCH', url: `/contracts/${contract.id}` },
				},
			})
		);
		expect(store.state.contracts.connectedContract).toMatchObject(contract);
	});

	it('should not set the current contract', async () => {
		const contract = fixture.contracts[0];
		const requestAction = jest.fn().mockResolvedValue({ data: contract });

		store.mockModule('service', { request: requestAction });

		await store.dispatch('contracts/set', contract);
		await store.dispatch('contracts/set', contract);

		expect(requestAction).not.toHaveBeenCalledWith();
	});

	it('should open a modal on error', async () => {
		const contract = fixture.contracts[0];
		const requestAction = jest.fn().mockRejectedValue();

		store.mockModule('service', { request: requestAction });

		await store.dispatch('contracts/set', contract);

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				component: { default: expect.objectContaining({ name: 'm-something-wrong' }) },
				props: { modal: true },
			})
		);
	});

	it('should reset the connect contract', async () => {
		const contract = fixture.contracts[0];
		const requestAction = jest.fn().mockResolvedValue({ data: contract });

		store.mockModule('service', { request: requestAction });

		await store.dispatch('contracts/set', contract);
		expect(store.state.contracts.connectedContract).toMatchObject(contract);

		await store.dispatch('contracts/reset');
		expect(store.state.contracts.connectedContract).toBeFalsy();
	});
});
