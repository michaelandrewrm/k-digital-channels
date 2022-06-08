import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';

export default async function(schema, request) {
	const { payload } = JSON.parse(request.requestBody);
	const { seed, key } = schema.sessions.find(request.requestHeaders.uuid);
	const data = await decryptAES({
		seed,
		key,
		data: payload,
	});

	if (data.review === 'trigger error') {
		return new Response(400);
	}

	return new Response(204);
}
