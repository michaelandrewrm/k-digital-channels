import { Response } from 'miragejs';

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { id, name, surname1, surname2, birthdate, email, phone } = session.user;

	const response = {
		userId: id,
		name,
		surname1,
		surname2,
		birthdate,
		email,
		phonePrefix: '+34',
		phone,
	};

	return new Response(200, {}, response);
}
