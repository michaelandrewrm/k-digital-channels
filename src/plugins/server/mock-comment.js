/* eslint-disable no-unused-vars */
import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';

export default async function(schema, request) {
	const { seed, key } = schema.sessions.find(request.requestHeaders.uuid);
	const movements = schema.movements.all();

	if (request.method === 'DELETE') {
		const commentId = request.params?.commentId;
		const movement = movements.models.find(({ comment }) => comment.commentId === commentId);

		movement.update('comment', { ...movement.comment, comment: '' });

		return new Response(200, {}, { ...movement.comment });
	}

	const { payload } = JSON.parse(request.requestBody);
	const data = await decryptAES({ seed, key, data: payload });

	if (request.method === 'PUT') {
		const commentId = request.params?.commentId;
		const movement = movements.models.find(({ comment }) => comment.commentId === commentId);

		movement.update('comment', { ...movement.comment, comment: data.comment });

		return new Response(200, {}, {});
	}

	if (request.method === 'POST') {
		const movementId = request.params?.movementId;
		const movement = movements.models.find(({ id }) => id === movementId);

		movement.update('comment', { ...movement.comment, comment: data.comment });

		return new Response(200, {}, { ...movement.comment });
	}

	return new Response(404, {}, {});
}
