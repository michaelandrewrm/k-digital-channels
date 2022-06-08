import { Response } from 'miragejs';

export default async (schema, request) => {
	if (!request?.params?.productId) {
		return new Response(400, {}, {});
	}

	const product = schema.products.find(request.params.productId);

	const common = {
		id: product.id,
		name: product.name,
		alias: product.alias,
		productType: product.productType,
		productSubtype: product.productSubtype,
	};

	const caminosEquitiesModel = {
		...common,
		unityQuantity: product.unityQuantity,
		unityValue: product.unityValue,
		lastValueDate: product.lastValueDate,
		totalValue: product.totalValue,
		effectiveUnityValue: product.effectiveUnityValue,
	};

	const endorsementModel = {
		...common,
		guarantyId: product.guarantyId,
		guarantyAmount: product.guarantyAmount,
		startingAmount: product.startingAmount,
		outstandingAmount: product.outstandingAmount,
	};

	const model = product.productType.id === '08' ? endorsementModel : caminosEquitiesModel;

	const response = model;

	const handler = () => {
		return new Response(200, {}, response);
	};

	return handler();
};
