import signature from '@modules/signatures/m-signatures';
import SessionCache from '@modules/session/session-cache';

const newInstance = createPristineVue();

describe('m-signatures', () => {
	let store;

	const fixture = [{ signatureId: 'signature-1' }, { signatureId: 'signature-2' }];

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('signatures', signature);
	});

	afterEach(() => {
		SessionCache.clear();
	});

	it('should call get for signature', async () => {
		const request = jest.fn().mockResolvedValue({ data: { data: fixture } });

		store.mockModule('service', { request });

		await store.dispatch('signatures/fetch', { status: 'pending' });

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/signature', method: 'GET' } },
				queryParams: { status: 'PENDING' },
			})
		);
	});

	it('should call sign for signature', async () => {
		const request = jest
			.fn()
			.mockResolvedValue()
			.mockResolvedValue({ data: { data: fixture } });

		store.mockModule('service', { request });

		await store.dispatch('signatures/sign', { type: 'pending', signatureId: 'signature-1' });

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: {
					request: { url: '/signature/signature-1', method: 'PUT' },
				},
			})
		);
	});

	it('should call delete for signature', async () => {
		const request = jest
			.fn()
			.mockResolvedValue()
			.mockResolvedValue({ data: { data: fixture } });

		store.mockModule('service', { request });

		await store.dispatch('signatures/delete', { type: 'pending', signatureId: 'signature-1' });

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: {
					request: { url: '/signature/signature-1', method: 'DELETE' },
				},
			})
		);
	});

	it('should call complete for signature', async () => {
		const request = jest
			.fn()
			.mockResolvedValue()
			.mockResolvedValue({ data: { data: fixture } });

		store.mockModule('service', { request });

		await store.dispatch('signatures/complete', { type: 'pending', signatureId: 'signature-1' });

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: {
					request: { url: '/signature/signature-1', method: 'PATCH' },
				},
			})
		);
	});

	it('should cache the signatures', async () => {
		const request = jest.fn().mockResolvedValue({ data: { data: fixture } });

		store.mockModule('service', { request });

		await store.dispatch('signatures/fetch', { status: 'pending' });
		await store.dispatch('signatures/fetch', { status: 'pending' });

		expect(request).toHaveBeenCalledTimes(1);
	});

	it('should add new items to the end of the cache list', async () => {
		const request = jest
			.fn()
			.mockResolvedValueOnce({ data: { data: fixture } })
			.mockResolvedValueOnce({ data: { data: [{ signatureId: 'signature-3' }] } });
		store.mockModule('service', { request });

		await store.dispatch('signatures/fetch', { status: 'pending' });
		await store.dispatch('signatures/fetch', { status: 'pending', paginationKey: '1' });

		expect(request).toHaveBeenCalledTimes(2);

		const { data } = await store.dispatch('signatures/fetch', { status: 'pending' });

		expect(data).toHaveLength(3);
	});

	it('should return a signature', async () => {
		const request = jest.fn().mockResolvedValue({ data: { data: fixture } });

		store.mockModule('service', { request });

		await store.dispatch('signatures/get', { status: 'pending', signatureId: 'signature-1' });

		const response = await store.dispatch('signatures/get', {
			status: 'pending',
			signatureId: 'signature-1',
		});

		expect(request).toHaveBeenCalledTimes(1);
		expect(response).toMatchObject({ signatureId: 'signature-1' });
	});
});
