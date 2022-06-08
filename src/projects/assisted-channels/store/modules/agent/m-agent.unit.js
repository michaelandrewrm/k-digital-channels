import { USER_INVALID_CRED } from '@modules/service/constants';
import flushPromises from 'flush-promises';
import agent from './m-agent';

const newInstance = createPristineVue();

describe('m-agent', () => {
	let store;
	const fixture = [
		{
			id: 'user-1',
			name: 'name',
			surname1: 'surname-1',
			surname2: 'surname-2',
		},
	];

	const open = jest.fn().mockResolvedValue('BC');
	const closeAll = jest.fn();
	const createSession = jest.fn();
	const removeSession = jest.fn();
	const request = jest.fn().mockResolvedValue({ data: { data: fixture }, status: 200 });
	const deleteSession = jest.fn();
	const loadUserSession = jest.fn();
	const start = jest.fn();
	const end = jest.fn();

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('agent', { ...agent });
		store.registerModule('device', { namespaced: true, state: { id: 'WEB' } });
		store.mockModule('modal', { open, closeAll });
		store.registerModule('secure', {
			namespaced: true,
			state: { uuid: 'uuid-1' },
			actions: { createSession, removeSession },
		});
		store.mockModule('service', { request });
		store.mockModule('session', { deleteSession, loadUserSession });
		store.mockModule('loading', { start, end });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should show a modal for company selection during login', async () => {
		expect(store.state.agent.loggedIn).toBeFalsy();

		await store.dispatch('agent/login', {
			username: 'agent',
			password: '123456',
		});

		await flushPromises();

		expect(start).toHaveBeenCalled();
		expect(createSession).toHaveBeenCalled();
		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				component: { default: expect.objectContaining({ name: 'm-select-company' }) },
				props: { modal: true },
			})
		);
		expect(store.state.agent.loggedIn).toBeTruthy();
	});

	it('should logout', async () => {
		await store.dispatch('agent/login', {
			username: 'agent',
			password: '123456',
		});

		expect(store.state.agent.loggedIn).toBeTruthy();

		await store.dispatch('agent/logout');

		expect(store.state.agent.loggedIn).toBeFalsy();
		expect(closeAll).toHaveBeenCalled();
		expect(removeSession).toHaveBeenCalled();
		expect(loadUserSession).toHaveBeenCalled();
	});

	it('should logout after modal confirmation', async () => {
		await store.dispatch('agent/login', {
			username: 'agent',
			password: '123456',
		});

		expect(store.state.agent.loggedIn).toBeTruthy();

		await store.dispatch('agent/activeLogout');

		expect(open).toHaveBeenCalled();
		expect(deleteSession).toHaveBeenCalled();
		expect(store.state.agent.loggedIn).toBeFalsy();
	});

	it('should require a password change', async () => {
		const openAction = jest.fn().mockResolvedValue(false);
		store.mockModule('modal', { open: openAction });
		store.mockModule('service', {
			request: jest.fn().mockResolvedValue({ data: { requirePwdChange: true }, status: 200 }),
		});

		expect(store.state.agent.loggedIn).toBeFalsy();

		try {
			await store.dispatch('agent/login', {
				username: 'user',
				password: '123456',
			});
		} catch (error) {
			expect(openAction).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					component: {
						default: expect.objectContaining({ name: 'm-password-change' }),
					},
				})
			);
		}
	});

	it('should request users', async () => {
		await store.dispatch('agent/fetchUsers', { search: 'user' });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/assisted-channels/users', method: 'GET' } },
				queryParams: expect.any(Object),
			})
		);

		await store.dispatch('agent/fetchUsers', { search: 'user' });

		expect(request).toHaveBeenCalledTimes(1);
	});

	it('should reject a reason', async () => {
		store.mockModule('service', {
			request: jest.fn().mockRejectedValue({
				response: {
					data: { errorCode: 'CHANGE_USER' },
				},
			}),
		});

		try {
			await store.dispatch('agent/login', {
				username: 'agent',
				password: '123456',
			});
		} catch (error) {
			expect(end).toHaveBeenCalled();
			expect(error.status).toBe(4);
		}
	});

	it('should reject a reason for invalid credentials', async () => {
		store.mockModule('service', {
			request: jest.fn().mockRejectedValue({
				response: {
					data: { errorCode: USER_INVALID_CRED },
				},
			}),
		});

		try {
			await store.dispatch('agent/login', {
				username: 'agent',
				password: '123456',
			});
		} catch (error) {
			expect(end).toHaveBeenCalled();
			expect(error.status).toBe(3);
		}
	});

	it('should open a modal and logout when session expires', async () => {
		await store.dispatch('agent/login', {
			username: 'user',
			password: '123456',
		});

		expect(store.state.agent.loggedIn).toBeTruthy();

		await store.dispatch('agent/passiveLogout');

		expect(closeAll).toHaveBeenCalled();
		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-expired-session' })
		);
		expect(store.state.agent.loggedIn).toBeFalsy();
	});

	it('should request a company change', async () => {
		await store.dispatch('agent/setCompany', 'BF');

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: {
					request: {
						url: '/assisted-channels/login',
						method: 'POST',
					},
				},
				payload: { companyId: 'BF' },
			})
		);
	});

	it('should not request a company change', async () => {
		store.unregisterModule('agent');
		store.registerModule('agent', { ...agent, state: { currentCompany: 'BC' } });

		await store.dispatch('agent/setCompany', 'BC');

		expect(request).not.toHaveBeenCalled();
	});
});
