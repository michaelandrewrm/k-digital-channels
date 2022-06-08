const SET_IS_WELCOME = 'SET_IS_WELCOME';
const SET_PRODUCTS_ONTIME = 'SET_PRODUCTS_ONTIME';

export default {
	namespaced: true,

	state() {
		return { isWelcome: false, productsOntime: [] };
	},

	mutations: {
		[SET_IS_WELCOME](state, value) {
			state.isWelcome = value;
		},

		[SET_PRODUCTS_ONTIME](state, value) {
			state.productsOntime = value;
		},
	},

	actions: {
		create({ dispatch }, { productsOnTime }) {
			const url = '/ontime';
			const method = 'PATCH';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { productsOnTime },
				},
				{ root: true }
			).then(() => dispatch('get'));
		},

		get({ commit, dispatch }) {
			const url = '/ontime';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data: { data } }) => {
				commit(SET_PRODUCTS_ONTIME, data);

				return data;
			});
		},

		getMovements({ dispatch }) {
			const url = '/ontime/movements';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data: { data } }) => data);
		},

		setWelcome({ commit }) {
			commit(SET_IS_WELCOME, true);
		},
	},
};
