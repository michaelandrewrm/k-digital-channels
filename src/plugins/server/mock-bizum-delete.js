import { Response } from 'miragejs';
import SignedOperation from './mock-signed-operation';

export default async (schema, request) => {
	const { user } = schema.sessions.find(request.requestHeaders.uuid);

	const handler = () => {
		user.update({ bizum: null });

		return new Response(204);
	};

	return new SignedOperation(schema, handler);
};
