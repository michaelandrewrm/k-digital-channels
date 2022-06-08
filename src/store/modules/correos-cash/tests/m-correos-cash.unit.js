import correosCash from '@modules/correos-cash/m-correos-cash';
import SessionCache from '@modules/session/session-cache';

const newInstance = createPristineVue();

describe('m-correos-cash', () => {
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('correos-cash', correosCash);

		SessionCache.clear();
	});

	it('should call request for correos cash deposit', async () => {
		const request = jest.fn().mockResolvedValue({ data: {} });

		store.mockModule('service', { request });

		await store.dispatch('correos-cash/request', {
			destination: { account: { id: 'ES3102340098375445122708' } },
			amount: { amount: 123.45, currency: { id: 'EUR' } },
		});

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/move-money/correos-cash/deposit', method: 'POST' } },
				payload: { beneficiaryProductNumber: 'ES3102340098375445122708', amount: 123.45 },
			})
		);
	});

	it('should call get deposits for correos cash deposits', async () => {
		const request = jest.fn().mockResolvedValue({ data: { paging: {}, data: [] } });

		store.mockModule('service', { request });

		await store.dispatch('correos-cash/get', { paginationKey: 0 });

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/move-money/correos-cash/deposits', method: 'GET' } },
			})
		);
	});

	it('should cache a correos cash deposit list', async () => {
		const request = jest.fn().mockResolvedValue({ data: { data: [{ id: '1' }, { id: '2' }] } });

		store.mockModule('service', { request });

		await store.dispatch('correos-cash/get', { paginationKey: 0 });
		await store.dispatch('correos-cash/get', { paginationKey: 0 });

		expect(request).toHaveBeenCalledTimes(1);
	});

	it('should return a deposit', async () => {
		const request = jest.fn().mockResolvedValue({ data: { data: [{ id: '1' }, { id: '2' }] } });

		store.mockModule('service', { request });

		await store.dispatch('correos-cash/get', { paginationKey: 0 });

		const response = await store.dispatch('correos-cash/get', { depositId: '1' });

		expect(request).toHaveBeenCalledTimes(1);
		expect(response).toMatchObject({ id: '1' });
	});

	it('return base64 qr code from a deposit', async () => {
		const fixture = [
			{
				id: 'BF1634887606129',
				detailsCount: 3,
				totalAmount: 5000,
				operationDate: '2021-10-22',
				beneficiary: {
					productNumber: 'ES5201258000330000116525',
					name: 'ELAENA LANNISTER TULLY',
				},
				details: [
					{
						operationId: 'BF1634887606129-001',
						clientId: '60023773',
						amount: 2490,
						issuerName: 'THAIS',
						issuerFirstName: 'VIVANCOS',
						issuerSecondSurname: 'GARCIA',
						issuerCno: null,
						issuerPhone: '666388578',
						issuerAddress: 'CL NARVAEZ MOD_CTA, N20 BLOQUE 1 PORTAL 2 ESCALERA A',
						issuerZipCode: '28009',
						issuerCity: 'MADRID',
						issuerState: 'MADRID',
						issuerCountry: 'ES',
						issuerNationality: 'ES',
						issuerBirthDate: '1985-01-21',
						issuerBirthCountry: 'ES',
						issuerDoiType: '2',
						issuerDoiNumber: '03919163D',
						issuerDoiCountry: 'ES',
						issuerDoiExpiredDate: null,
					},
					{
						operationId: 'BF1634887606129-003',
						clientId: '60023773',
						amount: 20,
						issuerName: 'THAIS',
						issuerFirstName: 'VIVANCOS',
						issuerSecondSurname: 'GARCIA',
						issuerCno: null,
						issuerPhone: '666388578',
						issuerAddress: 'CL NARVAEZ MOD_CTA, N20 BLOQUE 1 PORTAL 2 ESCALERA A',
						issuerZipCode: '28009',
						issuerCity: 'MADRID',
						issuerState: 'MADRID',
						issuerCountry: 'ES',
						issuerNationality: 'ES',
						issuerBirthDate: '1985-01-21',
						issuerBirthCountry: 'ES',
						issuerDoiType: '2',
						issuerDoiNumber: '03919163D',
						issuerDoiCountry: 'ES',
						issuerDoiExpiredDate: null,
					},
				],
			},
		];
		const request = jest.fn().mockResolvedValue({ data: { data: fixture } });

		store.mockModule('service', { request });

		await store.dispatch('correos-cash/get', { paginationKey: 0 });
		await store.dispatch('correos-cash/get', { paginationKey: 1 });

		const codes = await store.dispatch('correos-cash/getQRCodesFromDeposit', {
			depositId: 'BF1634887606129',
		});

		expect(request).toHaveBeenCalledTimes(2);
		expect(codes).toMatchSnapshot('qr-codes');
	});
});
