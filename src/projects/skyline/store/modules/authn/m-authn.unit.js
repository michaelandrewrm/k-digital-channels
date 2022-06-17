import flushPromises from 'flush-promises';
import { USER_INVALID_CRED, INVALID_REMEMBER_TOKEN } from '@modules/service/constants';
import authn from './m-authn';

const newInstance = createPristineVue();

describe('m-authn', () => {
	let store;
	const credentials = { username: 'user', password: '123456' };
	const userToken = { rememberToken: 'user-token', password: '123456' };
	const fixture = {
		connectedContract: null,
		contracts: [
			{
				id: 'owner-1',
				description: 'owner-desc-1',
				type: 'owner',
			},
		],
	};
	const secureSession = { uuid: 'uuid-1' };

	const start = jest.fn();
	const end = jest.fn();
	const open = jest.fn().mockResolvedValue(true);
	const closeAll = jest.fn();
	const createSession = jest.fn().mockResolvedValue(secureSession);
	const removeSession = jest.fn();
	const setSession = jest.fn();
	const request = jest.fn().mockResolvedValue({ data: { data: [] }, status: 200 });
	const deleteSession = jest.fn();
	const loadUserSession = jest.fn();
	const setUserSession = jest.fn();
	const getContracts = jest.fn().mockResolvedValue(fixture);
	const resetContract = jest.fn();
	const setContract = jest.fn().mockResolvedValue(fixture.contracts[0]);

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('authn', {
			...authn,
			state: () => ({ loggedIn: false, isEmbedded: false, isMultiple: false }),
		});
		store.registerModule('app', { state: { companyId: 'BC' } });
		store.registerModule('device', { state: { id: 'device-1' } });
		store.mockModule('modal', { open, closeAll });
		store.mockModule('notification', { closeAll });
		store.registerModule('secure', {
			namespaced: true,
			state: { ...secureSession },
			actions: { createSession, removeSession, setSession },
		});
		store.mockModule('service', { request });
		store.mockModule('session', { deleteSession, loadUserSession, setUserSession });
		store.mockModule('contracts', { get: getContracts, reset: resetContract, set: setContract });
		store.mockModule('loading', { start, end });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should login', async () => {
		expect(store.state.authn.loggedIn).toBeFalsy();
		await store.dispatch('authn/login', credentials);
		expect(store.state.authn.loggedIn).toBeTruthy();
	});

	it('should login with a token', async () => {
		expect(store.state.authn.loggedIn).toBeFalsy();
		await store.dispatch('authn/login', userToken);
		expect(store.state.authn.loggedIn).toBeTruthy();
	});

	it('should login from token', async () => {
		const url = '/webview-login';
		const method = 'POST';

		await store.dispatch('authn/loginFromToken', { session: {} });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url, method } },
				payload: { deviceId: 'device-1', tokenwebview: expect.any(Object) },
			})
		);

		expect(store.state.authn.loggedIn).toBeTruthy();
	});

	it('should logout', async () => {
		await store.dispatch('authn/login', userToken);

		expect(store.state.authn.loggedIn).toBeTruthy();

		await store.dispatch('authn/logout');

		expect(store.state.authn.loggedIn).toBeFalsy();
		expect(removeSession).toHaveBeenCalled();
		expect(loadUserSession).toHaveBeenCalled();
	});

	it('should logout after modal confirmation', async () => {
		await store.dispatch('authn/login', userToken);

		expect(store.state.authn.loggedIn).toBeTruthy();

		await store.dispatch('authn/activeLogout');

		expect(open).toHaveBeenCalled();
		expect(store.state.authn.loggedIn).toBeFalsy();
		expect(deleteSession).toHaveBeenCalled();
		expect(removeSession).toHaveBeenCalled();
	});

	it('should require a password change', async () => {
		const openAction = jest.fn().mockResolvedValue(false);
		const requestAction = jest
			.fn()
			.mockResolvedValue({ data: { requirePwdChange: true }, status: 200 });

		store.mockModule('modal', { open: openAction });
		store.mockModule('service', { request: requestAction });

		expect(store.state.authn.loggedIn).toBeFalsy();

		try {
			await store.dispatch('authn/login', credentials);
		} catch (error) {
			expect(openAction).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					component: {
						default: expect.objectContaining({ name: 'm-password-change' }),
					},
				})
			);
			expect(store.state.authn.loggedIn).toBeFalsy();
			expect(error).toBeTruthy();
			expect(error.status & error.BAD_PASSWORD).toBeTruthy();
		}
	});

	it('should authorize an agent access request', async () => {
		const data = { userId: 'user-1', username: 'user' };
		const source = { postMessage: jest.fn() };
		const origin = 'http://';

		await store.dispatch('authn/authorizeAccess', { data, source, origin });
		await flushPromises();

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: {
					request: {
						url: '/assisted-channels/impersonations',
						method: 'POST',
					},
				},
				payload: { userId: data.userId },
			})
		);
		expect(source.postMessage).toHaveBeenCalledWith(
			{ name: 'show-frame', userId: data.userId, userUUID: 'uuid-1' },
			origin
		);
	});

	it('should reject a reason', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { errorCode: 'CHANGE_USER' } });

		store.mockModule('service', { request: requestAction });

		try {
			await store.dispatch('authn/login', credentials);
		} catch (error) {
			expect(error.status).toBe(4);
		}
	});

	it('should reject a reason for invalid remember tokens', async () => {
		const requestAction = jest
			.fn()
			.mockResolvedValue({ data: { errorCode: INVALID_REMEMBER_TOKEN } });

		store.mockModule('service', { request: requestAction });

		try {
			await store.dispatch('authn/login', credentials);
		} catch (error) {
			expect(error.status).toBe(5);
		}
	});

	it('should reject a reason for invalid credentials', async () => {
		const requestAction = jest.fn().mockResolvedValue({ data: { errorCode: USER_INVALID_CRED } });

		store.mockModule('service', { request: requestAction });

		try {
			await store.dispatch('authn/login', credentials);
		} catch (error) {
			expect(error.status).toBe(3);
		}
	});

	it('should open a modal and logout when session expires', async () => {
		await store.dispatch('authn/login', credentials);

		expect(store.state.authn.loggedIn).toBeTruthy();

		await store.dispatch('authn/passiveLogout');

		expect(store.state.authn.loggedIn).toBeFalsy();
		expect(closeAll).toHaveBeenCalled();
		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-expired-session' })
		);
	});

	it('should open a modal of contracts', async () => {
		const otherContract = { id: 'user-1', description: 'user-desc-1', type: 'user' };
		fixture.contracts.push(otherContract);
		const getAction = jest.fn().mockResolvedValue(fixture);

		store.mockModule('contracts', {
			get: getAction,
			reset: resetContract,
			set: setContract,
		});

		await store.dispatch('authn/login', credentials);

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				component: { default: expect.objectContaining({ name: 'm-contracts' }) },
			})
		);
	});

	it('should emit an error message event during access request', async () => {
		const requestAction = jest.fn().mockRejectedValue();

		store.mockModule('service', { request: requestAction });

		const data = { userId: 'user-1', username: 'user' };
		const source = { postMessage: jest.fn() };
		const origin = 'http://';

		await store.dispatch('authn/authorizeAccess', { data, source, origin });
		await flushPromises();

		expect(requestAction).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'POST', url: '/assisted-channels/impersonations' } },
				payload: { userId: data.userId },
			})
		);

		expect(source.postMessage).toHaveBeenCalledWith(
			{
				name: 'error',
				userId: data.userId,
				userUUID: 'uuid-1',
				text: 'DASHBOARD.SOMETHING_WRONG',
			},
			origin
		);
	});

	it('should emit an error message event when no contracts', async () => {
		const requestAction = jest.fn().mockResolvedValue();
		const getAction = jest.fn().mockResolvedValue({ contracts: [] });

		store.mockModule('service', { request: requestAction });
		store.mockModule('contracts', { get: getAction });

		const data = { userId: 'user-1', username: 'user' };
		const source = { postMessage: jest.fn() };
		const origin = 'http://';

		await store.dispatch('authn/authorizeAccess', { data, source, origin });
		await flushPromises();

		expect(source.postMessage).toHaveBeenCalledWith(
			{
				name: 'error',
				userId: data.userId,
				userUUID: 'uuid-1',
				text: 'DASHBOARD.NO_CONTRACTS.ERROR',
			},
			origin
		);
	});

	it('should emit an error after failure on setting a contract', async () => {
		const requestAction = jest.fn().mockResolvedValue();
		const getAction = jest.fn().mockResolvedValue({ contracts: fixture.contracts });
		const setAction = jest.fn().mockResolvedValue({});

		store.mockModule('service', { request: requestAction });
		store.mockModule('contracts', { get: getAction, set: setAction });

		const data = { userId: 'user-1', username: 'user' };
		const source = { postMessage: jest.fn() };
		const origin = 'http://';

		await store.dispatch('authn/authorizeAccess', { data, source, origin });
		await flushPromises();

		expect(source.postMessage).toHaveBeenCalledWith(
			{
				name: 'error',
				text: 'DASHBOARD.SET_CONTRACTS.ERROR',
				userId: data.userId,
				userUUID: 'uuid-1',
			},
			origin
		);
	});

	it('should create an user session and associate it with an agent session', async () => {
		const data = {
			userId: 'user-1',
			username: 'user',
			agentUUID: 'uuid-2',
		};
		const source = { postMessage: jest.fn() };
		const origin = 'http://';

		await store.dispatch('authn/createUserSession', { data, source, origin });
		await flushPromises();

		expect(createSession).toHaveBeenCalled();
		expect(setUserSession).toHaveBeenCalled();
		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: {
					headers: {
						'Content-Type': 'application/json',
						'uuid': data.agentUUID,
						'childuuid': 'uuid-1',
					},
					request: { method: 'POST', url: '/associate-uuids' },
				},
			})
		);

		expect(source.postMessage).toHaveBeenCalledWith(
			{
				name: 'session-is-ready',
				userId: data.userId,
				userUUID: 'uuid-1',
			},
			origin
		);
	});

	/**
	 * Al llamar a refresh debería invocar el endpoint de keep-alive.
	 */
	it('call keep-alive endpoint on refresh', async () => {
		const requestAction = jest.fn().mockResolvedValue();

		store.mockModule('service', { request: requestAction });

		await store.dispatch('authn/refresh');

		expect(requestAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/keep-alive', method: 'GET' } },
			})
		);
	});

	/**
	 * Si el endpoint de keep-alive devuelve un error, debería
	 * hacer logout para borrar la sesión.
	 */
	it('logout if refresh trows an error', async () => {
		const requestAction = jest.fn().mockRejectedValue();

		store.mockModule('service', { request: requestAction });

		await store.dispatch('authn/refresh');

		expect(store.state.authn.loggedIn).toBeFalsy();
		expect(closeAll).toHaveBeenCalled();
		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-expired-session' })
		);
	});

	it('should request for an anonymous login', async () => {
		const payload = {
			deviceId: 'device-1',
			companyId: 'BC',
			channel: 'WEB',
		};

		await store.dispatch('authn/loginAnonymous', payload);

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'POST', url: '/login' } },
				payload,
			})
		);
	});
});
