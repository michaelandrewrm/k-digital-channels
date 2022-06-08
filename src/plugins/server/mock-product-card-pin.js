import { Response } from 'miragejs';
import SignedOperation from './mock-signed-operation';

export default async (schema, request) => {
	if (!request?.params?.productId) {
		return new Response(400, {}, {});
	}

	const product = schema.products.find(request.params.productId);

	const handler = () => {
		return new Response(200, {}, { pin: product.pin });
	};

	return new SignedOperation(schema, handler);
};
