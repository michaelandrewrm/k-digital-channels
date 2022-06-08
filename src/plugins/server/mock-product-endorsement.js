import { Response } from 'miragejs';
import { intervenersByTitle } from '@modules/products/product-interveners';
import { faker } from '@faker-js/faker';
import SignedOperation from './mock-signed-operation';

export default async (schema, request) => {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { user } = session;

	const allUsers = schema.users.all().models;
	const usu1 = allUsers[faker.datatype.number({ min: 0, max: allUsers.length - 1 })];
	const usu2 = allUsers[faker.datatype.number({ min: 0, max: allUsers.length - 1 })];

	if (!request?.params?.productId) {
		return new Response(400, {}, {});
	}

	const product = schema.products.find(request.params.productId);
	const model = {
		id: product.id,
		name: product.name,
		alias: product.alias,
		connectedAccount: product.productNumber,
		productNumber: product.productNumber,
		guarantyId: product.guarantyId,
		guarantyAmount: {
			amount: parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		startingAmount: {
			amount: parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		outstandingAmount: {
			amount: parseFloat(faker.finance.amount()) * -1,
			currency: { id: 'EUR' },
		},
		startDate: faker.date.past().toISOString(),
		expiryDate: faker.date.future().toISOString(),
		endDate: faker.date.future().toISOString(),
		productType: product.productType,
		productSubtype: product.productSubtype,
		status: product.status,
		signature: product.signature,
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
					id: intervenersByTitle.authorized,
					name: 'authorized',
				},
			},
			{
				id: usu2.id,
				name: usu2.name,
				relationType: {
					id: intervenersByTitle.authorized,
					name: 'authorized',
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
