import { Response } from 'miragejs';

export default async (schema, request) => {
	if (request?.params?.productId) {
		return new Response(200, {}, {});
	}

	return new Response(404, {}, {});
};
