import { Response } from 'miragejs';

export default function(schema, request) {
	if (request?.params?.productId && request?.params?.movementId) {
		const product = schema.products.find(request.params.productId);

		const movements = JSON.parse(JSON.stringify(product.movements.models));
		const movement = movements.find(({ id }) => id === request.params.movementId);

		const data = {
			id: movement.id,
			reason: movement.reason,
			impositionAmount: movement.amount,
			typeInterest: '0.8%',
			creationDate: movement.valueDate,
			expirationDate: movement.valueDate,
			nextDate: movement.operationDate,
			countableBalance: movement.balance,
			availableBalance: movement.balance,
			state: { id: '01', name: 'Viva' },
			autoRenewal: true,
		};

		const response = data;

		return new Response(200, {}, response);
	}

	return new Response(400, {}, {});
}
