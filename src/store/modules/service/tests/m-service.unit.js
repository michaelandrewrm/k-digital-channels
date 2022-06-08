import axios from 'axios';
import service from '@modules/service/m-service';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';

const storeMocked = {
	secure: {
		namespaced: true,
		actions: {
			encrypt: jest.fn((store, a) => a),
			decrypt: jest.fn((store, a) => a),
		},
	},
};

service.modules.error = {
	namespaced: true,
	actions: {
		handle: jest.fn((store, req) => req),
	},
};

describe('m-service', () => {
	let store;

	beforeEach(() => {
		const localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store({
			modules: {
				...storeMocked,
				service,
			},
			strict: false,
		});
	});

	it('returns the real data from url', async () => {
		expect.assertions(1);

		axios.request.mockImplementationOnce(() =>
			Promise.resolve({
				data: {
					success: true,
				},
			})
		);

		const response = await store.dispatch('service/request', {
			service: { request: { url: '/current/user/password' } },
			payload: { password: '1234' },
		});

		expect(response.data.success).toBeTruthy();
	});

	it('returns the error response on error', async () => {
		expect.assertions(1);

		const error = {
			...new Error(''),
			response: {
				status: 401,
			},
			config: {
				validateStatus: jest.fn(false),
			},
		};

		axios.request.mockImplementationOnce(() => Promise.reject(error));

		const req = store.dispatch('service/request', {
			service: { request: { url: '/mock' } },
		});

		await expect(req).rejects.toEqual({
			error,
			requestConfig: {
				params: undefined,
				payload: undefined,
				queryParams: undefined,
				service: {
					request: {
						url: '/mock',
					},
				},
			},
		});
	});

	it('uses custom headers', async () => {
		const headerCB = jest.fn().mockReturnValue({ 'Content-Type': 'application/json' });
		const axiosMock = axios.request.mockImplementationOnce(() =>
			Promise.resolve({ data: 'fawoizxcmvoiaeoij=' })
		);

		const response = await store.dispatch('service/request', {
			service: {
				request: { url: '/current/user/password' },
				headers: headerCB,
			},
		});

		expect(axiosMock).toHaveBeenCalledWith(
			expect.objectContaining({
				url: '/current/user/password',
				headers: { 'Content-Type': 'application/json' },
			})
		);

		expect(response.data).toBe('fawoizxcmvoiaeoij=');
	});

	it('should not send undefined body requests', async () => {
		jest.clearAllMocks();
		axios.request.mockImplementationOnce(() => Promise.resolve({ data: {} }));

		await store.dispatch('service/request', {
			service: {
				request: { url: '/contracts/contract-1', method: 'PATCH' },
			},
		});

		expect(axios.request).toHaveBeenCalledWith(
			expect.objectContaining({
				data: null,
				method: 'PATCH',
				url: '/contracts/contract-1',
			})
		);
	});
});
