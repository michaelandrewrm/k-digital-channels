import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';

export default async (schema, request) => {
	const { seed, key } = schema.sessions.find(request.requestHeaders.uuid);
	const { payload } = JSON.parse(request.requestBody);
	const data = await decryptAES({ seed, key, data: payload });

	const addressbook = data.addressbook
		.map((contact) => {
			if (contact.phone.length === 12) {
				return {
					phone: contact.phone,
					multimediaCapability: 1,
				};
			}

			return false;
		})
		.filter(Boolean);

	return new Response(200, {}, { data: { addressbook } });
};
