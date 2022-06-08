const UPDATE_STATUS = 'UPDATE_STATUS';

export default {
	namespaced: true,

	state() {
		return { status: null };
	},

	mutations: {
		[UPDATE_STATUS](state, value) {
			state.status = value;
		},
	},

	actions: {
		start({ commit }) {
			commit(UPDATE_STATUS, true);
		},

		end({ commit }) {
			commit(UPDATE_STATUS, false);
		},
	},
};
