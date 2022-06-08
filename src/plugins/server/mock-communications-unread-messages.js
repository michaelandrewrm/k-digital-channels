import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { user } = session;

	if (!user.messages.models.length) {
		const messages = this.createList('message', faker.datatype.number({ min: 15, max: 50 })).sort(
			({ creationDate: a }, { creationDate: b }) => new Date(b) - new Date(a)
		);
		user.update({ messages });
	}

	const unreadMessages = user.messages.models.reduce(
		(reducer, { reviewDate }) => reducer + !reviewDate,
		0
	);
	const response = { unreadMessages };

	return new Response(200, {}, response);
}
