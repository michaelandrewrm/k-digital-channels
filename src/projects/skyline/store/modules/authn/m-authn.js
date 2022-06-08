import serviceLogin from '@services/s-login';
import modalLogout from '@modals/m-logout';
import modalExpired from '@modals/m-expired-session';
import {
	USER_INVALID_CRED,
	USER_NOT_FOUND,
	USER_WILL_BE_TEMP_BLOCKED,
	USER_WAS_TEMP_BLOCKED,
	USER_WILL_BE_PERMANENTLY_BLOCKED,
	REMEMBER_TOKEN_INVALID,
} from '@modules/service/constants';

const iconURL = require('@project/public/icons/pwaIcon.png');

const SET_LOGGED_IN = 'SET_LOGGED_IN';
const SET_IS_EMBEDDED = 'SET_IS_EMBEDDED';
const SET_IS_MULTIPLE = 'SET_IS_MULTIPLE';

export default {
	namespaced: true,

	state() {
		return {
			loggedIn: false,
			isEmbedded: false,
			isMultiple: false,
		};
	},

	mutations: {
		[SET_LOGGED_IN](state, value) {
			state.loggedIn = value;
		},

		/* istanbul ignore next */
		[SET_IS_EMBEDDED](state, value) {
			state.isEmbedded = value;
		},

		[SET_IS_MULTIPLE](state, value) {
			state.isMultiple = value;
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
		async login({ commit, dispatch, rootState }, { rememberToken, username, password }) {
			await dispatch('secure/createSession', null, { root: true });
			dispatch('contracts/reset', null, { root: true });
			dispatch('loading/start', null, { root: true });

			return new Promise((resolve, reject) => {
				const { companyId } = rootState.app;
				let loginMethod;
				let loginValue;

				if (rememberToken && !username) {
					loginMethod = 'rememberToken';
					loginValue = rememberToken;
				} else {
					loginMethod = 'documentId';
					loginValue = username;
				}

				const credentials = {
					[loginMethod]: loginValue,
					password,
					companyId,
					channel: 'WEB',
					deviceId: rootState.device.id,
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
							const MPasswordChange = await import(
								/* webpackChunkName: "chunk-m-password-change" */ '@modals/m-password-change'
							);
							const pwdChangeResponse = await dispatch(
								'modal/open',
								{ component: MPasswordChange },
								{ root: true }
							);

							/* istanbul ignore else */
							if (pwdChangeResponse !== true) {
								throw pwdChangeResponse;
							}
						}

						await dispatch('getContracts', { data: { username: data?.username } });

						resolve({ ...data, [loginMethod]: loginValue });
					})
					.catch((error) => {
						dispatch('loading/end', null, { root: true });

						const reason = { ...reasons };
						const { data = {} } = error?.response ?? {};

						reason.status = reasons.BAD_PASSWORD;

						if (data.errorCode === 'CHANGE_USER') {
							reason.status = reasons.BAD_USER;
						}

						if (data.errorCode === REMEMBER_TOKEN_INVALID) {
							reason.status = reasons.BAD_USER | reasons.BAD_CREDENTIALS;
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

		loginFromToken({ commit, dispatch, rootState }, { session }) {
			const method = 'POST';
			const url = '/webview-login';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: {
						deviceId: rootState.device.id,
						tokenwebview: session,
					},
				},
				{ root: true }
			)
				.then(() => {
					commit(SET_LOGGED_IN, true);
				})
				.catch(
					/* istanbul ignore next */ (error) => {
						commit(SET_LOGGED_IN, false);
						return Promise.reject(error);
					}
				);
		},

		loginAnonymous({ dispatch, rootState }) {
			return dispatch(
				'service/request',
				{
					service: serviceLogin,
					payload: {
						companyId: rootState.app.companyId,
						deviceId: rootState.device.id,
						channel: 'WEB',
					},
				},
				{ root: true }
			);
		},

		async logout({ state, rootState, commit, dispatch }) {
			/* istanbul ignore else */
			if (window.parent) {
				const userUUID = rootState.secure.uuid;
				window.parent.postMessage({ name: 'hide-frame', userUUID }, '*');
			}

			/* Event for native apps when the session has expired */
			window.postMessage({ name: 'logout' }, '*');

			await dispatch('modal/closeAll', null, { root: true });
			await dispatch('notification/closeAll', null, { root: true });
			await dispatch('secure/removeSession', null, { root: true });
			commit(SET_LOGGED_IN, false);

			/* istanbul ignore else */
			if (!rootState.session.rememberToken && !state.isEmbedded) {
				await dispatch('session/loadUserSession', null, { root: true });
			}
		},

		async activeLogout({ state, dispatch }) {
			const { isEmbedded } = state;
			const { credentials } = window.navigator;

			const userConfirmation = await dispatch('modal/open', modalLogout, { root: true });

			/* istanbul ignore else */
			if (userConfirmation) {
				/* istanbul ignore else */
				if (!isEmbedded) {
					await dispatch('session/deleteSession', null, { root: true });
				}

				/* istanbul ignore next */
				if (
					credentials &&
					credentials.preventSilentAccess &&
					window.PasswordCredential &&
					!isEmbedded
				) {
					credentials.preventSilentAccess();
				}

				await dispatch('logout');
			}
		},

		async passiveLogout({ dispatch }) {
			await dispatch('logout');
			await dispatch('modal/open', modalExpired, { root: true });
		},

		/* istanbul ignore next */
		storeCredentials({ rootState }, { username, password }) {
			if (rootState.device.isPWA && window.PasswordCredential) {
				const credential = new window.PasswordCredential({
					id: username,
					name: username,
					password,
					iconURL: new URL(iconURL, window.location.href),
				});
				navigator.credentials.store(credential);
			}
		},

		async getContracts({ commit, dispatch, rootState }, { data, source, origin }) {
			dispatch('loading/start', null, { root: true });

			const response = await dispatch('contracts/get', null, { root: true });
			const username = rootState.session?.userName || data?.username;
			const userUUID = rootState.secure.uuid;
			const { contracts = [] } = response;
			const isMultiple = contracts.length > 1;
			let [contract] = contracts;
			const { userId } = data;
			const errorData = { name: 'error', userUUID, userId };

			if (!contract) {
				source.postMessage({ ...errorData, text: 'DASHBOARD.NO_CONTRACTS.ERROR' }, origin);
				return Promise.reject(response);
			}

			if (contract && source && origin) {
				source.postMessage({ name: 'show-frame', userUUID, userId }, origin);
			}

			/* istanbul ignore else */
			if (isMultiple) {
				const MContracts = await import(
					/* webpackChunkName: "chunk-m-contracts" */ '@modals/m-contracts'
				);

				contract = await dispatch(
					'modal/open',
					{
						component: MContracts,
						props: { contracts: response, username, modal: true },
					},
					{ root: true }
				);
			}

			const connectedContract = await dispatch('contracts/set', contract, { root: true });

			/* istanbul ignore else */
			if (!connectedContract?.id) {
				source.postMessage({ ...errorData, text: 'DASHBOARD.SET_CONTRACTS.ERROR' }, origin);
				return Promise.reject(connectedContract);
			}

			commit(SET_IS_MULTIPLE, isMultiple);
			commit(SET_LOGGED_IN, true);
		},

		/* istanbul ignore next */
		setIsEmbedded({ commit }) {
			commit(SET_IS_EMBEDDED, true);
		},

		/**
		 * Allow access to an agent.
		 */
		authorizeAccess({ dispatch, rootState }, { data, source, origin }) {
			const url = '/assisted-channels/impersonations';
			const method = 'POST';
			const { userId } = data;
			const userUUID = rootState.secure.uuid;

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { userId },
				},
				{ root: true }
			)
				.then(() => dispatch('getContracts', { data, source, origin }))
				.catch(() =>
					source.postMessage(
						{
							name: 'error',
							userUUID,
							userId,
							text: 'DASHBOARD.SOMETHING_WRONG',
						},
						origin
					)
				);
		},

		/**
		 * Create an user session uuid and
		 * associate it with the agent uuid session
		 */
		async createUserSession({ dispatch, rootState }, { data, source, origin }) {
			await dispatch('secure/createSession', null, { root: true });
			await dispatch('session/setUserSession', { userName: data?.username }, { root: true });

			const url = '/associate-uuids';
			const method = 'POST';
			const { agentUUID, userId } = data;
			const userUUID = rootState.secure.uuid;

			return dispatch(
				'service/request',
				{
					service: {
						headers: {
							'Content-Type': 'application/json',
							'uuid': agentUUID,
							'childuuid': userUUID,
						},
						request: { url, method },
					},
				},
				{ root: true }
			)
				.then(() => source.postMessage({ name: 'session-is-ready', userUUID, userId }, origin))
				.catch(() =>
					source.postMessage(
						{
							name: 'error',
							userUUID,
							userId,
							text: 'DASHBOARD.SOMETHING_WRONG',
						},
						origin
					)
				);
		},

		refresh({ dispatch }) {
			const url = '/keep-alive';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).catch(() => dispatch('passiveLogout'));
		},
	},
};
