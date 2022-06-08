import { Response } from 'miragejs';

export default (schema, request) => {
	const { contractId } = request.params;
	let user;

	if (window.name === 'skyline') {
		[user] = schema.users.all().models.filter(({ documentId }) => documentId === 'A02');
	} else {
		const { user: otherUser } = schema.sessions.find(request.requestHeaders.uuid);
		user = otherUser;
	}

	const contract = user.contracts.models.find(({ id }) => id === contractId);
	let response = {};

	if (contract?.id) {
		response = {
			id: contract.id,
			description: contract.description,
			type: contract.type,
		};

		user.update({
			connectedContract: response,
		});
	}

	return new Response(200, {}, response);
};
