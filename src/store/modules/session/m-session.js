const SET_USER_SESSION = 'SET_USER_SESSION';
const SET_USER_GREETED = 'SET_USER_GREETED';
const REMOVE_USER_SESSION = 'REMOVE_USER_SESSION';
const SET_THEME = 'SET_THEME';
const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
const SET_REMEMBER_TOKEN = 'SET_REMEMBER_TOKEN';
const REMOVE_REMEMBER_TOKEN = 'REMOVE_REMEMBER_TOKEN';
const SET_NEWS_ID = 'SET_NEWS_ID';

const STORAGE_USER_SESSION = 'userSession';
const STORAGE_THEME = 'themeSession';
const STORAGE_LANG = 'langSession';
const STORAGE_NEWS_ID = 'newsSession';

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
		const userSession = JSON.parse(localStorage.getItem(STORAGE_USER_SESSION)) || {};
		const themeSession = JSON.parse(localStorage.getItem(STORAGE_THEME)) || {};
		const langSession = JSON.parse(localStorage.getItem(STORAGE_LANG)) || {};
		const newsSession = localStorage.getItem(STORAGE_NEWS_ID) || '';

		const { userName = '', lastLogin = null, rememberToken = '' } = userSession;
		const {
			theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
		} = themeSession;

		const { lang = 'es' } = langSession;

		const newsId = newsSession;

		return {
			userGreeted: false,
			userName,
			lastLogin,
			rememberToken,
			theme,
			lang,
			newsId,
		};
	},

	mutations: {
		[SET_USER_SESSION](state, data) {
			state.userName = data.userName;
			state.lastLogin = data.lastLogin;
		},

		[SET_REMEMBER_TOKEN](state, data) {
			state.rememberToken = data;
		},

		[REMOVE_USER_SESSION](state) {
			state.userName = '';
			state.lastLogin = null;
		},

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

		[SET_NEWS_ID](state, value) {
			state.newsId = value;
		},
	},

	actions: {
		setUserSession({ commit }, sessionData) {
			commit(SET_USER_SESSION, sessionData);
			commit(SET_USER_GREETED, false);
		},

		rememberUserSession({ commit }, { userName, lastLogin, rememberToken }) {
			commit(SET_USER_SESSION, { userName, lastLogin });
			commit(SET_REMEMBER_TOKEN, rememberToken);

			localStorage.setItem(
				STORAGE_USER_SESSION,
				JSON.stringify({ userName, lastLogin, rememberToken })
			);
		},

		removeUserSession({ commit }) {
			commit(REMOVE_USER_SESSION);
			commit(REMOVE_REMEMBER_TOKEN);
			sessionStorage.removeItem('secure');
		},

		forgetUserSession() {
			localStorage.removeItem(STORAGE_USER_SESSION);
		},

		loadUserSession({ commit }) {
			const userSession = JSON.parse(localStorage.getItem(STORAGE_USER_SESSION)) || {};
			const { userName = '', lastLogin = null, rememberToken = '' } = userSession;

			commit(SET_USER_SESSION, { userName, lastLogin });
			commit(SET_REMEMBER_TOKEN, rememberToken);
		},

		markUserGreeted({ commit }) {
			commit(SET_USER_GREETED, true);
		},

		setTheme({ commit }, theme) {
			commit(SET_THEME, theme);
			localStorage.setItem(STORAGE_THEME, JSON.stringify({ theme }));
		},

		changeLanguage({ commit }, lang) {
			commit(CHANGE_LANGUAGE, lang);
			localStorage.setItem(STORAGE_LANG, JSON.stringify({ lang }));
		},

		setNewsId({ commit }, id) {
			commit(SET_NEWS_ID, id);
			localStorage.setItem(STORAGE_NEWS_ID, id);
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
