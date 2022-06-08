import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';
import SignedOperation from './mock-signed-operation';

export default async (schema, request) => {
	const { seed, key, user } = schema.sessions.find(request.requestHeaders.uuid);

	if (request.method === 'GET') {
		if (user.bizum === true) {
			user.update({ bizum: user.products.models[0].id });
		}

		const product = user.products.models.find(({ id }) => id === user.bizum);

		return new Response(200, {}, { product });
	}
	const { payload } = JSON.parse(request.requestBody);
	const data = await decryptAES({
		seed,
		key,
		data: payload,
	});

	const handler = () => {
		if (user.documentId === 'D03') {
			return new Response(406);
		}

		user.update({ bizum: data.productId });

		return new Response(204);
	};

	return new SignedOperation(schema, handler);
};
