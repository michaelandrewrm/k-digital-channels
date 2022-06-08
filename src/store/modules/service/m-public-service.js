import axios from 'axios';

export default {
	namespaced: true,

	state() {
		return {
			req: axios.create(),
			timeout: 20000,
		};
	},

	actions: {
		request(store, request) {
			const { state } = store;
			const defaultHeaders = { 'Content-Type': 'application/json' };
			const headers = request.headers ? request.headers : defaultHeaders;
			const { timeout } = state;

			return state.req.request({
				headers,
				timeout,
				...request,
			});
		},
	},
};
