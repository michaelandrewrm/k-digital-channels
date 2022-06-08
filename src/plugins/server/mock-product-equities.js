import { Response } from 'miragejs';
import { intervenersByTitle } from '@modules/products/product-interveners';
import { typesByTitle } from '@modules/products/product-types';
import { subtypesById } from '@modules/products/product-subtypes';
import { faker } from '@faker-js/faker';
import SignedOperation from './mock-signed-operation';
import caminosEquitiesMock from './mock-product-caminos-equities';

export default async (schema, request) => {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { user } = session;

	if (!request?.params?.productId) {
		return new Response(400, {}, {});
	}

	const product = schema.products.find(request.params.productId);

	if (subtypesById[product.productSubtype.id] === 'caminos-equities') {
		return caminosEquitiesMock(schema, request);
	}

	const allUsers = schema.users.all().models;
	const usu1 = allUsers[faker.datatype.number({ min: 0, max: allUsers.length - 1 })];
	const connectedAccount = user.products.filter(
		({ productType }) => productType.id === typesByTitle.account
	).models[0];

	const model = {
		id: product.id,
		name: product.name,
		productType: product.productType,
		productSubtype: product.productSubtype,
		connectedAccount: connectedAccount.productNumber,
		createDate: product.createDate,
		lastValueDate: product.lastValueDate,
		totalValue: product.totalValue,
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
				id: usu1.id,
				name: usu1.name,
				relationType: {
					id: intervenersByTitle.attorney,
					name: 'attorney',
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
