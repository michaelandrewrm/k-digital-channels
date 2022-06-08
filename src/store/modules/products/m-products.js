import { typesByTitle } from '@modules/products/product-types';
import { subtypesById } from '@modules/products/product-subtypes';
import productFamilies from '@modules/products/product-families';
import SessionCache from '@modules/session/session-cache';
import categorizeProducts from '@modules/products/product-sort';
import resourcesModule from '@modules/resources/m-resources';

const cache = new SessionCache('products');
const cacheKey = 'items';
const byProfileId = (profileId, products) =>
	products.filter(({ profiles }) => profiles && profiles.find(({ id }) => id === profileId));

export default {
	namespaced: true,

	modules: { resources: resourcesModule },

	actions: {
		fetch({ dispatch, rootState }, { refresh, force } = {}) {
			const profileId = rootState.profiles?.defaultProfile?.id;

			if (!refresh && cache.has(cacheKey)) {
				const productsCache = cache.get(cacheKey);

				if (profileId && !force) {
					return byProfileId(profileId, productsCache);
				}

				return productsCache;
			}

			const url = '/products';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(async ({ data: { data } }) => {
				/* istanbul ignore next */
				if (!data?.length) {
					return [];
				}

				const collection = categorizeProducts(data);
				const mPortfolioType = typesByTitle['managed-portfolio'];
				const mRSIPortfolioType = typesByTitle['managed-rsi-portfolio'];
				const promises = collection
					.filter(({ productType: { id } }) => [mPortfolioType, mRSIPortfolioType].includes(id))
					.map(async ({ id: productId, profiles }) => {
						const products = await dispatch('getPortfolio', { productId });
						const normalizedProducts = products.map((item) => ({
							...item,
							parentId: productId,
							productSubtype: { id: `m-${item.productSubtype.id}` },
							relationType: { id: item?.relationType?.id ?? '01' },
							profiles,
						}));

						return categorizeProducts(normalizedProducts);
					});
				const managedProducts = await Promise.all(promises);

				/* istanbul ignore else */
				if (managedProducts?.length) {
					collection.push(...managedProducts.flat());
				}

				cache.set(cacheKey, collection);

				if (profileId) {
					return byProfileId(profileId, collection);
				}

				return collection;
			});
		},

		async get({ dispatch }, id) {
			let products = cache.get(cacheKey);

			/* istanbul ignore else */
			if (!products?.length) {
				products = await dispatch('fetch');
			}

			if (id?.includes('/')) {
				const [productId] = id.split('/');
				return products.find(({ id: itemId }) => itemId === productId);
			}

			const product = products.find(({ id: itemId }) => itemId === id);
			/* istanbul ignore next */
			if (!product) {
				return Promise.reject();
			}

			return product;
		},

		getPosition({ dispatch }, { productId }) {
			const url = `/products/${productId}/position`;
			const method = 'GET';
			const key = `position/${productId}`;

			if (cache.has(key)) {
				return cache.get(key);
			}

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data }) => {
				cache.set(key, data);
				return data;
			});
		},

		getPortfolio({ dispatch }, { productId }) {
			const url = `/products/${productId}/managedProducts`;
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data: { data } }) => data);
		},

		getCardCVV({ dispatch }, { productId }) {
			const url = `/products/${productId}/cvv`;
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data: { cvv } }) => cvv);
		},

		getCardPIN({ dispatch }, { productId }) {
			const url = `/products/${productId}/pin`;
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data: { pin } }) => pin);
		},

		getCardPAN({ dispatch }, { productId }) {
			const url = `/products/${productId}/pan`;
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data: { pan } }) => pan);
		},

		byService({ dispatch }, byService) {
			const url = '/products';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams: { byService },
				},
				{ root: true }
			).then(({ data: { data } }) => {
				if (!data?.length) {
					return;
				}

				return categorizeProducts(data);
			});
		},

		getDetails({ dispatch }, id) {
			if (id.includes('/')) {
				const parts = id.split('/');
				const [productId, resource, resourceId] = parts;

				return dispatch('resources/get', { resource, productId, resourceId }, { root: true });
			}

			const key = `detail/${id}`;

			if (cache.has(key)) {
				return cache.get(key);
			}

			const url = `/products/${id}`;
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data }) => {
				cache.set(key, data);

				return data;
			});
		},

		/* istanbul ignore next */
		async getSiblings({ dispatch, rootState }, productId) {
			const profileId = rootState.profiles.defaultProfile?.id;
			let products = cache.get(cacheKey);

			/* istanbul ignore else */
			if (!products?.length) {
				products = await dispatch('fetch');
			}

			if (profileId) {
				products = byProfileId(profileId, products);
			}

			const categorizedProducts = products.reduce((reducer, item) => {
				const productSubtype = subtypesById[item.productSubtype.id];
				const families = Object.entries(productFamilies);
				const familyGroup = families.find(([, group]) => group.includes(productSubtype));

				if (familyGroup) {
					const [familyName] = familyGroup;

					if (!reducer[familyName]) {
						// eslint-disable-next-line no-param-reassign
						reducer[familyName] = [];
					}

					reducer[familyName].push(item);
				}

				return reducer;
			}, {});

			const [, familyMembers] = Object.entries(categorizedProducts).find(([, group]) =>
				group.find(({ id }) => id === productId)
			);

			return familyMembers;
		},

		putAlias({ dispatch }, { alias, productId }) {
			const url = `/products/${productId}/alias`;
			const method = 'PUT';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload: { alias },
				},
				{
					root: true,
				}
			).then(() => {
				const getCache = cache.get(cacheKey);
				getCache?.forEach((item, index) => {
					if (item.id === productId) {
						getCache[index].alias = alias;
					}
				});
			});
		},

		getReceipt({ dispatch }, { productId, movementId, query = {}, reportType = 'pdf' }) {
			const urlDetail = `/products/${productId}/movements/${movementId}/document`;
			const urlList = `/products/${productId}/movements/document`;
			const method = 'GET';
			const url = movementId ? urlDetail : urlList;

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams: { reportType, ...query },
				},
				{ root: true }
			).then(({ data: { content } }) => content);
		},

		getCertificate({ dispatch }, { productId, movementId, query = {} }) {
			const url = `/products/${productId}/movements/${movementId}/transferCertificate`;
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams: { ...query },
				},
				{ root: true }
			).then(({ data: { content } }) => content);
		},

		getHolderCertificate({ dispatch }, { productId }) {
			const url = `/products/${productId}/holderCertificate`;
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data: { content } }) => content);
		},
	},
};
