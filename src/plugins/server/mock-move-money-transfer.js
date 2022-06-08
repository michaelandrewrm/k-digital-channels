import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';
import { decryptAES } from '@modules/secure/cypher';
import validate from './mock-move-money-validate';
import SignedOperation from './mock-signed-operation';

export default async function(schema, request) {
	const { payload } = JSON.parse(request.requestBody);
	const { seed, key, user } = schema.sessions.find(request.requestHeaders.uuid);
	const data = await decryptAES({
		seed,
		key,
		data: payload,
	});

	const {
		origin,
		amount,
		beneficiary,
		reason,
		transferMode,
		date,
		favorite,
		alias,
		scheduled,
		chargeBearer,
	} = data;

	const handler = () => {
		const [today] = new Date().toISOString().split('T');
		const originAccount = user.products.models.find(({ id }) => id === origin);
		const destinationAccount = user.products.models.find(
			({ productNumber: { value } = {} } = {}) => value === beneficiary.account.id
		);
		let deduction = amount.amount;

		if (chargeBearer === 'OUR') {
			deduction += 25;
		} else if (chargeBearer === 'SHA') {
			deduction += 12.5;
		} else {
			deduction += 0;
		}

		// Restamos el importe del balance de la cuenta origen
		// si date es igual a today
		if (date === today) {
			const originBalance = originAccount.balance;
			const originPostedBalance = originAccount.postedBalance;

			const newBalance = {
				amount: originBalance.amount - deduction,
				currency: originBalance.currency,
			};

			const newPostedBalance = {
				amount: originPostedBalance.amount - deduction,
				currency: originPostedBalance.currency,
			};

			originAccount.update({ balance: newBalance, postedBalance: newPostedBalance });
		}

		// Sumamos el importe al balance de la cuenta destino,
		// si la cuenta destino es propia del cliente
		// y date es igual a today
		if (destinationAccount && date === today) {
			const destinationBalance = destinationAccount.balance;
			const destinationPostedBalance = destinationAccount.postedBalance;

			const newBalance = {
				amount: destinationBalance.amount + amount.amount,
				currency: destinationBalance.currency,
			};

			const newPostedBalance = {
				amount: destinationPostedBalance.amount + amount.amount,
				currency: destinationPostedBalance.currency,
			};

			destinationAccount.update({ balance: newBalance, postedBalance: newPostedBalance });
		}

		// Creamos el movimiento en la cuenta origen
		// si date es igual a today
		if (date === today) {
			const isInternal = beneficiary.account.type !== 'IBAN';
			const transferType = isInternal ? 'TRASPASO' : 'TRANSFERENCIA';

			originAccount.createMovement({
				reason: `SU ORDEN DE ${transferType}: ${reason}`,
				amount: {
					amount: -deduction,
					currency: amount.currency,
				},
				balance: { amount: 0, currency: amount.currency },
				valueDate: new Date().toISOString(),
				operationDate: new Date().toISOString(),
				type: { id: 'TRPE', name: transferType },
			});
			originAccount.save();
		}

		// Creamos el movimiento en la cuenta destino
		// si es propia del cliente y date es igual a today.
		if (destinationAccount && date === today) {
			const transferType = 'TRASPASO A SU FAVOR';

			destinationAccount.createMovement({
				reason: `${transferType} : ${reason}`,
				amount,
				balance: { amount: 0, currency: amount.currency },
				valueDate: new Date().toISOString(),
				operationDate: new Date().toISOString(),
				type: { id: 'TRPE', name: transferType },
			});
			destinationAccount.save();
		}

		// Restamos el importe de los límites diarios
		if (transferMode === 'INTERNAL') {
			user.limits.postedInternalAccounts -= amount.amount;
		} else {
			user.limits.postedExternalAccounts -= amount.amount;
		}

		const transferModel = {
			orderer: {
				fromAccount: {
					id: originAccount.id,
					alias: originAccount.alias,
					productNumber: originAccount.productNumber,
				},
			},
			beneficiary: {
				toAccount: {
					productNumber: {
						format: { id: beneficiary.account.type },
						value: beneficiary.account.id,
					},
					bic: beneficiary.account.bic,
					favorite: beneficiary.favorite,
				},
				description: beneficiary?.name,
			},
			reason,
			amount,
			operationDate: date,
			status: { id: 'PAID', name: 'Pagada' },
			transferMode: {
				id: transferMode,
				name: transferMode,
			},
			favorite,
			alias,
			chargeBearer,
		};

		// Las transferencias programadas o periódica
		// no contienen el campo date
		if (scheduled) {
			Object.assign(transferModel, {
				firstExecutionDate: date,
				nextExecutionDate: date,
				endExecutionDate: scheduled.lastExecutionDate,
				periodicity: {
					type: 'PERIODIC',
					frequency: scheduled.frequency,
				},
			});
		} else if (date > today) {
			Object.assign(transferModel, {
				firstExecutionDate: date,
				nextExecutionDate: date,
			});
		} else {
			Object.assign(transferModel, {
				date,
			});
		}

		const transfer = user.createTransfer(transferModel);

		user.save();

		const response = {
			result: { code: '200', info: 'OK' },
			data: { reference: transfer.id },
		};

		const statusCode = faker.random.arrayElement([200, 201]);
		return new Response(statusCode, {}, response);
	};

	return validate(data, user)
		.then(() => {
			return new SignedOperation(schema, handler);
		})
		.catch((result) => {
			return new Response(401, {}, result);
		});
}
