import { Response } from 'miragejs';
import { intervenersByTitle } from '@modules/products/product-interveners';
import SignedOperation from './mock-signed-operation';

export default async (schema, request) => {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { user } = session;

	if (!request?.params?.productId) {
		return new Response(400, {}, {});
	}

	const product = schema.products.find(request.params.productId);
	const model = {
		id: product.id,
		name: product.name,
		alias: product.alias,
		productType: product.productType,
		productSubtype: product.productSubtype,
		productNumber: product.productNumber,
		createDate: product.createDate,
		interveners: [
			{
				id: user.id,
				name: user.name,
				relationType: {
					id: intervenersByTitle.holder,
					name: 'holder',
				},
			},
		],
	};

	const response = model;

	const handler = () => {
		user.update({ sca: true });
		return new Response(200, {}, response);
	};

	if (user.sca) {
		return handler();
	}

	return new SignedOperation(schema, handler);
};
