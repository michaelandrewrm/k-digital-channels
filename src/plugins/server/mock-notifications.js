/* eslint-disable no-unused-vars */
import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';

export default async function(schema, request) {
	const user = schema.users.find(request.params.userId);

	if (request.requestBody) {
		const session = schema.sessions.find(request.requestHeaders.uuid);
		const { seed, key } = session;
		const { payload } = JSON.parse(request.requestBody);
		const data = await decryptAES({
			seed,
			key,
			data: payload,
		});

		user.update({ smsByEmail: data.smsByEmail });
	}

	return new Response(200, {}, { smsByEmail: user.smsByEmail });
}
