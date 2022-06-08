import sirvase from '@modules/sirvase/m-sirvase';

const newInstance = createPristineVue();

describe('m-sirvase', () => {
	let store;

	const fixture = [
		{
			id: 'request-1',
			type: {
				id: '01',
				name_es: 'Transferencias y Traspasos',
				name_en: 'Transfers',
			},
			requestDate: '01-01-2022 00:00:00',
			status: {
				id: '01',
				name_es: 'Solicitada',
				name_en: 'Requested',
			},
			description: 'description',
		},
	];

	const request = jest.fn().mockResolvedValue({ data: fixture });

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('sirvase', sirvase);
		store.mockModule('service', { request });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should request for sirvase requests list', async () => {
		await store.dispatch('sirvase/get');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/customer-support/request' } },
			})
		);
	});

	it('should request for a sirvase request', async () => {
		const payload = { type: { id: '01' }, description: 'description' };
		await store.dispatch('sirvase/request', { payload });

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'POST', url: '/customer-support/request' } },
				payload,
			})
		);
	});

	it('should retrieve a single sirvase request', async () => {
		await store.dispatch('sirvase/get', { requestId: 'request-1' });

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/customer-support/request/request-1' } },
			})
		);
	});

	it('should request for a sirvase request status set', async () => {
		await store.dispatch('sirvase/setRequestStatus', {
			requestId: 'request-1',
			status: '01',
		});

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'PATCH', url: '/customer-support/request/request-1' } },
				payload: { status: '01' },
			})
		);
	});

	it('should request for a typologies list', async () => {
		await store.dispatch('sirvase/getTypologies');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/customer-support/typology' } },
			})
		);
	});
});
