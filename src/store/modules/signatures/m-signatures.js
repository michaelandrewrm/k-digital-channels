import SessionCache from '@modules/session/session-cache';

const SET_HAS_PENDING_OPERATIONS = 'SET_HAS_PENDING_OPERATIONS';
const cache = new SessionCache('signatures');

export default {
	namespaced: true,

	state() {
		return { numberOfPendingOperations: 0 };
	},

	mutations: {
		[SET_HAS_PENDING_OPERATIONS](state, value) {
			state.numberOfPendingOperations = value;
		},
	},

	actions: {
		fetch({ commit, dispatch }, { status, paginationKey, refresh }) {
			const cacheKey = `list/${status}`;
			const queryParams = {};
			const url = '/signature';
			const method = 'GET';

			if (refresh) {
				SessionCache.clear('signatures');
			}

			if (cache.has(cacheKey) && !paginationKey) {
				return cache.get(cacheKey);
			}

			if (status) {
				Object.assign(queryParams, { status: status.toUpperCase() });
			}

			if (paginationKey) {
				Object.assign(queryParams, { paginationKey });
			}

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams,
				},
				{ root: true }
			).then(({ data }) => {
				// If cache and new items, we add them to the end of the list
				if (cache.has(cacheKey)) {
					const result = cache.get(cacheKey);
					data?.data?.forEach((item) => {
						const found = result.data.find(({ signatureId }) => signatureId === item.signatureId);

						if (!found) {
							result.data.push(item);
						}
					});

					Object.assign(data?.data, result.data);
				}

				cache.set(cacheKey, data);

				/* istanbul ignore else */
				if (status === 'pending') {
					commit('SET_HAS_PENDING_OPERATIONS', data?.data?.length);
				}

				return data;
			});
		},

		async get({ dispatch }, { type, signatureId }) {
			let signature = cache.get(`item/${type}/${signatureId}`);

			/* istanbul ignore else */
			if (!signature) {
				const signatures = await dispatch('fetch', { status: type });
				signature = signatures.data.find(({ signatureId: itemId }) => itemId === signatureId);
			}

			/* istanbul ignore next */
			if (!signature?.signatureId) {
				return Promise.reject();
			}

			return signature;
		},

		sign({ dispatch }, { type, signatureId }) {
			const url = `/signature/${signatureId}`;
			const method = 'PUT';

			return dispatch(
				'service/request',
				{
					service: {
						request: { url, method },
					},
				},
				{ root: true }
			)
				.then(() => {
					SessionCache.clear('signatures');
					SessionCache.clear('bizum');
				})
				.then(() => dispatch('fetch', { status: type }));
		},

		delete({ dispatch }, { type, signatureId }) {
			const url = `/signature/${signatureId}`;
			const method = 'DELETE';

			return dispatch(
				'service/request',
				{
					service: {
						request: { url, method },
					},
				},
				{ root: true }
			)
				.then(() => SessionCache.clear('signatures'))
				.then(() => dispatch('fetch', { status: type }));
		},

		complete({ dispatch }, { type, signatureId }) {
			const url = `/signature/${signatureId}`;
			const method = 'PATCH';

			return dispatch(
				'service/request',
				{
					service: {
						request: { url, method },
					},
				},
				{ root: true }
			)
				.then(() => SessionCache.clear('signatures'))
				.then(() => dispatch('fetch', { status: type }));
		},
	},
};
