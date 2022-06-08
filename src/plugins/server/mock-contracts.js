import { Response } from 'miragejs';

export default (schema, request) => {
	if (window.name === 'skyline') {
		const user = schema.users.all().models.filter(({ documentId }) => documentId === 'A02')[0];

		return new Response(
			200,
			{},
			{
				connectedContract: null,
				contracts: user.contracts.models,
			}
		);
	}

	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { contracts, connectedContract } = session.user;
	const response = {
		connectedContract,
		contracts: contracts.models,
	};

	return new Response(200, {}, response);
};
