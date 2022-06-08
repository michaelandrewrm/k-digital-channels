export default {
	namespaced: true,

	actions: {
		get({ dispatch }, { paginationKey, requestId } = {}) {
			const queryParams = {};
			let url = '/customer-support/request';
			const method = 'GET';

			if (requestId) {
				url = `${url}/${requestId}`;
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
			).then(({ data }) => data);
		},

		request({ dispatch }, { payload }) {
			const url = '/customer-support/request';
			const method = 'POST';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload,
				},
				{ root: true }
			);
		},

		setRequestStatus({ dispatch }, { requestId, status }) {
			const url = `/customer-support/request/${requestId}`;
			const method = 'PATCH';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { status },
				},
				{ root: true }
			).then(({ data }) => data);
		},

		getTypologies({ dispatch }) {
			const url = '/customer-support/typology';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method: 'GET' } },
				},
				{ root: true }
			).then(({ data }) => data);
		},
	},
};
