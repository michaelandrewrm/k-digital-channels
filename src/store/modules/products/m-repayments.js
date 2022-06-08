import serviceProducts from '@services/s-products';

export default {
	namespaced: true,

	actions: {
		get({ dispatch }, productId) {
			const id = `${productId}/repayments`;
			const params = { id };

			return dispatch(
				'service/request',
				{
					service: serviceProducts,
					params,
				},
				{ root: true }
			)
				.then(({ data }) => JSON.parse(JSON.stringify(data)))
				.catch(() => {});
		},
	},
};
