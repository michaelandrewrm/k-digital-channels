import serviceLogin from '@services/s-assisted-login';
import serviceUsers from '@services/s-assisted-users';
import modalLogout from '@modals/m-logout';
import modalExpired from '@modals/m-expired-session';
import {
	USER_INVALID_CRED,
	USER_NOT_FOUND,
	USER_WILL_BE_TEMP_BLOCKED,
	USER_WAS_TEMP_BLOCKED,
	USER_WILL_BE_PERMANENTLY_BLOCKED,
} from '@modules/service/constants';

const SET_LOGGED_IN = 'SET_LOGGED_IN';
const SET_CURRENT_COMPANY = 'SET_CURRENT_COMPANY';

const cache = new Map();
const hashCode = (str) =>
	str.split('').reduce((red, value) => ((red << 5) - red + value.charCodeAt(0)) | 0, 0);

export default {
	namespaced: true,

	state() {
		return {
			loggedIn: false,
			currentCompany: '',
		};
	},

	mutations: {
		[SET_LOGGED_IN](state, value) {
			state.loggedIn = value;
		},
		[SET_CURRENT_COMPANY](state, value) {
			state.currentCompany = value;
		},
	},

	actions: {
		/**
		 * LogIn an user with the username and password.
		 *
		 * @param store
		 * @param {Object} payload
		 * @param {String} payload.rememberToken Token
		 * @param {String} payload.username Username
		 * @param {String} payload.password Password
		 */
		async login({ commit, dispatch, rootState }, { username, password }) {
			dispatch('loading/start', null, { root: true });
			await dispatch('secure/createSession', null, { root: true });

			const selectCompanyModal = await import(
				/* webpackChunkName: "chunk-m-select-company" */ '@modals/m-select-company'
			);
			const companyId = await dispatch(
				'modal/open',
				{ component: selectCompanyModal, props: { modal: true } },
				{ root: true }
			);

			return new Promise((resolve, reject) => {
				const credentials = {
					userId: username,
					password,
					deviceId: rootState.device.id,
					companyId,
				};
				const reasons = {
					BAD_CREDENTIALS: 1 << 0,
					BAD_PASSWORD: 1 << 1,
					BAD_USER: 1 << 2,
				};

				dispatch(
					'service/request',
					{
						service: serviceLogin,
						payload: credentials,
					},
					{ root: true }
				)
					.then(async ({ data }) => {
						if (data.requirePwdChange) {
							const passwordChangeModal = await import(
								/* webpackChunkName: "chunk-m-password-change" */ '@modals/m-password-change'
							);
							const pwdChangeResponse = await dispatch(
								'modal/open',
								{ component: passwordChangeModal },
								{ root: true }
							);

							/* istanbul ignore else */
							if (pwdChangeResponse !== true) {
								throw pwdChangeResponse;
							}
						}

						commit(SET_CURRENT_COMPANY, companyId);
						commit(SET_LOGGED_IN, true);
						resolve(data);
					})
					.catch((error) => {
						dispatch('loading/end', null, { root: true });

						const reason = { ...reasons };
						const { data = {} } = error?.response ?? {};

						if (data.errorCode === 'CHANGE_USER') {
							reason.status = reasons.BAD_USER;
						} else {
							reason.status = reasons.BAD_PASSWORD;
						}

						if (
							data.errorCode === USER_INVALID_CRED ||
							data.errorCode === USER_NOT_FOUND ||
							data.errorCode === USER_WILL_BE_TEMP_BLOCKED ||
							data.errorCode === USER_WAS_TEMP_BLOCKED ||
							data.errorCode === USER_WILL_BE_PERMANENTLY_BLOCKED
						) {
							reason.status |= reasons.BAD_CREDENTIALS;
						}

						commit(SET_LOGGED_IN, false);
						reject(reason);
					});
			});
		},

		/**
		 * Close user session.
		 *
		 * @param {store} store
		 */
		async logout({ rootState, commit, dispatch }) {
			await dispatch('modal/closeAll', null, { root: true });
			await dispatch('secure/removeSession', null, { root: true });
			commit(SET_LOGGED_IN, false);

			/* istanbul ignore else */
			if (!rootState.session.rememberToken) {
				await dispatch('session/loadUserSession', null, { root: true });
			}

			cache.clear();
		},

		/**
		 * Ask for confirmation to proceed a logout action.
		 * Remove remembered user.
		 *
		 * @param {store} store
		 */
		async activeLogout({ dispatch }) {
			const { credentials } = window.navigator;

			const userConfirmation = await dispatch('modal/open', modalLogout, { root: true });

			/* istanbul ignore else */
			if (userConfirmation) {
				await dispatch('session/deleteSession', null, { root: true });

				/* istanbul ignore next */
				if (credentials && credentials.preventSilentAccess) {
					credentials.preventSilentAccess();
				}

				await dispatch('logout');
			}

			return userConfirmation;
		},

		/**
		 * Close user session and inform the user.
		 *
		 * @param {store} store
		 */
		async passiveLogout({ dispatch }) {
			await dispatch('logout');
			await dispatch('modal/open', modalExpired, { root: true });
		},

		fetchUsers({ dispatch }, { search, filter = 'documentNumber', pageNumber = 0, companyId }) {
			const queryParams = {
				documentNumber: '',
				name: '',
				surname1: '',
				surname2: '',
				companyId,
				pageNumber,
			};

			const lowerCaseSearch = search.toLowerCase();
			queryParams[filter] = lowerCaseSearch;

			const key = hashCode(lowerCaseSearch.concat(companyId, filter, pageNumber));
			const cacheKey = `search/${key}`;

			if (cache.has(cacheKey)) {
				return cache.get(cacheKey);
			}

			return dispatch(
				'service/request',
				{
					service: serviceUsers,
					queryParams,
				},
				{ root: true }
			).then(({ data }) => {
				cache.set(cacheKey, data);
				return data;
			});
		},

		setCompany({ commit, dispatch, state }, companyId) {
			if (companyId === state.currentCompany) {
				return;
			}

			return dispatch(
				'service/request',
				{ service: serviceLogin, payload: { companyId } },
				{ root: true }
			).then(() => {
				commit(SET_CURRENT_COMPANY, companyId);
			});
		},
	},
};
