import { Response } from 'miragejs';

export default function(schema, request) {
	if (request?.params?.productId && request?.params?.movementId) {
		const product = schema.products.find(request.params.productId);

		const movements = JSON.parse(JSON.stringify(product.movements.models));
		const movement = movements.find(({ id }) => id === request.params.movementId);

		const data = {
			amount: movement.amount,
			effectiveValue: movement.effectiveValue,
			id: movement.id,
			isin: movement.isin,
			name: movement.name,
			liquidationValue: movement.liquidationValue,
			operationDate: movement.operationDate,
			reason: movement.reason,
			unityQuantity: movement.unityQuantity,
		};

		const response = data;

		return new Response(200, {}, response);
	}

	return new Response(400, {}, {});
}
