import SessionCache from '@modules/session/session-cache';

const cache = new SessionCache('cashflow');
const cacheKey = 'data';

export default {
	namespaced: true,

	actions: {
		fetch({ dispatch }) {
			const method = 'GET';
			const url = '/cashflow';

			if (cache.has(cacheKey)) {
				return cache.get(cacheKey);
			}

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data: { data } }) => {
				cache.set(cacheKey, data);
				return data;
			});
		},
	},
};
