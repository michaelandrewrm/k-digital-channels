import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';

let count = 0;

export default function(schema, request) {
	const { user } = schema.sessions.find(request.requestHeaders.uuid);

	function inTenMinutesDate() {
		const date = new Date(new Date().getTime() + 10 * 60000);
		const formatDate = `${date.getUTCFullYear()}-${`0${date.getUTCMonth() + 1}`.slice(
			-2
		)}-${`0${date.getUTCDate()}`.slice(-2)} ${`0${date.getHours()}`.slice(
			-2
		)}:${`0${date.getUTCMinutes()}`.slice(-2)}:${`0${date.getUTCSeconds()}`.slice(-2)}:000`;
		return formatDate;
	}

	const date = inTenMinutesDate();

	if (request.method === 'POST') {
		const status = 'PENDING';
		const type = 'REQUEST-SENT';
		const possibleActions = ['CANCEL'];

		const movement = this.create('movement', 'bizum', {
			valueDate: date,
			beneficiary: 'Test',
			amount: 50,
			reason: 'Test Mock',
			status: { name: status },
			type: { name: type },
			possibleActions,
			hasExtraInfo: false,
		});

		user.update({ bizumData: { movements: [...user.bizumData.movements, movement] } });

		return new Response(
			200,
			{},
			{
				data: {
					QR: faker.lorem.words(3),
					expirationDate: date,
					id: faker.datatype.uuid(), // TODO pasar id del movimiento
				},
				result: {
					code: 'C200000000',
					info: 'Operación realizada correctamente',
				},
			}
		);
	}

	if (request.method === 'GET') {
		if (request?.params?.operationId && count < 4) {
			count += 1;
			return new Response(404, {}, {});
		}

		const rand = Math.random();

		if (rand > 0.5 && request?.params?.operationId) {
			count = 0;
			return new Response(
				200,
				{},
				{
					data: {
						status: 'VALIDATED',
						operationType: 'PAGO-PREMIOS',
						reason: 'Pago en apuestas y loterias',
						date,
						amount: {
							amount: '50.00',
							currency: {
								id: 'EUR',
								code: '978',
							},
						},
					},
				}
			);
		}

		if (rand <= 0.5 && request?.params?.operationId) {
			count = 0;

			const dataValues = {
				amount: 50,
				currency: 'EUR',
				destination: 2799,
				origin: 8510,
			};

			const signature = this.create('signature', {
				data: dataValues,
				operationType: 'eCommerce',
				operationDescription: 'lottery',
				signatureDate: date,
				status: 'PENDING',
				userId: user.id,
			});

			user.signatures.models.push(signature);

			return new Response(
				200,
				{},
				{
					data: {
						status: 'PENDING',
						operationType: 'COBRO-APUESTAS',
						reason: 'Pago en apuestas y loterias',
						date,
						amount: {
							amount: '50.00',
							currency: {
								id: 'EUR',
								code: '978',
							},
						},
					},
				}
			);
		}
	}
}
