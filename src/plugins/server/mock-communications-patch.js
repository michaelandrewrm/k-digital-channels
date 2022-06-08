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

	const id = request.params?.communicationId;
	const communication = schema.communications.find(id);

	if (!id || !communication) {
		return new Response(404);
	}

	communication.update({ ...data });

	return new Response(204);
}
