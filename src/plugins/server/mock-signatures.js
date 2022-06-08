import { Response } from 'miragejs';
import SignedOperation from './mock-signed-operation';

export default async function(schema, request) {
	if (window.name === 'skyline') {
		return new Response(
			200,
			{},
			{
				data: [],
				pageNumber: 0,
				pageSize: 0,
				paging: { hasMorePages: false },
				totalElements: 0,
				totalPages: 0,
			}
		);
	}

	const { user } = schema.sessions.find(request.requestHeaders.uuid);
	const { signatures } = user;
	let operations;

	if (request.method === 'GET') {
		if (request.queryParams.status) {
			const types = request.queryParams.status.split('|');
			operations = signatures.models.filter(({ status }) => types.includes(status));
		}

		const { length } = operations;
		const totalPages = Math.ceil(length / 10);

		return new Response(
			200,
			{},
			{
				data: operations,
				pageNumber: 0,
				pageSize: length,
				paging: { hasMorePages: totalPages > 1 },
				totalElements: length,
				totalPages,
			}
		);
	}

	const id = request?.params?.signatureId;
	const { method } = request;

	if (!id) {
		return new Response(400, {}, {});
	}

	const operation = signatures.models.find(({ signatureId }) => signatureId === id);

	if (method === 'PUT' || method === 'PATCH') {
		operation.status = 'SIGNED';
		operation.signatureDate = new Date().toISOString();
	}

	if (method === 'DELETE') {
		operation.status = 'CANCELED';
	}

	const handler = () => {
		signatures.save();
		return new Response(200, {}, { signatureId: id });
	};

	return new SignedOperation(schema, handler);
}
