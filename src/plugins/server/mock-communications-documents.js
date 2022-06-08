import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const paginationKey = request?.queryParams?.paginationKey;
	const { user } = session;
	const CHUNK_LENGTH = 10;

	if (!user.documents.models.length) {
		const documents = this.createList('document', faker.datatype.number({ min: 15, max: 50 }));
		user.update({ documents });
	}

	const documents = user.documents.sort(
		({ creationDate: a }, { creationDate: b }) => new Date(b) - new Date(a)
	);

	const indexPagKey = documents.models.findIndex(({ id }) => paginationKey === id);
	const index = indexPagKey === -1 ? 0 : indexPagKey;
	const part = documents.models.slice(index, index + CHUNK_LENGTH);
	const nextPaginationKey = documents.models[index + CHUNK_LENGTH]?.id;

	const response = {
		data: part,
		paging: {
			hasMorePages: Boolean(nextPaginationKey),
			nextPaginationKey,
		},
	};

	return new Response(200, {}, response);
}
