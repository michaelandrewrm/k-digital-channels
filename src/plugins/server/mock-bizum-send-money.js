import { Response } from 'miragejs';
import { decryptAES } from '@modules/secure/cypher';
import SignedOperation from './mock-signed-operation';

export default async function(schema, request) {
	const { payload } = JSON.parse(request.requestBody);
	const { seed, key, user } = schema.sessions.find(request.requestHeaders.uuid);
	const data = await decryptAES({
		seed,
		key,
		data: payload,
	});

	const { amount, reason, date, issuer, additionalContext } = data;
	let { beneficiary } = data;
	let type;
	let status;
	let possibleActions;
	const multimedia = [];

	if (request.url.includes('send-money')) {
		type = 'SENT';
		status = 'ACCEPTED';
		possibleActions = [];
		if (additionalContext) {
			if (additionalContext.image) {
				multimedia.push({
					type: 'C2CED',
					image: additionalContext.image,
					imageFormat: additionalContext.imageFormat,
				});
			}
			if (additionalContext.text) {
				multimedia.push({
					type: 'C2CED',
					text: additionalContext.text,
				});
			}
		}
	} else if (request.url.includes('request-money')) {
		type = 'REQUEST-SENT';
		status = 'PENDING';
		possibleActions = ['CANCEL'];
		beneficiary = issuer;
		if (additionalContext) {
			if (additionalContext.image) {
				multimedia.push({
					type: 'C2CSD',
					image: additionalContext.image,
					imageFormat: additionalContext.imageFormat,
				});
			}
			if (additionalContext.text) {
				multimedia.push({
					type: 'C2CSD',
					text: additionalContext.text,
				});
			}
		}
	}

	const movement = this.create('movement', 'bizum', {
		valueDate: date,
		beneficiary,
		amount,
		reason,
		status: { name: status },
		type: { name: type },
		possibleActions,
		additionalContext: multimedia,
		hasExtraInfo: Boolean(multimedia.length),
	});

	const handler = () => {
		const response = {
			result: {
				code: 'CJ00000',
				info: 'Operacion realizada correctamente',
			},
			data: {
				beneficiary: {
					name: 'Usuario P. 4000',
					phone: '+3400000004000',
				},
				bizumId: 'cd0fafd2-99a6-4bb3-8360-2ca4c36697c6',
				fee: {
					amount: '0',
					currency: { id: 'EUR', code: '978' },
				},
				totalAmount: {
					amount: amount.amount,
					currency: { id: 'EUR', code: '978' },
				},
			},
		};
		return new Response(200, {}, response);
	};

	if (request.url.includes('accept')) {
		const handlerAndUpdate = () => {
			user.update({ bizumData: { movements: [...user.bizumData.movements, movement] } });
			return handler();
		};

		return new SignedOperation(schema, handlerAndUpdate);
	}
	return handler();
}
