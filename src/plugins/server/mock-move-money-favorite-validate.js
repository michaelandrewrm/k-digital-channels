import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';

export default async function(schema, request) {
	const { alias, transferMode } = request.queryParams;
	const { user } = schema.sessions.find(request.requestHeaders.uuid);

	const favorites = Array.from(user.transfers.models);

	const [favoriteTransfer] = favorites.filter(
		({ favorite, alias: tAlias }) => favorite && tAlias === alias
	);

	let errorCode;

	if (favoriteTransfer) {
		errorCode = 'C400000303';
	}

	if (alias.length > 25) {
		errorCode = 'C400000322';
	}

	if (!transferMode) {
		errorCode = 'C400000321';
	}

	if (errorCode) {
		return new Response(401, {}, { errorCode });
	}

	return new Response(200, {}, { reference: faker.datatype.uuid() });
}
