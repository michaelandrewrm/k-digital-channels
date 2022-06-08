import { Response } from 'miragejs';

export default async (schema, request) => {
	let user;

	if (window.name === 'skyline') {
		[user] = schema.users.all().models.filter(({ documentId }) => documentId === 'A02');
	} else {
		const { user: otherUser } = schema.sessions.find(request.requestHeaders.uuid);
		user = otherUser;
	}

	if (user.bizum) {
		return new Response(204, {});
	}

	return new Response(404, {});
};
