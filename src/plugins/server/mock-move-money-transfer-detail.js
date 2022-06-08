import { Response } from 'miragejs';

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { transferId } = request.queryParams;
	const { user } = session;
	const [transfer] = user.transfers.models.filter(({ id }) => id === transferId);
	const response = {
		result: {
			code: '200',
			info: 'OK',
		},
		data: transfer,
	};

	return new Response(200, {}, response);
}
