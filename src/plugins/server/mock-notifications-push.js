import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);

	if (request.requestBody) {
		const { seed, key } = session;
		const { payload } = JSON.parse(request.requestBody);

		const data = await decryptAES({
			seed,
			key,
			data: payload,
		});

		session.user.update({ push: data?.activated });

		return new Response(200, {}, { push: Boolean(session.user?.push) });
	}

	return new Response(200, {}, { push: Boolean(session.user?.push) });
}
