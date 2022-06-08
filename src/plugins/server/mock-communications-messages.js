import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const paginationKey = request?.queryParams?.paginationKey;
	const { user } = session;
	const CHUNK_LENGTH = 10;

	if (!user.messages.models.length) {
		const messages = this.createList('message', faker.datatype.number({ min: 15, max: 50 })).sort(
			({ creationDate: a }, { creationDate: b }) => new Date(b) - new Date(a)
		);
		user.update({ messages });
	}

	const { messages } = user;
	const indexPagKey = messages.models.findIndex(({ id }) => paginationKey === id);
	const index = indexPagKey === -1 ? 0 : indexPagKey;
	const part = messages.models.slice(index, index + CHUNK_LENGTH);
	const nextPaginationKey = messages.models[index + CHUNK_LENGTH]?.id;

	const response = {
		data: part,
		paging: {
			hasMorePages: Boolean(nextPaginationKey),
			nextPaginationKey,
		},
	};

	return new Response(200, {}, response);
}
