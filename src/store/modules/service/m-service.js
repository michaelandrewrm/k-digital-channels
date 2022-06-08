import axios from 'axios';
import moduleError from '@modules/service/m-error-handler';

const UPDATE_TIMESTAMP = 'UPDATE_TIMESTAMP';

const parseStringTemplate = /* istanbul ignore next */ (str, obj) => {
	const parts = str.split(/\$\{(?!\d)[\wæøåÆØÅ]*\}/);
	const args = str.match(/[^{}]+(?=})/g) || [];
	const parameters = args.map(
		(argument) => obj[argument] || (obj[argument] === undefined ? '' : obj[argument])
	);
	return String.raw({ raw: parts }, ...parameters);
};

export default {
	namespaced: true,

	modules: { error: moduleError },

	state() {
		return {
			baseURL:
				window.VUE_APP_CONFIG.endpoint ||
				process.env.VUE_APP_ENDPOINT ||
				'https://api.grupocaminos.es',
			req: axios.create(),
			lang: 'es-ES',
			timeout: 20000,
			lastRequestTimestamp: new Date(),
		};
	},

	mutations: {
		[UPDATE_TIMESTAMP](state, value) {
			state.lastRequestTimestamp = value;
		},
	},

	actions: {
		async request(store, { service, params, queryParams, payload }) {
			const { rootState, commit, state, dispatch } = store;
			const servicePro = { request: { ...service.request } };
			const encryptedPayload = await dispatch('secure/encrypt', payload, { root: true });
			const payloadRequest = {};

			payloadRequest.data = payload ? { payload: encryptedPayload } : null;

			if (params) {
				servicePro.request.url = parseStringTemplate(servicePro.request.url, params);
			}

			return new Promise((resolve, reject) => {
				const defaultHeaders = {
					'Content-Type': 'application/json',
					'uuid': rootState.secure.uuid,
				};
				const headers = service.headers ? service.headers : defaultHeaders;
				const { baseURL, timeout } = state;

				commit(UPDATE_TIMESTAMP, new Date());

				const onSuccess = async (response) => {
					/* istanbul ignore next */
					if (window.VUE_APP_CONFIG.env === 'dev' || process.env.NODE_ENV === 'development') {
						const { groupCollapsed } = console;
						groupCollapsed(
							'%cVuesoma: ['
								.concat(response?.status, '] ')
								.concat(response?.config?.method.toUpperCase(), ' ')
								.concat(response?.config?.baseURL, response?.config.url),
							'color: #3eaf7c;'
						);
					}

					const { data } = response;

					if (data && typeof data === 'string') {
						const decData = await dispatch('secure/decrypt', data, { root: true });

						// eslint-disable-next-line no-param-reassign
						response.data = decData;
					}

					/* istanbul ignore next */
					if (window.VUE_APP_CONFIG.env === 'dev' || process.env.NODE_ENV === 'development') {
						const { groupCollapsed, log, groupEnd } = console;

						groupCollapsed('Request (url)');
						log(response?.request?.responseURL);
						groupEnd();

						if (payload) {
							groupCollapsed('Request (data)');
							log(JSON.parse(JSON.stringify(payload)));
							groupEnd();
						}

						if (response.data) {
							groupCollapsed('Response');
							log(response.data);
							groupEnd();
						}

						groupEnd();
					}

					return resolve(response);
				};

				const onFailure = async (err) => {
					/* istanbul ignore next */
					if (window.VUE_APP_CONFIG.env === 'dev' || process.env.NODE_ENV === 'development') {
						const { groupCollapsed, log, groupEnd } = console;
						const status = err.response?.status;
						let method = err.response?.config?.method.toUpperCase();
						let url = err.response?.config?.baseURL + err.response?.config.url;

						if (err?.description === 'Mirage: undefined') {
							[, method, url] = err.message.match(/tried to ([A-Z]*) '(.+)'/);
						}

						groupCollapsed(
							'%cVuesoma: ['
								.concat(status, '] ')
								.concat(method, ' ')
								.concat(url),
							'color: #3eaf7c;'
						);

						groupCollapsed('Request (url)');
						log(err.request?.responseURL);
						groupEnd();

						if (payload) {
							groupCollapsed('Request (data)');
							log(JSON.parse(JSON.stringify(payload)));
							groupEnd();
						}

						if (err.response) {
							groupCollapsed('Response');
							log(err.response);
							groupEnd();
						}

						groupEnd();
					}

					const error = await dispatch('error/handle', {
						error: err,
						requestConfig: {
							service,
							params,
							queryParams,
							payload,
						},
					});

					if (error?.config?.validateStatus(error?.status)) {
						return onSuccess(error);
					}

					return reject(error);
				};

				state.req
					.request({
						baseURL,
						headers,
						timeout,
						params: queryParams,
						...servicePro.request,
						...payloadRequest,
					})
					.then(onSuccess)
					.catch(onFailure);
			});
		},
	},
};
