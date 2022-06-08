import { Response } from 'miragejs';
import { intervenersByTitle } from '@modules/products/product-interveners';
import { typesByTitle } from '@modules/products/product-types';
import SignedOperation from './mock-signed-operation';

export default async (schema, request) => {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { user } = session;

	if (!request?.params?.productId) {
		return new Response(400, {}, {});
	}

	const product = schema.products.find(request.params.productId);
	const chargeAccount = user.products.filter(
		({ productType }) => productType.id === typesByTitle.account
	).models[0];

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
		],
		chargeAccount: {
			id: chargeAccount.id,
			productNumber: chargeAccount.productNumber,
		},
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
