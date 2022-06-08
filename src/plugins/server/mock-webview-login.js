import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { seed, key } = session;
	const { payload } = JSON.parse(request.requestBody);

	const data = await decryptAES({
		seed,
		key,
		data: payload,
	});

	if (!data.tokenwebview) {
		return new Response(406, {});
	}

	const user = schema.users.findBy({ documentId: data.tokenwebview });

	user.update({ session });

	sessionStorage.setItem(
		'secure',
		JSON.stringify({
			rememberToken: user.rememberToken,
			password: user.authToken,
		})
	);

	return new Response(201);
}
