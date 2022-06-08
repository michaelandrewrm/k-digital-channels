import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';

faker.seed(1);

const resources = Array.from({ length: 300 })
	.map((a, index) => {
		return {
			id: `+999999999${index.toString().padStart(5, '0')}`,
			type: 'ONG',
			name: faker.company.companyName(),
			alias: faker.company.companyName(),
			email: faker.internet.email(),
		};
	})
	.sort(({ name }, b) => name.localeCompare(b.name));

export default async function(schema, request) {
	const CHUNK_LENGTH = 10;
	const paginationKey = request?.queryParams?.paginationKey;
	const queryName = request?.queryParams?.name;

	const filteredResources = resources.filter(({ name }) => {
		const matchedName = Boolean(name.match(queryName)?.length);

		return !queryName ? true : matchedName;
	});

	const indexPagKey = filteredResources.findIndex(({ id }) => paginationKey === id);
	const index = indexPagKey === -1 ? 0 : indexPagKey;
	const part = filteredResources.slice(index, index + CHUNK_LENGTH);
	const nextPaginationKey = filteredResources[index + CHUNK_LENGTH]?.id;

	const result = {
		result: { code: '200', info: 'Operation Success' },
		data: part,
		paging: {
			hasMorePages: Boolean(nextPaginationKey),
			nextPaginationKey,
		},
	};

	return new Response(200, {}, result);
}
