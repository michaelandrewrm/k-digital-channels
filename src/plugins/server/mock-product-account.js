import { Response } from 'miragejs';
import { intervenersByTitle } from '@modules/products/product-interveners';
import SignedOperation from './mock-signed-operation';

export default async (schema, request) => {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { user } = session;

	const usersModel = schema.users.all().models;
	const user1 = usersModel[0];
	const user2 = usersModel[1];

	if (!request?.params?.productId) {
		return new Response(400, {}, {});
	}

	const product = schema.products.find(request.params.productId);
	const model = {
		id: product.id,
		name: product.name,
		alias: product.alias,
		bic: product.bic,
		productType: product.productType,
		productSubtype: product.productSubtype,
		productNumber: product.productNumber,
		openingDate: product.openingDate,
		lastMovementDate: product.lastMovementDate,
		interveners: [
			{
				id: user.id,
				name: user.name,
				relationType: {
					id: intervenersByTitle.holder,
					name: 'holder',
				},
			},
			{
				id: user1.id,
				name: user1.name,
				relationType: {
					id: intervenersByTitle.usufructuary,
					name: 'usufructuary',
				},
			},
			{
				id: user2.id,
				name: user2.name,
				relationType: {
					id: intervenersByTitle.usufructuary,
					name: 'usufructuary',
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
