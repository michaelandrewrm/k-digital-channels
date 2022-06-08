import error from '@modules/service/m-error-handler';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';

import {
	UUID_EXPIRED,
	USER_WILL_BE_TEMP_BLOCKED,
	USER_WAS_TEMP_BLOCKED,
	USER_WILL_BE_PERMANENTLY_BLOCKED,
	USER_WAS_PERMANENTLY_BLOCKED,
	OTP_REQUIRED,
	REMEMBER_TOKEN_INVALID,
	REQUEST_TIMEOUT,
	USER_NOT_FOUND,
} from '@modules/service/constants';

describe('m-error-handler', () => {
	let store;
	let modules;

	beforeEach(() => {
		const localVue = createLocalVue();
		localVue.use(Vuex);

		modules = {
			modal: {
				namespaced: true,
				actions: {
					open: jest.fn(() => true),
				},
			},
			authn: {
				namespaced: true,
				state: () => ({ loggedIn: true }),
				actions: {
					passiveLogout: jest.fn(),
				},
			},
			otp: {
				namespaced: true,
				actions: {
					handle: jest.fn().mockResolvedValue(true),
				},
			},
			session: {
				namespaced: true,
				actions: {
					removeUserSession: jest.fn(),
					forgetUserSession: jest.fn(),
				},
			},
			secure: {
				namespaced: true,
				actions: {
					refreshSession: jest.fn(),
				},
			},
			service: {
				namespaced: true,
				actions: {
					request: jest.fn(),
				},
			},
			error,
		};

		store = new Vuex.Store({
			modules,
			strict: false,
		});
	});

	it('opens a timeout modal on timeout', async () => {
		expect.assertions(3);

		expect(modules.modal.actions.open).not.toHaveBeenCalled();

		const response = await store.dispatch('error/handle', {
			error: { code: REQUEST_TIMEOUT },
		});

		expect(modules.modal.actions.open).toHaveBeenCalled();
		expect(response).toEqual({
			code: REQUEST_TIMEOUT,
		});
	});

	it('closes the user session when the UUID is expired and the user is loggedIn', async () => {
		expect.assertions(2);
		expect(modules.authn.actions.passiveLogout).not.toHaveBeenCalled();

		await store.dispatch('error/handle', {
			error: { response: { data: { errorCode: UUID_EXPIRED } } },
		});

		expect(modules.authn.actions.passiveLogout).toHaveBeenCalled();
	});

	it('refreshes the user session if the UUID is expired and the user is not loggedIn', async () => {
		expect.assertions(3);

		store = new Vuex.Store({
			modules: {
				...modules,
				authn: {
					...modules.authn,
					state: () => ({ loggedIn: false }),
				},
			},
			strict: false,
		});

		expect(modules.secure.actions.refreshSession).not.toHaveBeenCalled();

		await store.dispatch('error/handle', {
			error: { response: { data: { errorCode: UUID_EXPIRED } } },
		});

		expect(modules.secure.actions.refreshSession).toHaveBeenCalled();
		expect(modules.service.actions.request).toHaveBeenCalled();
	});

	it('should return the error when the request fails during refreshing the UUID', async () => {
		expect.assertions(4);

		const rejectData = { response: { data: { errorCode: USER_NOT_FOUND } } };

		const serviceKO = {
			namespaced: true,
			actions: {
				request: jest.fn().mockRejectedValue(rejectData),
			},
		};

		store = new Vuex.Store({
			modules: {
				...modules,
				authn: {
					...modules.authn,
					state: () => ({ loggedIn: false }),
				},
				service: serviceKO,
			},
			strict: false,
		});

		expect(modules.secure.actions.refreshSession).not.toHaveBeenCalled();

		const returnedError = await store.dispatch('error/handle', {
			error: { response: { data: { errorCode: UUID_EXPIRED } } },
		});

		expect(modules.secure.actions.refreshSession).toHaveBeenCalled();
		expect(serviceKO.actions.request).toHaveBeenCalled();

		await flushPromises();

		expect(returnedError).toBe(rejectData);
	});

	it('shows a modal when user will be temp blocked', async () => {
		expect.assertions(2);
		expect(modules.modal.actions.open).not.toHaveBeenCalled();

		await store.dispatch('error/handle', {
			error: { response: { data: { errorCode: USER_WILL_BE_TEMP_BLOCKED } } },
		});

		expect(modules.modal.actions.open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ default: expect.objectContaining({ name: 'm-sign-temp-error' }) })
		);
	});

	it('shows a modal when user is temp blocked', async () => {
		expect.assertions(2);
		expect(modules.modal.actions.open).not.toHaveBeenCalled();

		await store.dispatch('error/handle', {
			error: {
				response: {
					data: {
						additionalInfo: { unlockingTime: 120000 },
						errorCode: USER_WAS_TEMP_BLOCKED,
					},
				},
			},
		});

		expect(modules.modal.actions.open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				component: expect.objectContaining({
					default: expect.objectContaining({ name: 'm-sign-temp-blocked' }),
				}),
				props: { minutes: 2 },
			})
		);
	});

	it('shows a modal when user will be permanently blocked', async () => {
		expect.assertions(2);
		expect(modules.modal.actions.open).not.toHaveBeenCalled();

		await store.dispatch('error/handle', {
			error: { response: { data: { errorCode: USER_WILL_BE_PERMANENTLY_BLOCKED } } },
		});

		expect(modules.modal.actions.open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ default: expect.objectContaining({ name: 'm-sign-error' }) })
		);
	});

	it('shows a modal when user is permanently blocked', async () => {
		expect.assertions(2);
		expect(modules.modal.actions.open).not.toHaveBeenCalled();

		await store.dispatch('error/handle', {
			error: { response: { data: { errorCode: USER_WAS_PERMANENTLY_BLOCKED } } },
		});

		expect(modules.modal.actions.open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ default: expect.objectContaining({ name: 'm-sign-blocked' }) })
		);
	});

	it('shows a modal when user needs an OTP', async () => {
		expect.assertions(3);
		expect(modules.otp.actions.handle).not.toHaveBeenCalled();

		const returnedError = await store.dispatch('error/handle', {
			error: {
				config: { url: '/login' },
				response: {
					data: {
						additionalInfo: { processId: 120000 },
						errorCode: OTP_REQUIRED,
					},
				},
			},
		});

		expect(modules.otp.actions.handle).toHaveBeenCalled();
		expect(returnedError).toBeTruthy();
	});

	it('removes the current user session when user tries to log in with an invalid remember token', async () => {
		expect.assertions(2);

		expect(modules.session.actions.removeUserSession).not.toHaveBeenCalled();

		await store.dispatch('error/handle', {
			error: { response: { data: { errorCode: REMEMBER_TOKEN_INVALID } } },
		});

		expect(modules.session.actions.removeUserSession).toHaveBeenCalled();
	});
});
