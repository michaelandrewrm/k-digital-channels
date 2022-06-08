import SessionCache from '@modules/session/session-cache';
import categorizeProducts from '@modules/products/product-sort';

const cache = new SessionCache('transfers');

const normalizeModel = (model) => {
	const result = {
		origin: model.origin.id,
		beneficiary: {
			account: model.destination.account,
			name: model.destination.name,
			favorite: Boolean(model.destination.favorite),
		},
		amount: model.amount,
		date: model.date,
		reason: model.reason,
		transferMode: model.destination.transferMode,
		favorite: Boolean(model.favorite),
	};

	if (model.notify && model.email) {
		Object.assign(result, {
			emailInfo: model.email,
		});
	}

	if (model.favorite) {
		Object.assign(result, {
			alias: model.alias,
		});
	}

	if (model.chargeBearer) {
		Object.assign(result, {
			chargeBearer: model.chargeBearer,
		});
	}

	if (model.periodicity === 'periodic') {
		Object.assign(result, {
			scheduled: {
				frequency: model.frequency,
				lastExecutionDate: model.maxDate,
			},
		});
	}

	return result;
};

export default {
	namespaced: true,

	actions: {
		getTransfer({ dispatch }, { type, transferId, productId }) {
			const getTransferById = ({ id }) => id === transferId;

			const cacheKey = `${type}/${transferId}`;

			if (cache.has(cacheKey)) {
				return cache.get(cacheKey);
			}

			if (type === 'ordered' && productId) {
				const url = '/move-money/transfers/detail';
				const method = 'GET';
				const queryParams = { type: 'issued', transferId, productId };

				return dispatch(
					'service/request',
					{
						service: { request: { url, method } },
						queryParams,
					},
					{ root: true }
				).then(({ data }) => {
					let detail = data;

					if (cache.has(type)) {
						const item = cache.get(type).find(getTransferById);
						detail = { ...item, ...detail };
						cache.set(cacheKey, detail);
					}

					return detail;
				});
			}

			return dispatch('getTransfers', { type }).then((data) => {
				return data.find(getTransferById);
			});
		},

		deleteTransfer({ dispatch }, { type, transferId }) {
			const url = {
				ordered: `/move-money/transfers/${transferId}`,
				scheduled: `/move-money/transfers/scheduled/${transferId}`,
				favorite: `/move-money/favorites/${transferId}`,
			}[type];
			const method = 'DELETE';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(() => cache.clear());
		},

		modifyTransfer({ dispatch }, { transferId, model }) {
			const { origin, beneficiary, amount, date, scheduled, reason, transferMode } = normalizeModel(
				model
			);
			const url = `/move-money/transfers/scheduled/${transferId}`;
			const method = 'PUT';
			const payload = { origin, beneficiary, amount, date, scheduled, reason, transferMode };

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload,
				},
				{ root: true }
			).then((res) => {
				cache.clear();
				return res;
			});
		},

		getTransfers({ dispatch }, { type }) {
			const cacheKey = type;

			if (cache.has(cacheKey)) {
				return cache.get(cacheKey);
			}

			const url = {
				ordered: '/move-money/transfers?type=issued',
				scheduled: '/move-money/transfers/scheduled',
				favorite: '/move-money/favorites',
			}[type];
			const method = 'GET';

			return new Promise((resolve, reject) => {
				dispatch('getOrigins', { type: 'transferList' })
					.then((products) => {
						return dispatch(
							'service/request',
							{ service: { request: { url, method } } },
							{ root: true }
						)
							.then(({ data: { data } }) => {
								const origins = data.reduce((reducer, origin) => {
									const originPN = origin?.orderer?.fromAccount?.productNumber?.value;
									const product = products.find(
										({ productNumber }) => productNumber?.value === originPN
									);

									/* istanbul ignore else */
									if (product) {
										const { id } = product;

										Object.assign(origin.orderer.fromAccount, { id });

										reducer.push(origin);
									}

									return reducer;
								}, []);

								cache.set(cacheKey, origins);

								resolve(origins);
							})
							.catch(reject);
					})
					.catch(reject);
			});
		},

		getOrigins({ dispatch }, { type = 'transfer', force } = {}) {
			const cacheKey = `origins/${type}`;

			if (!force && cache.has(cacheKey)) {
				return cache.get(cacheKey);
			}

			const url = '/move-money/origins';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams: { type },
				},
				{ root: true }
			).then(({ data: { data } }) => {
				const products = categorizeProducts(data);
				cache.set(cacheKey, products);

				return products;
			});
		},

		getDestinations({ dispatch }, { type = 'transfer' } = {}) {
			const cacheKey = 'destinations';

			if (cache.has(cacheKey)) {
				return cache.get(cacheKey);
			}

			const url = '/move-money/destinations';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams: { type },
				},
				{ root: true }
			).then(({ data: { data } }) => {
				cache.set(cacheKey, data);
				return data;
			});
		},

		getLimits({ dispatch }) {
			const url = '/move-money/transfers/limits';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
				},
				{ root: true }
			).then(({ data }) => ({
				ownOperationLimit: data.ownAccounts,
				internalOperationLimit: data.internalAccounts,
				externalOperationLimit: data.externalAccounts,
				internalDailyLimit: data.postedInternalAccounts,
				externalDailyLimit: data.postedExternalAccounts,
			}));
		},

		validateFavorite({ dispatch }, { alias, destination }) {
			const { transferMode } = destination;
			const url = '/move-money/favorites/validate';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams: { alias, transferMode },
				},
				{ root: true }
			);
		},

		validateXBAN({ dispatch }, { iban, type, bic, origin }) {
			const url = '/move-money/validateBICIBAN';
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams: { iban, type, bic, origin },
				},
				{ root: true }
			).then(({ data: { data } }) => data);
		},

		simulate({ dispatch }, model) {
			const payload = normalizeModel(model);
			const url = '/move-money/transfers/simulate';
			const method = 'POST';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload,
				},
				{ root: true }
			).then(({ data }) => data);
		},

		transfer({ dispatch }, model) {
			const payload = normalizeModel(model);
			const url = '/move-money/transfers';
			const method = 'POST';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					payload,
				},
				{ root: true }
			).then((res) => res);
		},

		getReceipt({ dispatch }, { reference, transferMode, reportType = 'pdf', isPeriodic }) {
			const url = `/move-money/transfers/${reference}/document`;
			const method = 'GET';

			return dispatch(
				'service/request',
				{
					service: { request: { url, method } },
					queryParams: { type: 'issued', reportType, mode: transferMode, isPeriodic },
				},
				{ root: true }
			).then(({ data: { content } }) => content);
		},
	},
};
