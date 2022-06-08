import { Response } from 'miragejs';

export default async function(schema, request) {
	const id = request.params?.messageId;
	const message = schema.messages.find(id);

	if (!id || !message) {
		return new Response(404);
	}

	message.update({ reviewDate: new Date().toISOString() });

	return new Response(204);
}
