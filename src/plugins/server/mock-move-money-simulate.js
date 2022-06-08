import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';
import validate from './mock-move-money-validate';

export default async function(schema, request) {
	const { payload } = JSON.parse(request.requestBody);
	const { seed, key, user } = schema.sessions.find(request.requestHeaders.uuid);
	const data = await decryptAES({
		seed,
		key,
		data: payload,
	});

	const {
		amount: { amount },
		transferMode,
		favorite,
		alias,
	} = data;
	const feeExample = 15;
	const expenseExample = 10;
	const isInternational = !['INTERNAL', 'SEPA'].includes(transferMode);
	const fee = isInternational ? feeExample : 0;
	const expense = isInternational ? expenseExample : 0;

	if (favorite && alias) {
		const [favoritesError] = Array.from(user.transfers.models).filter(
			(transfer) => transfer.favorite && transfer.alias === alias
		);
		if (favoritesError) {
			Object.assign(data, { favoritesError });
		}
	}

	const response = {
		fee: {
			amount: fee,
			currency: { id: 'EUR' },
		},

		expense: {
			amount: expense,
			currency: { id: 'EUR' },
		},

		total: {
			amount: amount + fee + expense,
			currency: { id: 'EUR' },
		},
	};

	return validate(data, user)
		.then(() => new Response(200, {}, response))
		.catch((result) => new Response(400, {}, result));
}
