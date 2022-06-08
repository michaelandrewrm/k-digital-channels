import { Response } from 'miragejs';

export default async (schema, request) => {
	if (!request?.params?.productId) {
		return new Response(400, {}, {});
	}

	const products = schema.products
		.find(request.params.productId)
		.products.models.map((product) => ({
			id: product.id,
			name: product.name,
			alias: product.alias,
			productType: product.productType,
			productSubtype: product.productSubtype,
			relationType: product.relationType,
			balance: product.balance,
			postedBalance: product.postedBalance,
			limitAmount: product.limitAmount,
			productNumber: product.productNumber
				? { format: product.productNumber.format, value: product.productNumber.value.substr(-4) }
				: null,
			assets: product.assetIds
				? product.assetIds.map((id) => JSON.parse(JSON.stringify(schema.assets.find(id))))
				: null,
			profiles: product.profiles,
		}));

	const response = { data: products };

	const handler = () => {
		return new Response(200, {}, response);
	};

	return handler();
};
