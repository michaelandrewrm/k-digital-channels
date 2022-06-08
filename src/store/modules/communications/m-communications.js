import SessionCache from '@modules/session/session-cache';

const SET_UNREAD_MESSAGES = 'SET_UNREAD_MESSAGES';
const cache = new SessionCache('messages');

const hashCode = (str) =>
	str.split('').reduce((red, value) => ((red << 5) - red + value.charCodeAt(0)) | 0, 0);

export default {
	namespaced: true,

	state() {
		return {
			unreadMessages: 0,
		};
	},

	mutations: {
		[SET_UNREAD_MESSAGES](state, unreadMessages) {
			state.unreadMessages = unreadMessages;
		},
	},

	actions: {
		postFeedback({ dispatch }, payload) {
			const url = '/communications/feedback';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method: 'POST' } },
					payload,
				},
				{ root: true }
			);
		},

		getUnreadMessages({ state, dispatch, commit, rootState }) {
			if (rootState?.authn?.isEmbedded) {
				return Promise.resolve({ data: { unreadMessages: 0 } });
			}

			const url = '/communications/unread-messages';

			return dispatch(
				'service/request',
				{ service: { request: { url, method: 'GET' } } },
				{ root: true }
			)
				.then(({ data: { unreadMessages } }) => {
					if (unreadMessages !== state.unreadMessages) {
						commit(SET_UNREAD_MESSAGES, unreadMessages);
						cache.clear();
					}
					return unreadMessages;
				})
				.catch(() => {
					commit(SET_UNREAD_MESSAGES, 0);
					return 0;
				});
		},

		getCommunicationItems(
			{ dispatch, rootState },
			{ type, paginationKey, dateFrom, dateTo, force }
		) {
			if (rootState?.authn?.isEmbedded) {
				return Promise.resolve({ data: [] });
			}

			// Generamos un identificador único de petición
			const key = hashCode('message'.concat(dateFrom, dateTo));
			const url = `/communications/${type}`;
			const cacheKey = `list/${type}/${key}`;
			const queryParams = {};

			// Respondemos con la caché solo si:
			// 1. Existe
			// 2. No es una petición de página. Si lo fuera, la caché existiría pero no
			// tendría la información de la página nueva ya que este parámetro no se
			// tiene en cuenta a la hora de crear la key (identificador de petición).
			if (cache.has(cacheKey) && !paginationKey && !force) {
				const cacheData = cache.get(cacheKey);
				return {
					data: cacheData.data.map((id) => cache.get(`item/${type}/${id}`)),
					paging: cacheData.paging,
				};
			}

			if (paginationKey) {
				Object.assign(queryParams, { paginationKey });
			}
			if (dateFrom) {
				Object.assign(queryParams, { dateFrom });
			}
			if (dateTo) {
				Object.assign(queryParams, { dateTo });
			}

			return dispatch(
				'service/request',
				{ service: { request: { url, method: 'GET' } }, queryParams },
				{ root: true }
			).then(({ data: response }) => {
				// Guardamos cada modelo de items en la caché de filas.
				response.data.forEach((row) => cache.set(`item/${type}/${row.id}`, row));

				const listOfIds = response.data.map(({ id }) => id);

				if (cache.has(cacheKey)) {
					const cacheData = cache.get(cacheKey);
					listOfIds.unshift(...cacheData.data);
				}

				// Guardamos la petición en la caché.
				cache.set(cacheKey, {
					data: listOfIds,
					paging: response.paging,
				});

				return {
					data: listOfIds.map((id) => cache.get(`item/${type}/${id}`)),
					paging: response.paging,
				};
			});
		},

		getMessages({ dispatch }, { paginationKey, dateFrom, dateTo, force } = {}) {
			return dispatch('getCommunicationItems', {
				type: 'messages',
				paginationKey,
				dateFrom,
				dateTo,
				force,
			});
		},

		getDocuments({ dispatch }, { paginationKey, dateFrom, dateTo, force } = {}) {
			return dispatch('getCommunicationItems', {
				type: 'documents',
				paginationKey,
				dateFrom,
				dateTo,
				force,
			});
		},

		// getStatements({ dispatch }, { paginationKey, dateFrom, dateTo, force } = {}) {
		// 	return dispatch('getCommunicationItems', {
		// 		type: 'statements',
		// 		paginationKey,
		// 		dateFrom,
		// 		dateTo,
		// 		force,
		// 	});
		// },

		// TODO: Por ahora no hay avisos "Para ti"
		/* istanbul ignore next */
		getStatements() {
			return { data: [] };
		},

		getMessage(store, id) {
			return cache.get(`item/messages/${id}`);
		},

		getDocument(store, id) {
			return cache.get(`item/documents/${id}`);
		},

		downloadDocument({ dispatch }, { id, type }) {
			const url = `/communications/documents/${id}/document`;
			return dispatch(
				'service/request',
				{
					service: { request: { url, method: 'GET' } },
					queryParams: { typeId: type },
				},
				{ root: true }
			).then(({ data }) => data);
		},

		markCommunicationItemAsRead({ dispatch }, { itemType, type, id }) {
			const url = `/communications/${itemType}/${id}`;
			const cacheData = cache.get(`item/${itemType}/${id}`);

			cache.set(`item/${itemType}/${id}`, {
				...cacheData,
				reviewDate: new Date().toISOString(),
			});

			return dispatch(
				'service/request',
				{
					service: { request: { url, method: 'PATCH' } },
					payload: { type },
				},
				{ root: true }
			);
		},

		markMessageAsRead({ dispatch }, { id, type }) {
			return dispatch('markCommunicationItemAsRead', { itemType: 'messages', id, type });
		},

		markDocumentAsRead({ dispatch }, { id, type }) {
			return dispatch('markCommunicationItemAsRead', { itemType: 'documents', id, type });
		},

		getAnnouncements({ dispatch, rootState }, spaceName) {
			if (rootState?.authn?.isEmbedded) {
				return Promise.resolve({ data: [] });
			}

			const spaces = { prelogin: 'prelogin' };
			const spaceIds = { postlogin: 2, banner: 3 };
			const expURL = spaces[spaceName] || 'communications';
			const url = `/${expURL}/communications`;
			const queryParams =
				spaceName === 'prelogin'
					? { language: rootState.session.lang, company: rootState.app.companyId }
					: { spaceId: spaceIds[spaceName] };
			const key = `communications/${spaceName}`;
			const MAX_SLIDES = 3;

			if (cache.has(key)) {
				return cache.get(key);
			}

			return dispatch(
				'service/request',
				{
					service: { request: { url, method: 'GET' } },
					queryParams,
				},
				{ root: true }
			).then(({ data: { data } }) => {
				const slicedData = data.slice(0, MAX_SLIDES);
				cache.set(key, slicedData);
				return slicedData;
			});
		},

		changeAnnouncementData({ dispatch }, { id, data }) {
			const url = `/communications/communications/${id}`;

			return dispatch(
				'service/request',
				{
					service: { request: { url, method: 'PATCH' } },
					payload: { ...data },
				},
				{ root: true }
			);
		},

		setAnnouncementFeedback({ dispatch }, { id, feedback }) {
			return dispatch('changeAnnouncementData', { id, data: { feedback } });
		},

		setAnnouncementImpression({ dispatch }, id) {
			return dispatch('changeAnnouncementData', { id, data: { impressions: 1 } });
		},
	},
};
