import bizum from '@modules/bizum/m-bizum';
import SessionCache from '@modules/session/session-cache';

const newInstance = createPristineVue();

describe('m-bizum', () => {
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('bizum', bizum);

		store.registerModule('app', {
			state() {
				return { companyId: 'BC' };
			},
		});

		SessionCache.clear();
	});

	it('requestActive', async () => {
		const request = jest.fn().mockResolvedValue();

		store.mockModule('service', { request });

		await store.dispatch('bizum/requestActive');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/active', method: 'GET' } },
			})
		);
	});

	it('getProduct', async () => {
		const request = jest.fn().mockResolvedValue({
			data: {
				product: {
					alias: 'cuenta transparente',
					balance: { amount: 12, currency: { id: 'EUR' } },
					productId: '1230912039102312',
					productNumber: { value: 'ES3102340098375445122708', format: { id: 'IBAN' } },
				},
			},
		});

		store.mockModule('service', { request });

		await store.dispatch('bizum/getProduct');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/signup', method: 'GET' } },
			})
		);
	});

	it('setProduct', async () => {
		const request = jest.fn().mockResolvedValue();

		store.mockModule('service', { request });

		await store.dispatch('bizum/setProduct', 'asdf123');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/signup', method: 'PUT' } },
				payload: { productId: 'asdf123' },
			})
		);
	});

	it('getTerms', async () => {
		const request = jest.fn().mockResolvedValue({ data: { url: 'mock', version: '1.0.0' } });
		const publicRequest = jest.fn().mockResolvedValue({ data: 'terms and conditions' });

		store.unregisterModule('bizum');
		const bizumMockedModule = {
			...bizum,
			modules: { publicService: { namespaced: true, actions: { request: publicRequest } } },
		};
		store.registerModule('bizum', bizumMockedModule);
		store.mockModule('service', { request });

		const template = await store.dispatch('bizum/getTerms');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/settings', method: 'GET' } },
			})
		);

		expect(template).toMatchObject({
			template: String('terms and conditions'),
			version: '1.0.0',
		});
	});

	it('cache getTerms', async () => {
		const request = jest.fn().mockResolvedValueOnce({ data: { url: 'mock', version: '1.0.0' } });
		const publicRequest = jest.fn().mockResolvedValue({ data: 'terms and conditions' });

		store.unregisterModule('bizum');
		const bizumMockedModule = {
			...bizum,
			modules: { publicService: { namespaced: true, actions: { request: publicRequest } } },
		};
		store.registerModule('bizum', bizumMockedModule);
		store.mockModule('service', { request });

		await store.dispatch('bizum/getTerms');
		await store.dispatch('bizum/getTerms');

		expect(request).toHaveBeenCalledTimes(1);
	});

	it('getTermsInPDF', async () => {
		const request = jest.fn().mockResolvedValue({ data: { pdf: 'mock', version: '1.0.0' } });
		const publicRequest = jest.fn().mockResolvedValue({ data: 'terms and conditions' });

		store.unregisterModule('bizum');
		const bizumMockedModule = {
			...bizum,
			modules: { publicService: { namespaced: true, actions: { request: publicRequest } } },
		};
		store.registerModule('bizum', bizumMockedModule);
		store.mockModule('service', { request });

		await store.dispatch('bizum/getTermsInPDF');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/settings', method: 'GET' } },
			})
		);
	});

	it('cache getTermsInPDF', async () => {
		const request = jest
			.fn()
			.mockResolvedValue({ data: { url: 'urlmock', pdf: 'pdfmock', version: '1.0.0' } });
		const publicRequest = jest.fn().mockResolvedValue({ data: 'terms and conditions' });

		store.unregisterModule('bizum');
		const bizumMockedModule = {
			...bizum,
			modules: { publicService: { namespaced: true, actions: { request: publicRequest } } },
		};
		store.registerModule('bizum', bizumMockedModule);
		store.mockModule('service', { request });

		const template = await store.dispatch('bizum/getTerms');
		expect(template).toMatchObject({
			template: String('terms and conditions'),
			version: '1.0.0',
		});

		await store.dispatch('bizum/getTermsInPDF');
		const pdf = await store.dispatch('bizum/getTermsInPDF');

		expect(request).toHaveBeenCalledTimes(1);
		expect(pdf).toBe('pdfmock');
	});

	it('signUp', async () => {
		const request = jest.fn().mockResolvedValue();

		store.mockModule('service', { request });

		await store.dispatch('bizum/signUp', { productId: '1234', version: '1.0.0' });

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/signup', method: 'POST' } },
				payload: { productId: '1234', termsVersion: '1.0.0' },
			})
		);
	});

	it('unregister', async () => {
		const request = jest.fn().mockResolvedValue();

		store.mockModule('service', { request });

		await store.dispatch('bizum/unregister');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/signup', method: 'DELETE' } },
			})
		);
	});

	it('requestPortability', async () => {
		const request = jest.fn().mockResolvedValue();

		store.mockModule('service', { request });

		await store.dispatch('bizum/requestPortability', { signupId: '1234' });

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/signup/1234/accept', method: 'PATCH' } },
			})
		);
	});

	it('sendOTP', async () => {
		const request = jest.fn().mockResolvedValue();

		store.mockModule('service', { request });

		await store.dispatch('bizum/sendOTP', { signupId: '1234', otpValue: '666333' });

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/signup/1234', method: 'PATCH' } },
				payload: { portabilityCode: '666333' },
			})
		);
	});

	it('getMovement', async () => {
		const request = jest
			.fn()
			.mockResolvedValueOnce({
				data: {
					data: [{ id: 'asdf123', hasExtraInfo: true }],
					paging: { hasMorePages: false },
				},
			})
			.mockResolvedValue({ data: { data: { id: 'asdf123' } } });

		store.mockModule('service', { request });

		await store.dispatch('bizum/getMovements', { status: 'completed' });
		await store.dispatch('bizum/getMovement', 'asdf123');

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/movements/asdf123', method: 'GET' } },
			})
		);
	});

	it('getMovement with invitation', async () => {
		const request = jest.fn().mockResolvedValueOnce({
			data: {
				data: [
					{
						id: 'asdf123',
						hasExtraInfo: false,
						status: { name: 'IPENDING' },
						possibleActions: ['CANCEL', 'RETURN'],
					},
				],
				paging: { hasMorePages: false },
			},
		});

		store.mockModule('service', { request });

		await store.dispatch('bizum/getMovements', { status: 'completed' });
		const movement = await store.dispatch('bizum/getMovement', 'asdf123');

		expect(movement.possibleActions).toStrictEqual(['ICANCEL', 'RETURN']);
	});

	it('saveMovement', async () => {
		const request = jest.fn().mockResolvedValue({
			data: {
				data: [
					{
						id: 'asdf123',
						type: { name: 'cancel' },
						beneficiary: { phone: '+34657135544' },
						sender: { phone: '+34645249154' },
						amount: { amount: 12, currency: { id: 'EUR' } },
					},
				],
				paging: { hasMorePages: false },
			},
		});

		store.mockModule('service', { request });

		// saveMovement no funciona si previamente no se hace la llamada
		// a getMovements para obtener la información del movimiento a guardar.
		await store.dispatch('bizum/getMovements', { status: 'completed' });
		await store.dispatch('bizum/saveMovement', { id: 'asdf123', mode: 'cancel' });

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/movements/asdf123', method: 'PUT' } },
				payload: expect.objectContaining({
					action: 'CANCEL',
					type: 'cancel',
					sender: '+34645249154',
					beneficiary: '+34657135544',
					amount: { amount: 12, currency: { id: 'EUR' } },
				}),
			})
		);
	});

	it('getMovements', async () => {
		const request = jest.fn().mockResolvedValue({
			data: {
				data: [{ id: '1' }, { id: '2' }],
				paging: { hasMorePages: false },
			},
		});

		store.mockModule('service', { request });

		await store.dispatch('bizum/getMovements', { status: 'completed' });

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/movements/', method: 'GET' } },
				queryParams: { status: 'COMPLETED' },
			})
		);

		await store.dispatch('bizum/getMovements', {
			query: { type: 'SENT' },
			status: 'pending',
			paginationKey: 'aab',
		});

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/movements/', method: 'GET' } },
				queryParams: { status: 'PENDING', type: 'SENT', paginationKey: 'aab' },
			})
		);
	});

	it('operateMoney', async () => {
		const request = jest.fn().mockResolvedValue({ data: {} });
		const model = {
			recipient: '+34657136655',
			amount: { amount: 12, currency: { id: 'EUR' } },
			reason: 'por tu cumple',
			ong: { id: '00054', name: 'Caritas' },
		};

		store.mockModule('service', { request });

		await store.dispatch('bizum/operateMoney', { mode: 'send', model });

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/send-money', method: 'POST' } },
				payload: expect.objectContaining({
					beneficiary: { phone: '+34657136655' },
					amount: { amount: 12, currency: { id: 'EUR' } },
					reason: 'por tu cumple',
				}),
			})
		);

		await store.dispatch('bizum/operateMoney', { mode: 'request', model });

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/request-money', method: 'POST' } },
				payload: expect.objectContaining({
					issuer: { phone: '+34657136655' },
					amount: { amount: 12, currency: { id: 'EUR' } },
					reason: 'por tu cumple',
				}),
			})
		);

		await store.dispatch('bizum/operateMoney', { mode: 'donate', model });

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/send-money', method: 'POST' } },
				payload: expect.objectContaining({
					beneficiary: { phone: '00054' },
					amount: { amount: 12, currency: { id: 'EUR' } },
					reason: 'por tu cumple',
				}),
			})
		);

		await store.dispatch('bizum/operateMoney', { mode: 'send', model: { ...model, id: '1234' } });

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/send-money/1234', method: 'PUT' } },
				payload: expect.objectContaining({
					beneficiary: { phone: '+34657136655' },
					amount: { amount: 12, currency: { id: 'EUR' } },
					reason: 'por tu cumple',
				}),
			})
		);
	});

	it('additional content on operateMoney', async () => {
		const request = jest.fn().mockResolvedValue({ data: {} });
		const model = {
			recipient: '+34657136655',
			amount: { amount: 12, currency: { id: 'EUR' } },
			reason: 'por tu cumple',
			additionalText: 'te envio una foto 😚',
			additionalImage: 'data:image/jpg;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
		};

		store.mockModule('service', { request });

		await store.dispatch('bizum/operateMoney', { mode: 'send', model });

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/send-money', method: 'POST' } },
				payload: expect.objectContaining({
					beneficiary: { phone: '+34657136655' },
					amount: { amount: 12, currency: { id: 'EUR' } },
					reason: 'por tu cumple',
					additionalContext: {
						imageFormat: 'JPG',
						image: 'R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
						text: 'dGUgZW52aW8gdW5hIGZvdG8g8J+Ymg==',
					},
				}),
			})
		);
	});

	it('accept operateMoney', async () => {
		const request = jest.fn().mockResolvedValue({ data: {} });
		const model = {
			id: '1234',
			recipient: '+34657136655',
			amount: { amount: 12, currency: { id: 'EUR' } },
			reason: 'por tu cumple',
		};

		store.mockModule('service', { request });

		await store.dispatch('bizum/operateMoney', { mode: 'send', model, accept: true });

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/send-money/1234/accept', method: 'PUT' } },
				payload: expect.objectContaining({
					beneficiary: { phone: '+34657136655' },
					amount: { amount: 12, currency: { id: 'EUR' } },
					reason: 'por tu cumple',
				}),
			})
		);
	});

	it('getContacts', async () => {
		const request = jest.fn().mockResolvedValue({ data: { data: { addressbook: [] } } });

		store.mockModule('service', { request });

		await store.dispatch('bizum/getContacts', [{ name: 'Eduardo' }]);

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/addressbook', method: 'POST' } },
				payload: { addressbook: [{ name: 'Eduardo' }] },
			})
		);
	});

	it('isEnabled is true if user is in whitelist', async () => {
		const request = jest.fn().mockResolvedValue();

		store.mockModule('service', { request });

		const isEnabled = await store.dispatch('bizum/isEnabled');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/whitelist', method: 'GET' } },
			})
		);
		expect(isEnabled).toBeTruthy();
	});

	it('isEnabled is false if user is not in whitelist', async () => {
		const request = jest.fn().mockRejectedValue();

		store.mockModule('service', { request });

		const isEnabled = await store.dispatch('bizum/isEnabled');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/whitelist', method: 'GET' } },
			})
		);
		expect(isEnabled).toBeFalsy();
	});

	it('isActive is true if user is in whitelist and is active', async () => {
		const request = jest
			.fn()
			.mockResolvedValueOnce()
			.mockResolvedValue();

		store.mockModule('service', { request });

		const isActive = await store.dispatch('bizum/isActive');

		expect(isActive).toBeTruthy();
	});

	it('isActive is false if user is in whitelist and is not active', async () => {
		const request = jest
			.fn()
			.mockResolvedValueOnce()
			.mockRejectedValue();

		store.mockModule('service', { request });

		const isActive = await store.dispatch('bizum/isActive');

		expect(isActive).toBeFalsy();
	});

	it('isActive is false if user is not in whitelist', async () => {
		const request = jest.fn().mockRejectedValue();

		store.mockModule('service', { request });

		const isActive = await store.dispatch('bizum/isActive');

		expect(isActive).toBeFalsy();
	});

	it('getONGs', async () => {
		const request = jest.fn().mockResolvedValue({
			data: {
				data: [{ id: '1' }, { id: '2' }],
				paging: { hasMorePages: false },
			},
		});

		store.mockModule('service', { request });

		const ongs = await store.dispatch('bizum/getONGs');

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/ongs', method: 'GET' } },
			})
		);

		expect(ongs).toBeTruthy();

		await store.dispatch('bizum/getONGs', {
			query: { name: 'Ed' },
			paginationKey: 'aab',
		});

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/ongs', method: 'GET' } },
				queryParams: { name: 'Ed', paginationKey: 'aab' },
			})
		);

		const ong = store.dispatch('bizum/getONG', '1');

		expect(ong).toBeTruthy();
	});

	it('deleteAdditionalContent', async () => {
		const movement = {
			id: '1234',
			hasExtraInfo: true,
			additionalContext: [
				{
					imageFormat: 'JPG',
					image: 'R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
					text: 'dGUgZW52aW8gdW5hIGZvdG8g8J+Ymg==',
					type: 'C2CED',
				},
			],
		};

		const getMovementsResponse = { data: { data: [movement], paging: { hasMorePages: false } } };
		const getMovementResponse = { data: { data: movement } };
		const deleteMovementResponse = { status: 200 };

		const request = jest
			.fn()
			.mockResolvedValueOnce(getMovementsResponse)
			.mockResolvedValueOnce(getMovementResponse)
			.mockResolvedValueOnce(getMovementResponse)
			.mockResolvedValueOnce(deleteMovementResponse);

		store.mockModule('service', { request });

		await store.dispatch('bizum/getMovements', { status: 'completed' });
		const mov1 = await store.dispatch('bizum/getMovement', '1234');
		expect(mov1.additionalContext).toHaveLength(1);

		await store.dispatch('bizum/deleteAdditionalContent', '1234');

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/movements/1234', method: 'DELETE' } },
			})
		);
	});

	it('deleteAdditionalJustification', async () => {
		const movement = {
			id: '1234',
			hasExtraInfo: true,
			additionalContext: [
				{
					text: 'dGUgZW52aW8gdW5hIGZvdG8g8J+Ymg==',
					type: 'C2CNSD',
				},
			],
		};

		const getMovementsResponse = { data: { data: [movement], paging: { hasMorePages: false } } };
		const getMovementResponse = { data: { data: movement } };
		const deleteMovementResponse = { status: 200 };

		const request = jest
			.fn()
			.mockResolvedValueOnce(getMovementsResponse)
			.mockResolvedValueOnce(getMovementResponse)
			.mockResolvedValueOnce(getMovementResponse)
			.mockResolvedValueOnce(deleteMovementResponse);

		store.mockModule('service', { request });

		await store.dispatch('bizum/getMovements', { status: 'completed' });
		const mov1 = await store.dispatch('bizum/getMovement', '1234');
		expect(mov1.additionalContext).toHaveLength(1);

		await store.dispatch('bizum/deleteAdditionalJustification', '1234');

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/movements/1234', method: 'DELETE' } },
			})
		);
	});

	it('getQRCode', async () => {
		const request = jest.fn().mockResolvedValue({
			data: {
				data: {
					QR: '1234',
					expirationDate: '2022-02-23 16:33:03:595',
					id: '1234',
				},
			},
		});

		store.mockModule('service', { request });

		await store.dispatch('bizum/getQRCode');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/selae', method: 'POST' } },
			})
		);
	});

	it('getSelaeOperation', async () => {
		const request = jest.fn().mockResolvedValue();

		store.mockModule('service', { request });

		const payload = { id: '1234' };

		await store.dispatch('bizum/getSelaeOperation', payload);

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { url: '/bizum/selae/1234', method: 'GET' } },
			})
		);
	});

	it('getQRImage', async () => {
		await expect(store.dispatch('bizum/getQRImage', { QR: 'test' })).resolves.not.toThrow();
	});
});
