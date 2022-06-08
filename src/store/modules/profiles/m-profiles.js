const SET_DEFAULT_PROFILE = 'SET_DEFAULT_PROFILE';
const ADD_PROFILES = 'ADD_PROFILES';
const SET_IS_WELCOME = 'SET_IS_WELCOME';
const SET_LAST_REQUEST_TIMESTAMP = 'SET_LAST_REQUEST_STAMP';

/* istanbul ignore next */
function sortByName(items = []) {
	return items.sort((a, b) => {
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();

		if (nameA < nameB) {
			return -1;
		}

		if (nameA > nameB) {
			return 1;
		}

		return 0;
	});
}

export default {
	namespaced: true,

	state() {
		return {
			defaultProfile: null,
			profiles: [],
			isWelcome: false,
			lastRequestTimestamp: null,
		};
	},

	mutations: {
		[SET_DEFAULT_PROFILE](state, value) {
			state.defaultProfile = value;
		},

		[ADD_PROFILES](state, value) {
			state.profiles = value;
		},

		[SET_IS_WELCOME](state, value) {
			state.isWelcome = value;
		},

		[SET_LAST_REQUEST_TIMESTAMP](state, value) {
			state.lastRequestTimestamp = value;
		},
	},

	actions: {
		get({ commit, dispatch }) {
			const url = '/profiles';
			const method = 'GET';

			commit(SET_DEFAULT_PROFILE, null);

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			)
				.then(({ data }) => {
					const profiles = sortByName(data?.profiles);
					const defaultProfile = profiles?.find(({ isDefault }) => Boolean(isDefault));

					commit(ADD_PROFILES, profiles);
					commit(SET_DEFAULT_PROFILE, defaultProfile);

					return { profiles, defaultProfile };
				})
				.catch(() => {});
		},

		async getProfile({ dispatch, state }, id) {
			let { profiles } = state;
			const findById = ({ id: profileId }) => profileId === id;

			if (profiles?.length) {
				return profiles?.find(findById);
			}

			profiles = await dispatch('get');

			return profiles.profiles.find(findById);
		},

		create({ dispatch }, { name, isDefault, productIds }) {
			const url = '/profiles';
			const method = 'POST';
			const payload = { name, isDefault, productIds };

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload,
				},
				{ root: true }
			).then(() => dispatch('get'));
		},

		update({ dispatch }, { id, name, isDefault, productIds }) {
			const url = `/profiles/${id}`;
			const method = 'PUT';
			const payload = { name, isDefault, productIds };

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload,
				},
				{ root: true }
			).then(() => dispatch('get'));
		},

		modify({ dispatch }, { id, name, isDefault, productIds }) {
			const url = `/profiles/${id}`;
			const method = 'PATCH';
			const payload = { name, isDefault, ...productIds };

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload,
				},
				{ root: true }
			).then(() => dispatch('get'));
		},

		delete({ dispatch }, id) {
			const url = `/profiles/${id}`;
			const method = 'DELETE';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(() => dispatch('get'));
		},

		setDefaultProfile({ commit }, profileId) {
			commit(SET_DEFAULT_PROFILE, profileId);
		},

		setWelcome({ commit }) {
			commit(SET_IS_WELCOME, true);
		},

		setLastRequestTimestamp({ commit }) {
			commit(SET_LAST_REQUEST_TIMESTAMP, +new Date());
		},
	},
};
