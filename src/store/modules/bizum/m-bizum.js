import publicService from '@modules/service/m-public-service';
import SessionCache from '@modules/session/session-cache';
import { Unibabel } from 'unibabel';
import BwipJs from 'bwip-js';

const cache = new SessionCache('bizum');
const cacheRegister = new SessionCache('bizum-register');

const hashCode = (str) =>
	str.split('').reduce((red, value) => ((red << 5) - red + value.charCodeAt(0)) | 0, 0);

export default {
	namespaced: true,

	modules: { publicService },

	actions: {
		isEnabled({ dispatch, rootState }) {
			const method = 'GET';
			const url = '/bizum/whitelist';
			const cacheKey = 'isEnabled';

			if (cacheRegister.has(cacheKey)) {
				return cacheRegister.get(cacheKey);
			}

			if (rootState.app.companyId === 'BF') {
				cacheRegister.set(cacheKey, false);
				return false;
			}

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			)
				.then(() => {
					cacheRegister.set(cacheKey, true);
					return true;
				})
				.catch(() => {
					cacheRegister.set(cacheKey, false);
					return false;
				});
		},

		isActive({ dispatch }) {
			return dispatch('requestActive')
				.then(() => true)
				.catch(() => false);
		},

		requestActive({ dispatch }) {
			const method = 'GET';
			const url = '/bizum/active';
			const cacheKey = 'isActive';

			return dispatch('isEnabled').then((result) => {
				return new Promise((resolve, reject) => {
					if (result) {
						if (cacheRegister.has(cacheKey)) {
							return resolve();
						}
						return dispatch(
							'service/request',
							{
								service: { request: { url, method } },
							},
							{ root: true }
						)
							.then(() => {
								cacheRegister.set(cacheKey, true);
								resolve();
							})
							.catch(reject);
					}

					return reject();
				});
			});
		},

		getProduct({ dispatch }) {
			const method = 'GET';
			const url = '/bizum/signup';
			const cacheKey = 'product';

			if (cacheRegister.has(cacheKey)) {
				return cacheRegister.get(cacheKey);
			}

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data: { product } }) => {
				const response = {
					alias: product.alias,
					balance: product.postedBalance,
					id: product.productId,
					productNumber: product.productNumber,
				};
				Object.freeze(response);
				cacheRegister.set(cacheKey, response);
				return response;
			});
		},

		setProduct({ dispatch }, productId) {
			const method = 'PUT';
			const url = '/bizum/signup';
			const cacheKey = 'product';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { productId },
				},
				{ root: true }
			).then((response) => {
				cacheRegister.clear(cacheKey);
				return response;
			});
		},

		getTerms({ dispatch }) {
			const method = 'GET';
			const url = '/bizum/settings';
			const cacheKey = 'terms';

			let serviceRequest;

			if (cacheRegister.has(cacheKey)) {
				serviceRequest = Promise.resolve(cacheRegister.get(cacheKey));
			} else {
				serviceRequest = dispatch(
					'service/request',
					{ service: { request: { url, method } } },
					{ root: true }
				).then(({ data }) => {
					cacheRegister.set(cacheKey, data);
					return data;
				});
			}

			return serviceRequest.then((data) => {
				return new Promise((resolve) => {
					return dispatch('publicService/request', {
						url: data.url,
						headers: { 'Content-Type': 'text/html' },
						responseType: 'text',
						data: {},
					}).then(({ data: template }) => {
						const response = { template, version: data.version };
						resolve(response);
					});
				});
			});
		},

		getTermsInPDF({ dispatch }) {
			const method = 'GET';
			const url = '/bizum/settings';
			const cacheKey = 'terms';

			let serviceRequest;

			if (cacheRegister.has(cacheKey)) {
				serviceRequest = Promise.resolve(cacheRegister.get(cacheKey));
			} else {
				serviceRequest = dispatch(
					'service/request',
					{ service: { request: { url, method } } },
					{ root: true }
				).then(({ data }) => {
					cacheRegister.set(cacheKey, data);
					return data;
				});
			}

			return serviceRequest.then(({ pdf }) => pdf);
		},

		signUp({ dispatch }, { productId, version }) {
			const method = 'POST';
			const url = '/bizum/signup';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { productId, termsVersion: version },
				},
				{ root: true }
			).then(() => {
				cacheRegister.clear();
			});
		},

		unregister({ dispatch }) {
			const method = 'DELETE';
			const url = '/bizum/signup';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(() => {
				cacheRegister.clear();
			});
		},

		requestPortability({ dispatch }, { signupId }) {
			const method = 'PATCH';
			const url = `/bizum/signup/${signupId}/accept`;

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			);
		},

		sendOTP({ dispatch }, { signupId, otpValue }) {
			const method = 'PATCH';
			const url = `/bizum/signup/${signupId}`;

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { portabilityCode: otpValue },
				},
				{ root: true }
			);
		},

		getMovements({ dispatch }, { status, query = {}, paginationKey, refresh }) {
			const id = 'bizum';
			const key = hashCode(id.concat(status, Object.values(query)));
			const cacheKey = `list/${id}/${key}`;
			const queryParams = {};
			const url = '/bizum/movements/';
			const method = 'GET';

			if (refresh) {
				SessionCache.clear('bizum');
			}

			if (cache.has(cacheKey) && !paginationKey) {
				return cache.get(cacheKey);
			}

			/* istanbul ignore else */
			if (status) {
				Object.assign(queryParams, { status: status.toUpperCase() });
			}

			/* istanbul ignore else */
			if (paginationKey) {
				Object.assign(queryParams, { paginationKey });
			}

			/* istanbul ignore else */
			if (query) {
				Object.assign(queryParams, query);
			}

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams,
				},
				{ root: true }
			).then(({ data }) => {
				const response = {
					paging: data.paging,
					data: data.data.map((movement) => {
						const row = {
							...movement,
							// operationDate comes with milliseconds causing error on Fides Facade
							operationDate: movement?.operationDate?.slice(0, 10),
						};

						cache.set(`item/${row.id}`, row);

						return row;
					}),
				};

				// Hay caché. Agregamos nuevos modelos al final de la lista.
				if (cache.has(cacheKey)) {
					const result = cache.get(cacheKey);

					Object.assign(response.data, result.data.concat(response.data));
				}

				// Guardamos la petición en la caché.
				cache.set(cacheKey, response);

				return response;
			});
		},

		getMovement({ dispatch }, movementId) {
			/* istanbul ignore else */
			if (cache.has(`item/${movementId}`)) {
				const movement = cache.get(`item/${movementId}`);

				if (movement.possibleActions?.length) {
					movement.possibleActions = movement.possibleActions.map((action) => {
						if (action === 'CANCEL' && movement.status.name === 'IPENDING') {
							return 'ICANCEL';
						}

						return action;
					});
				}

				if (!movement.hasExtraInfo) {
					return movement;
				}

				const method = 'GET';
				const url = `/bizum/movements/${movementId}`;

				return dispatch(
					'service/request',
					{
						service: { request: { url, method } },
					},
					{ root: true }
				).then(({ data: { data } }) => {
					const { additionalContext } = data;
					Object.assign(movement, { additionalContext });
					cache.set(`item/${movementId}`, movement);
					return movement;
				});
			}
		},

		deleteAdditionalContent({ dispatch }, movementId) {
			return dispatch('getMovement', movementId).then((movement) => {
				const method = 'DELETE';
				const url = `/bizum/movements/${movementId}`;

				// C2CED: Enviar dinero. C2CSD: Solicitud de dinero.
				const contentSendedOrRequested = ({ type }) => ['C2CED', 'C2CSD'].includes(type);
				const content = movement.additionalContext.find(contentSendedOrRequested);
				const { type } = content;
				const payload = { type };

				return dispatch(
					'service/request',
					{
						service: { request: { url, method } },
						payload,
					},
					{ root: true }
				);
			});
		},

		deleteAdditionalJustification({ dispatch }, movementId) {
			return dispatch('getMovement', movementId).then((movement) => {
				const method = 'DELETE';
				const url = `/bizum/movements/${movementId}`;

				const contentSendedOrRequested = ({ type }) => ['C2CNSD', 'C2CDSD'].includes(type);
				const content = movement.additionalContext.find(contentSendedOrRequested);
				const { type } = content;
				const payload = { type };

				return dispatch(
					'service/request',
					{
						service: { request: { url, method } },
						payload,
					},
					{ root: true }
				);
			});
		},

		saveMovement({ dispatch }, { id, model, mode }) {
			return dispatch('getMovement', id).then((movement) => {
				const date = `${new Date()
					.toISOString()
					.replace(/T/, ' ')
					.replace(/\..+/, '')}:000`;

				const payload = {
					action: mode.toUpperCase(),
					type: movement.type.name,
					sender: movement.sender.phone,
					beneficiary: movement.beneficiary.phone,
					amount: movement.amount,
					date,
				};

				if (model?.additionalJustification) {
					const additionalContext = {
						text: Unibabel.utf8ToBase64(model.additionalJustification),
					};

					Object.assign(payload, { additionalContext });
				}

				const method = 'PUT';
				const url = `/bizum/movements/${id}`;

				return dispatch(
					'service/request',
					{
						service: { request: { url, method } },
						payload,
					},
					{ root: true }
				);
			});
		},

		getContacts({ dispatch }, addressbook) {
			const method = 'POST';
			const url = '/bizum/addressbook';
			const phones = addressbook.map(({ phone }) => phone);
			const cacheKey = `contacts/${phones.join('-')}`;

			if (cacheRegister.has(cacheKey)) {
				return cacheRegister.get(cacheKey);
			}

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { addressbook },
				},
				{ root: true }
			).then(({ data: { data } }) => {
				cacheRegister.set(cacheKey, data.addressbook);
				return data.addressbook;
			});
		},

		operateMoney({ dispatch }, { mode, model, accept }) {
			const { assert } = console;

			assert(
				['send', 'request', 'donate'].includes(mode),
				'El modo para operar dinero solo puede ser `send`, `request` o `donate`.'
			);

			let url = '/bizum/';
			let method = 'POST';

			url += ['send', 'donate'].includes(mode) ? 'send-money' : 'request-money';

			if (model.id) {
				url += `/${model.id}`;
				method = 'PUT';
			}

			if (accept) {
				url += '/accept';
			}

			const date = `${new Date()
				.toISOString()
				.replace(/T/, ' ')
				.replace(/\..+/, '')}:000`;

			const payload = {
				amount: model.amount,
				reason: model.reason,
				date,
			};

			/* istanbul ignore else */
			if (mode === 'send') {
				Object.assign(payload, { beneficiary: { phone: model.recipient } });
			} else if (mode === 'request') {
				Object.assign(payload, { issuer: { phone: model.recipient } });
			} else if (mode === 'donate') {
				Object.assign(payload, { beneficiary: { phone: model.ong.id } });
			}

			if (['send', 'request'].includes(mode)) {
				const additionalContext = {};

				if (model.additionalText) {
					Object.assign(additionalContext, {
						text: Unibabel.utf8ToBase64(model.additionalText),
					});
				}

				if (model.additionalImage) {
					Object.assign(additionalContext, {
						image: model.additionalImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
						imageFormat: 'JPG',
					});
				}

				if (model.additionalText || model.additionalImage) {
					Object.assign(payload, { additionalContext });
				}
			}

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload,
				},
				{ root: true }
			).then(({ data }) => ({ ...data.data, result: data.result }));
		},

		getONG(store, id) {
			const cacheKey = `ong/${id}`;

			return cache.get(cacheKey);
		},

		getONGs({ dispatch }, { query = {}, paginationKey } = {}) {
			const id = 'bizum';
			const key = hashCode(id.concat(Object.values(query)));
			const cacheKey = `ongs/${key}`;
			const queryParams = {};
			const url = '/bizum/ongs';
			const method = 'GET';

			if (cache.has(cacheKey) && !paginationKey) {
				return cache.get(cacheKey);
			}

			if (paginationKey) {
				Object.assign(queryParams, { paginationKey });
			}

			/* istanbul ignore else */
			if (query) {
				Object.assign(queryParams, query);
			}

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams,
				},
				{ root: true }
			).then(({ data }) => {
				const response = {
					paging: data.paging,
					data: data.data.map((row) => {
						// Guardamos cada modelo de items en la caché de filas.
						cache.set(`ong/${row.id}`, row);
						return row;
					}),
				};

				// Hay caché. Agregamos nuevos modelos al final de la lista.
				if (cache.has(cacheKey)) {
					const result = cache.get(cacheKey);

					Object.assign(response.data, result.data.concat(response.data));
				}

				// Guardamos la petición en la caché.
				cache.set(cacheKey, response);

				return response;
			});
		},

		getQRCode({ dispatch }) {
			const url = '/bizum/selae';
			const method = 'POST';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data }) => {
				return data;
			});
		},

		getSelaeOperation({ dispatch }, { id }) {
			const url = `/bizum/selae/${id}`;
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			)
				.then((response) => {
					SessionCache.clear('bizum');
					SessionCache.clear('signatures');
					return response;
				})
				.catch(({ response }) => {
					return response;
				});
		},

		getQRImage(context, { QR }) {
			const canvas = document.createElement('canvas');
			return new Promise((resolve, reject) => {
				try {
					BwipJs.toCanvas(canvas, {
						bcid: 'qrcode',
						text: QR,
						textxalign: 'center',
						monochrome: true,
						backgroundcolor: 'ffffff',
						scale: 3,
					});
					resolve({
						image: canvas.toDataURL('image/png'),
					});
				} catch {
					reject();
				}
			});
		},
	},
};
