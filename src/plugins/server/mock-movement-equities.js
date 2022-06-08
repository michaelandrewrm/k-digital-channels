import { Response } from 'miragejs';

export default function(schema, request) {
	if (request?.params?.productId && request?.params?.movementId) {
		const product = schema.products.find(request.params.productId);

		const movements = JSON.parse(JSON.stringify(product.movements.models));
		const movement = movements.find(({ id }) => id === request.params.movementId);

		const data = {
			id: movement.id,
			reason: movement.reason,
			amount: movement.amount,
			operationDate: movement.operationDate,
			isin: movement.isin,
			name: movement.name,
			unityQuantity: movement.unityQuantity,
			price: movement.price,
			liquidAmount: movement.liquidAmount,
			comisionsRetentions: movement.comisionsRetentions,
		};

		const response = data;

		return new Response(200, {}, response);
	}

	return new Response(400, {}, {});
}
