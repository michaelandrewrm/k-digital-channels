import axios from 'axios';
import service from '@modules/service/m-public-service';
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

describe('m-public-service', () => {
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
});
