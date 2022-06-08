import { Response } from 'miragejs';
import { intervenersByTitle } from '@modules/products/product-interveners';
import { typesByTitle } from '@modules/products/product-types';
import { faker } from '@faker-js/faker';
import SignedOperation from './mock-signed-operation';

export default async (schema, request) => {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { user } = session;

	const allUsers = schema.users.all().models;
	const usu1 = allUsers[faker.datatype.number({ min: 0, max: allUsers.length - 1 })];

	if (!request?.params?.productId && !request?.params?.assetId) {
		return new Response(400, {}, {});
	}

	const asset = schema.assets.find(request.params.assetId);
	const product = schema.products.find(request.params.productId);
	const connectedAccount = user.products.filter(
		({ productType }) => productType.id === typesByTitle.account
	).models[0];

	const model = {
		id: asset.id,
		name: asset.name,
		isin: asset.isin,
		effectiveValue: asset.effectiveValue,
		liquidationValue: asset.liquidationValue,
		liquidationValueDate: asset.liquidationValueDate,
		unityQuantity: asset.unityQuantity,
		costEffectiveness: asset.costEffectiveness,
		yearCostEffectiveness: asset.yearCostEffectiveness,
		monthCostEffectiveness: asset.monthCostEffectiveness,
		productType: product.productType,
		productSubtype: product.productSubtype,
		connectedAccount: connectedAccount.productNumber,
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
