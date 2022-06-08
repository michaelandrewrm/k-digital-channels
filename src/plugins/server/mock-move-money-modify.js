import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';
import { decryptAES } from '@modules/secure/cypher';
import validate from './mock-move-money-validate';
import SignedOperation from './mock-signed-operation';

export default async function(schema, request) {
	if (!request?.params?.transferId) {
		return new Response(401, {}, {});
	}

	const { payload } = JSON.parse(request.requestBody);
	const { seed, key, user } = schema.sessions.find(request.requestHeaders.uuid);
	const data = await decryptAES({
		seed,
		key,
		data: payload,
	});

	const handler = () => {
		const model = schema.transfers.find(request.params.transferId);
		const { amount, date, scheduled, reason, transferMode } = data;
		let periodicity;

		const beneficiary = {
			toAccount: {
				productNumber: {
					format: { id: data.beneficiary.account.type },
					value: data.beneficiary.account.id,
				},
				bic: data.beneficiary.account.bic,
			},
			description: data.beneficiary?.name,
		};

		if (scheduled?.frequency) {
			periodicity = {
				type: 'PERIODIC',
				firstExecutionDate: date,
				frequency: scheduled.frequency,
			};
		}

		model.update({
			beneficiary,
			amount,
			date,
			nextExecutionDate: date,
			endExecutionDate: scheduled?.lastExecutionDate,
			periodicity,
			reason,
			transferMode: {
				id: transferMode,
				name: transferMode,
			},
		});

		const statusCode = faker.random.arrayElement([200, 201]);
		return new Response(statusCode, {});
	};

	return validate(data, user)
		.then(() => {
			return new SignedOperation(schema, handler);
		})
		.catch((result) => {
			return new Response(401, {}, result);
		});
}
