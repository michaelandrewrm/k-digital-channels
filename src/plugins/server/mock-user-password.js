/* eslint-disable */
import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';
import SignedOperation from './mock-signed-operation';

export default async (schema, request) => {
	const { payload } = JSON.parse(request.requestBody);
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { seed, key } = session;
	let user = session.user;
	const data = await decryptAES({ seed, key, data: payload });

	function handler() {
		if (request.method === 'POST') {
			const { document_id } = data;
			user = schema.users.all().models.filter(({ documentId }) => documentId === document_id)[0];

			if (!user) {
				return new Response(404, {}, { errorCode: 'C4040000099' });
			}

			user.createSession({ id: request.requestHeaders.uuid });

			return new Response(200, {}, {});
		}

		if (request.method === 'PUT') {
			const { oldPassword, password } = data;

			if (oldPassword && oldPassword !== '123456') {
				return new Response(404, {}, { errorCode: 'C401000201' });
			}

			user.update({ password });
			user.update({ passwordChange: false });
		}

		return new Response(204);
	}

	return new SignedOperation(schema, handler);
};
