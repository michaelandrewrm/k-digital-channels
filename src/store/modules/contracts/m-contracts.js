const SET_CONNECTED_CONTRACT = 'SET_CONNECTED_CONTRACT';

export default {
	namespaced: true,

	state() {
		return {
			connectedContract: null,
		};
	},

	mutations: {
		[SET_CONNECTED_CONTRACT](state, value) {
			state.connectedContract = value;
		},
	},

	actions: {
		reset({ commit }) {
			commit(SET_CONNECTED_CONTRACT, null);
		},

		get({ dispatch }) {
			return dispatch(
				'service/request',
				{
					service: {
						request: { url: '/contracts', method: 'GET' },
					},
				},
				{ root: true }
			)
				.then(({ data }) => data)
				.catch(/* istanbul ignore next */ (err) => err);
		},

		set({ commit, dispatch, state, rootState }, contract) {
			const { connectedContract } = state;

			if (connectedContract?.id === contract?.id) {
				return;
			}

			const { id } = contract;
			const url = `/contracts/${id}`;
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
				.then(({ data }) => {
					dispatch('profiles/get', null, { root: true });

					commit(SET_CONNECTED_CONTRACT, data);

					return data;
				})
				.catch(async (error) => {
					/* istanbul ignore next */
					if (rootState.authn.isEmbedded) {
						return Promise.reject(error);
					}

					const component = await import(
						/* webpackChunkName: "chunk-m-errors" */ '@modals/m-something-wrong'
					);

					return dispatch('modal/open', { component, props: { modal: true } }, { root: true });
				});
		},
	},
};
