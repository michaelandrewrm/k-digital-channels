import { Response } from 'miragejs';
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
		productType: product.productType,
		productSubtype: product.productSubtype,
		productNumber: product.productNumber,
		expirationDate: product.expirationDate,
		cvv: product.cvv,
		pin: product.pin,
		openingDate: product.registerDate,
		lastUseDate: product.lastUseDate,
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
