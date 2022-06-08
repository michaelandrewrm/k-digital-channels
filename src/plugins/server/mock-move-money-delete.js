import { Response } from 'miragejs';
import SignedOperation from './mock-signed-operation';

export default async function(schema, request) {
	if (request?.params?.transferId) {
		const model = schema.transfers.find(request.params.transferId);
		const handler = () => {
			model.destroy();
			return new Response(200, {});
		};
		if (model.favorite) {
			return handler();
		}
		return new SignedOperation(schema, handler);
	}
	return new Response(401, {}, {});
}
