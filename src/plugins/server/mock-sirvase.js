import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';
import { decryptAES } from '@modules/secure/cypher';
import typologies from './sirvase-typologies';

function getFormattedDate() {
	const pastDate = () => faker.date.past();
	const date = new Date(pastDate());
	const day = `0${date.getDate()}`.slice(-2);
	const month = `0${date.getMonth() + 1}`.slice(-2);
	const year = date.getFullYear();
	const hours = `0${date.getHours()}`.slice(-2);
	const minutes = `0${date.getUTCMinutes()}`.slice(-2);

	return `${day}-${month}-${year} ${hours}:${minutes}:00`;
}

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const seed = session?.seed;
	const key = session?.key;
	let user = session?.user;

	if (window.name === 'skyline') {
		[user] = schema.users.all().models.filter(({ documentId }) => documentId === 'A02');
	}

	const { sirvase } = user;

	if (request.url.includes('typology') && request.method === 'GET') {
		return new Response(
			200,
			{},
			{
				data: typologies,
				result: {
					code: 'C200000000',
					info: 'Operación realizada correctamente',
				},
			}
		);
	}

	if (request.method === 'POST') {
		const { payload } = JSON.parse(request.requestBody);
		const data = await decryptAES({ seed, key, data: payload });

		const item = user.createSirvase({
			type: typologies.find(({ id }) => id === data?.type?.id),
			requestDate: getFormattedDate(),
			status: {
				id: '01',
				name_es: 'Solicitada',
				name_en: 'Requested',
			},
			description: data.description,
		});

		return new Response(
			200,
			{},
			{
				data: item,
				result: {
					code: '200',
					info: 'Operation Success',
				},
			}
		);
	}

	if (request.method === 'GET') {
		if (request.params?.requestId) {
			const requestedItem = sirvase.models.find((item) => item.id === request.params.requestId);

			if (!requestedItem) {
				return new Response(400, {});
			}

			return new Response(
				200,
				{},
				{
					data: requestedItem,
					result: {
						code: '200',
						info: 'Operation Success',
					},
				}
			);
		}

		return new Response(
			200,
			{},
			{
				data: sirvase.models,
				result: { code: '200', info: 'Operation Success' },
			}
		);
	}
}
