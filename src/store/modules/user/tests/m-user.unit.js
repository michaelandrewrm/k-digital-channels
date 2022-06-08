import user from '@modules/user/m-user';

const newInstance = createPristineVue();

describe('m-user', () => {
	let store;

	const request = jest.fn().mockResolvedValue({ data: { data: [] }, status: 200 });

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('secure', { namespaced: true, state: { uuid: 'uuid-1' } });
		store.mockModule('user', user.actions);
		store.mockModule('service', { request });
		store.registerModule('app', { namespaced: true, state: { companyId: 'BC' } });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('calls the service to change password', async () => {
		await store.dispatch('user/changePassword', 123456);

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'PUT', url: '/current/user/password' } },
				payload: { password: 123456 },
			})
		);
	});

	it('should get the user detail', async () => {
		await store.dispatch('user/getPersonalDetails');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/current/user/' } },
			})
		);
	});

	it('should call ssoLogin', async () => {
		await store.dispatch('user/ssoLogin');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/current/user/sso-login' } },
			})
		);
	});

	it('should call ssoBolsaCaminos', async () => {
		await store.dispatch('user/ssoBolsaCaminos');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/current/user/bolsa-caminos-session' } },
			})
		);
	});

	it('should request an user unlock', async () => {
		const data = { userId: 'user-1', action: 'unlock' };
		const source = { postMessage: jest.fn() };
		const origin = 'http://';

		await store.dispatch('user/requestOption', { data, source, origin });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: {
					request: {
						url: '/assisted-channels/users/user-1/unlock',
						method: 'PATCH',
					},
				},
			})
		);

		expect(source.postMessage).toHaveBeenCalledWith(
			{
				name: 'open-notification',
				text: 'INFO.UNLOCK_USER.SUCCESS',
				userUUID: 'uuid-1',
				userId: data.userId,
			},
			origin
		);
	});

	it('should request an user reset password', async () => {
		const data = { userId: 'user-1', action: 'resetPassword' };
		const source = { postMessage: jest.fn() };
		const origin = 'http://';

		await store.dispatch('user/requestOption', { data, source, origin });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: {
					request: {
						url: '/assisted-channels/users/resetPassword',
						method: 'PATCH',
					},
				},
			})
		);

		expect(source.postMessage).toHaveBeenCalledWith(
			{
				name: 'open-notification',
				text: 'INFO.RESET_PASSWORD.SUCCESS',
				userUUID: 'uuid-1',
				userId: data.userId,
			},
			origin
		);
	});

	it('should request an user generate otp', async () => {
		const data = { userId: 'user-1', action: 'generateOtp' };
		const source = { postMessage: jest.fn() };
		const origin = 'http://';

		await store.dispatch('user/requestOption', { data, source, origin });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: {
					request: {
						url: '/assisted-channels/users/generateOtp',
						method: 'POST',
					},
				},
			})
		);

		expect(source.postMessage).toHaveBeenCalledWith(
			{
				name: 'open-notification',
				text: 'INFO.GENERATE_OTP.SUCCESS',
				userUUID: 'uuid-1',
				userId: data.userId,
			},
			origin
		);
	});

	it('should get the user notification mode', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { smsByEmail: true } });

		store.mockModule('service', { request: requestAction });

		const data = { userId: 'user-1' };
		const source = { postMessage: jest.fn() };
		const origin = 'http://';

		await store.dispatch('user/getNotificationMode', { data, source, origin });

		expect(requestAction).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/notifications/user-1' } },
			})
		);

		expect(source.postMessage).toHaveBeenCalledWith(
			{
				name: 'update-session',
				payload: { isNotificationByEmail: true },
				userUUID: 'uuid-1',
				userId: data.userId,
			},
			origin
		);
	});

	it('should change the user notification mode', async () => {
		const data = { userId: 'user-1', smsByEmail: true };
		const source = { postMessage: jest.fn() };
		const origin = 'http://';

		await store.dispatch('user/changeNotificationMode', { data, source, origin });

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'PATCH', url: '/notifications/user-1' } },
				payload: { smsByEmail: true },
			})
		);

		expect(source.postMessage).toHaveBeenCalledWith(
			{
				name: 'update-session',
				payload: { isNotificationByEmail: true },
				userUUID: 'uuid-1',
				userId: data.userId,
			},
			origin
		);
	});

	it('should emit an error message event during option request', async () => {
		const requestAction = jest.fn().mockRejectedValue();

		store.mockModule('service', { request: requestAction });

		const data = { userId: 'user-1', action: 'unlock' };
		const source = { postMessage: jest.fn() };
		const origin = 'http://';

		await store.dispatch('user/requestOption', { data, source, origin });

		expect(source.postMessage).toHaveBeenCalledWith(
			{
				name: 'open-notification',
				text: 'INFO.UNLOCK_USER.ERROR',
				userUUID: 'uuid-1',
				userId: data.userId,
			},
			origin
		);
	});

	it('should show an unlock error', async () => {
		const requestAction = jest.fn().mockRejectedValue({
			response: { data: { errorCode: 'C4000000', details: [{ relatedFields: ['phone'] }] } },
		});

		store.mockModule('service', { request: requestAction });

		const data = { userId: 'user-1', action: 'unlock' };
		const source = { postMessage: jest.fn() };
		const origin = 'http://';

		await store.dispatch('user/requestOption', { data, source, origin });

		expect(source.postMessage).toHaveBeenCalledWith(
			{
				name: 'open-notification',
				text: 'INFO.UNLOCK_USER.PHONE_ERROR',
				userUUID: 'uuid-1',
				userId: data.userId,
			},
			origin
		);
	});

	it('should request a user password recovery', async () => {
		const payload = {
			documentId: '9999999M',
			pan: '1234567890123456',
			pin: '1234',
			channel: 'WEB',
			companyId: 'BC',
		};
		await store.dispatch('user/recoverPassword', payload);

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'POST', url: '/users/password' } },
				payload: {
					document_id: '9999999M',
					pan: '1234567890123456',
					pin: '1234',
					channel: 'WEB',
					company_id: 'BC',
				},
			})
		);
	});
});
