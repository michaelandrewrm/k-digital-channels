import { Response } from 'miragejs';

export default async function(schema, request) {
	const spaceId = ~~request?.queryParams?.spaceId;
	const communications = schema.communications.all().models;
	const data = communications.filter(({ space: { id } }) => !spaceId || id === spaceId);
	const response = { data };

	return new Response(200, {}, response);
}
