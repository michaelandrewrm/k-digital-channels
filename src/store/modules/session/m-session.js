const SET_USER_SESSION = 'SET_USER_SESSION';
const SET_USER_GREETED = 'SET_USER_GREETED';
const REMOVE_USER_SESSION = 'REMOVE_USER_SESSION';
const SET_THEME = 'SET_THEME';
const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
const SET_REMEMBER_TOKEN = 'SET_REMEMBER_TOKEN';
const REMOVE_REMEMBER_TOKEN = 'REMOVE_REMEMBER_TOKEN';
const SKIP_NEWS = 'SKIP_NEWS';

const USER_SESSION_KEY = 'userSession';
const THEME_SESSION_KEY = 'themeSession';
const LANG_SESSION_KEY = 'langSession';
const NEWS_SESSION_KEY = 'newsSession';

export default {
	namespaced: true,

	/**
	 * @typedef {Object} state
	 * @property {String} userName User's name.
	 * @property {Date} lastLogin Last time the user was logged. Its returned from the service.
	 * @property {String} rememberToken A token to log in a user without an username. Its generated on the server.
	 * @property {Boolean} userGreeted User was greeted in global position.
	 * @property {String} theme User's visual theme preference. Can be 'light' or 'dark'.
	 * @property {String} lang User's language preference.
	 */
	state() {
		const userSession = JSON.parse(localStorage.getItem(USER_SESSION_KEY)) || {};
		const themeSession = JSON.parse(localStorage.getItem(THEME_SESSION_KEY)) || {};
		const langSession = JSON.parse(localStorage.getItem(LANG_SESSION_KEY)) || {};
		const newsSession = localStorage.getItem(NEWS_SESSION_KEY) || '';

		const { userName = '', lastLogin = null, rememberToken = '' } = userSession;
		const {
			theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
		} = themeSession;

		const { lang = 'es' } = langSession;

		const skippedNews = newsSession;

		return {
			userGreeted: false,
			userName,
			lastLogin,
			rememberToken,
			theme,
			lang,
			skippedNews,
		};
	},

	mutations: {
		/**
		 * Set the user session data.
		 * @param {state} state
		 * @param {Object} payload
		 * @param {Object} payload.data
		 */
		[SET_USER_SESSION](state, data) {
			state.userName = data.userName;
			state.lastLogin = data.lastLogin;
		},

		/**
		 * Set remember token
		 * @param {state} state
		 * @param {String} data token
		 */
		[SET_REMEMBER_TOKEN](state, data) {
			state.rememberToken = data;
		},

		/**
		 * Remove the user session data.
		 * @param {state} state
		 */
		[REMOVE_USER_SESSION](state) {
			state.userName = '';
			state.lastLogin = null;
		},

		/**
		 * Remove remember token
		 * @param {state} state
		 */
		[REMOVE_REMEMBER_TOKEN](state) {
			state.rememberToken = null;
		},

		[SET_USER_GREETED](state, value) {
			state.userGreeted = value;
		},

		[SET_THEME](state, value) {
			state.theme = value;
		},

		[CHANGE_LANGUAGE](state, value) {
			state.lang = value;
		},

		[SKIP_NEWS](state, value) {
			state.skippedNews = value;
		},
	},

	actions: {
		/**
		 * Save the user session info.
		 * @param {Object} store
		 * @param {Object} sessionData
		 */
		setUserSession({ commit }, sessionData) {
			commit(SET_USER_SESSION, sessionData);
			commit(SET_USER_GREETED, false);
		},

		/**
		 * Save and persist current session info.
		 * @param {Object} store
		 * @param {Object} sessionData
		 */
		rememberUserSession({ commit }, { userName, lastLogin, rememberToken }) {
			commit(SET_USER_SESSION, { userName, lastLogin });
			commit(SET_REMEMBER_TOKEN, rememberToken);

			localStorage.setItem(
				USER_SESSION_KEY,
				JSON.stringify({ userName, lastLogin, rememberToken })
			);
		},

		/**
		 * Close current session.
		 * @param {Object} store
		 */
		removeUserSession({ commit }) {
			commit(REMOVE_USER_SESSION);
			commit(REMOVE_REMEMBER_TOKEN);
			sessionStorage.removeItem('secure');
		},

		/**
		 * Remove persisted session info.
		 */
		forgetUserSession() {
			localStorage.removeItem(USER_SESSION_KEY);
		},

		/**
		 * Reload user persisted info.
		 */
		loadUserSession({ commit }) {
			const userSession = JSON.parse(localStorage.getItem(USER_SESSION_KEY)) || {};
			const { userName = '', lastLogin = null, rememberToken = '' } = userSession;

			commit(SET_USER_SESSION, { userName, lastLogin });
			commit(SET_REMEMBER_TOKEN, rememberToken);
		},

		markUserGreeted({ commit }) {
			commit(SET_USER_GREETED, true);
		},

		/**
		 * Change and persist visual theme.
		 *
		 * @param {Object} store
		 * @param {"light"|"dark"} theme
		 */
		setTheme({ commit }, theme) {
			commit(SET_THEME, theme);
			localStorage.setItem(THEME_SESSION_KEY, JSON.stringify({ theme }));
		},

		/**
		 * Change and persist user language.
		 *
		 * @param {Object} store
		 * @param {String} lang
		 */
		changeLanguage({ commit }, lang) {
			commit(CHANGE_LANGUAGE, lang);
			localStorage.setItem(LANG_SESSION_KEY, JSON.stringify({ lang }));
		},

		skipNews({ commit }, version) {
			commit(SKIP_NEWS, version);
			localStorage.setItem(NEWS_SESSION_KEY, version);
		},

		deleteSession({ dispatch }) {
			const method = 'DELETE';
			const url = '/session';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			);
		},

		deleteCache({ dispatch }) {
			const method = 'DELETE';
			const url = '/cache';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			);
		},
	},
};
