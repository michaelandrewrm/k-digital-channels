import { Response } from 'miragejs';

export default async function(schema, request) {
	if (request?.params?.productId) {
		const product = schema.products.find(request.params.productId);

		const response = { data: product.assets.models };

		return new Response(200, {}, response);
	}

	return new Response(400, {}, {});
}
