import { typesById } from '@modules/products/product-types';
import { subtypesById } from '@modules/products/product-subtypes';
import serviceProducts from '@services/s-products';
import SessionCache from '@modules/session/session-cache';

const cache = new SessionCache('resources');

const hashCode = (str) =>
	str.split('').reduce((red, value) => ((red << 5) - red + value.charCodeAt(0)) | 0, 0);

const SET_HAS_RESULT = 'SET_HAS_RESULT';

export default {
	namespaced: true,

	state() {
		return {
			hasResult: true,
		};
	},

	mutations: {
		[SET_HAS_RESULT](state, value) {
			state.hasResult = value;
		},
	},

	actions: {
		fetch({ dispatch, commit }, { resource, productId, paginationKey, force, query = {} }) {
			const id = `${productId}/${resource}`;
			const params = { id };
			const key = hashCode(resource.concat(productId, Object.values(query)));
			const cacheKey = `resourcesList/${id}/${key}`;
			const queryParams = {};

			if (cache.has(cacheKey) && !paginationKey) {
				const data = cache.get(cacheKey);
				commit(SET_HAS_RESULT, data?.data?.length > 0);
				return data;
			}

			if (paginationKey) {
				Object.assign(queryParams, { paginationKey });
			}

			if (force) {
				Object.assign(queryParams, { generateOtp: true });
			}

			if (query) {
				Object.assign(queryParams, query);
			}

			return dispatch(
				'service/request',
				{
					service: serviceProducts,
					params,
					queryParams,
				},
				{ root: true }
			).then(({ data }) => {
				const response = {
					reference: data.reference,
					paging: data.paging,
					data: data.data.map((item) => {
						Object.assign(item, { reference: data.reference });
						cache.set(`resource/${id}/${item.id}`, item);

						return item;
					}),
				};

				if (cache.has(cacheKey)) {
					const result = cache.get(cacheKey);
					Object.assign(response.data, result.data.concat(response.data));
				}

				commit(SET_HAS_RESULT, data?.data?.length > 0);

				cache.set(cacheKey, response);

				return response;
			});
		},

		async get({ dispatch }, { resource, productId, resourceId, useCache }) {
			const product = await dispatch('products/get', productId.split('/')[0], { root: true });
			const type = typesById[(product.productType?.id)];
			const subtype = subtypesById[(product.productSubtype?.id)];
			const isTermDeposit = subtype === 'term-deposit';
			const isPremiumDeposit = subtype === 'premium-deposit';
			const isLoan = type === 'loan';
			const id = `${productId}/${resource}/${resourceId}`;

			if ((isTermDeposit && !useCache) || (isPremiumDeposit && !useCache) || isLoan) {
				const params = { id };
				const key = `resource/${id}/detail`;

				if (cache.has(key)) {
					return cache.get(key);
				}

				return new Promise((resolve, reject) => {
					return dispatch(
						'service/request',
						{
							service: serviceProducts,
							params,
						},
						{ root: true }
					)
						.then(({ data }) => {
							cache.set(key, data);
							resolve(data);
						})
						.catch((error) => reject(error));
				});
			}

			return cache.get(`resource/${id}`);
		},

		updateCachedResource(context, { productId, resource = 'movements', resourceId, data }) {
			const key = `resource/${productId}/${resource}/${resourceId}`;
			const cacheResource = cache.get(key);
			const cacheIterator = cache.store;
			const comment = { comment: data.comment, commentId: data.commentId };

			// We have to update the resources list as well
			cacheIterator.forEach((cacheValue, cacheKey) => {
				if (
					cacheKey?.startsWith(`resourcesList/${productId}/${resource}`) &&
					!cacheKey?.includes('withholdings')
				) {
					const item = cacheValue?.data?.find(({ id }) => id === resourceId);

					item.comment = comment;
				}
			});

			/* istanbul ignore next */
			if (!cacheResource) {
				return;
			}

			const item = { ...cacheResource, comment };

			cache.set(key, item);

			return item.comment;
		},

		putComment({ dispatch }, { productId, movementId, comment, commentId }) {
			const url = `/products/movements/comments/${commentId}`;
			const method = 'PUT';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { comment },
				},
				{ root: true }
			).then(() =>
				dispatch('updateCachedResource', {
					productId,
					resourceId: movementId,
					data: { comment, commentId },
				})
			);
		},

		postComment({ dispatch }, { productId, movementId, comment }) {
			const url = `/products/${productId}/movements/${movementId}/comment`;
			const method = 'POST';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { comment },
				},
				{ root: true }
			).then(({ data }) =>
				dispatch('updateCachedResource', {
					productId,
					resourceId: movementId,
					data,
				})
			);
		},

		deleteComment({ dispatch }, { productId, movementId, commentId }) {
			const url = `/products/movements/comments/${commentId}`;
			const method = 'DELETE';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(() =>
				dispatch('updateCachedResource', {
					productId,
					resourceId: movementId,
					data: { comment: '', commentId: '' },
				})
			);
		},
	},
};
