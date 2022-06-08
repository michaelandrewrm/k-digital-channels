import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';
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
		createDate: product.openingDate,
		interveners: [
			{
				id: user.id,
				name: user.name,
				relationType: { id: '01', name: 'Titular' },
			},
		],
		unityQuantity: faker.datatype.number({ min: 1, max: 100000 }),
		unityValue: {
			amount: parseFloat(faker.finance.amount(1, 10000, 9)),
			currency: { id: 'EUR', code: '978' },
		},
		netAssetValue: {
			amount: parseFloat(faker.finance.amount()),
			currency: { id: 'EUR', code: '978' },
		},
		netAssetDate: faker.date.recent().toISOString(),
		balanceContributed: {
			amount: parseFloat(faker.finance.amount()),
			currency: { id: 'EUR', code: '978' },
		},
		costEffectivenessYear: 2.02,
		costEffectivenessPeriod: 1.98,
	};

	const response = model;

	const handler = () => {
		return new Response(200, {}, response);
	};

	return new SignedOperation(schema, handler);
};
