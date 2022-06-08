import { Response } from 'miragejs';

export default async function(schema, request) {
	const id = request.params?.documentId;
	const document = schema.documents.find(id);

	if (!id || !document) {
		return new Response(404);
	}

	document.update({ reviewDate: new Date().toISOString() });

	return new Response(204);
}
