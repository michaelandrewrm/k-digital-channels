import { Response } from 'miragejs';
import { encryptRSA, getRSAKey, generateAESKey } from '@modules/secure/cypher';
import { faker } from '@faker-js/faker';

export default async (schema, request) => {
	const rawPubKey = request.requestHeaders['public-key'];
	const publicRSAKey = await getRSAKey(rawPubKey);
	const { key, symmetricKey, seed } = await generateAESKey();
	const uuid = `${faker.datatype.uuid()}${+new Date()}`;

	const response = await encryptRSA(publicRSAKey, {
		seed,
		symmetricKey,
		uuid,
	});

	schema.sessions.create({ id: uuid, seed, key });

	return new Response(200, { 'content-type': 'text/plain' }, response);
};
