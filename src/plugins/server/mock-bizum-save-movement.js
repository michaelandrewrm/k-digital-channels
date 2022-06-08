import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';
import SignedOperation from './mock-signed-operation';

export default async function(schema, request) {
	const { payload } = JSON.parse(request.requestBody);
	const { seed, key, user } = schema.sessions.find(request.requestHeaders.uuid);
	const { movementId } = request.params;
	const data = await decryptAES({
		seed,
		key,
		data: payload,
	});

	const movement = user.bizumData.movements.find(({ id }) => id === movementId);

	const { action } = data;

	const handler = () => {
		if (action === 'ACCEPT') {
			movement.status = { name: 'ACCEPTED' };
			movement.possibleActions = [];
		} else if (action === 'CANCEL') {
			movement.status = { name: 'CANCELLED' };
			movement.possibleActions = [];
		} else if (action === 'DENY') {
			movement.status = { name: 'REJECTED' };
			movement.possibleActions = [];
		} else if (action === 'RETURN') {
			movement.status = { name: 'RETURN' };
			movement.possibleActions = [];
		}

		const response = {
			result: {
				code: 'CJ00000',
				info: 'Operacion realizada correctamente',
			},
			data: {},
		};
		return new Response(200, {}, response);
	};
	return new SignedOperation(schema, handler);
}
