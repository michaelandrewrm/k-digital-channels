import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';
import { decryptAES } from '@modules/secure/cypher';
import SignedOperation from './mock-signed-operation';

function generateBarcodes(amount) {
	const MAX_AMOUNT = 2490;
	const times = Math.ceil(amount / MAX_AMOUNT);
	const barcodes = [];
	const xml = {
		operationId: faker.random.alphaNumeric(26),
		clientId: faker.datatype.number({ min: 999999999, max: 9999999999 }),
		amount: 0,
		issuerName: faker.name.firstName(),
		issuerFirstSurname: faker.name.lastName(),
		issuerSecondSurname: faker.name.lastName(),
		issuerCno: '123',
		issuerPhone: '123456789',
		issuerAddress: 'Calle undefined, XX, Bloque XX, Portal X, Puerta XX',
		issuerZipCode: '12345',
		issuerCity: 'MADRID',
		issuerState: 'MADRID',
		issuerCountry: 'ES',
		issuerDoiType: '1',
		issuerDoiNumber: '12345678ES',
		issuerDoiExpiredDate: faker.date.future().toISOString(),
		issuerDoiCountry: 'ES',
		issuerBirthDate: faker.date.past().toISOString(),
		issuerBirthCountry: 'ES',
		issuerNationality: 'ES',
	};

	if (amount < MAX_AMOUNT) {
		barcodes.push({ ...xml, amount });
	} else {
		let portion = amount;

		for (let i = 1; i < times + 1; i += 1) {
			if (portion > 0) {
				barcodes.push({
					...xml,
					amount: portion > MAX_AMOUNT ? MAX_AMOUNT : portion,
				});
			}

			portion -= MAX_AMOUNT;
		}
	}

	return barcodes;
}

export default async function(schema, request) {
	const { seed, key, user } = schema.sessions.find(request.requestHeaders.uuid);
	const { correosCash } = user;

	if (request.requestBody) {
		const { payload } = JSON.parse(request.requestBody);
		const data = await decryptAES({
			seed,
			key,
			data: payload,
		});

		const { amount, beneficiaryProductNumber } = data;
		const response = {
			detailsCount: 5,
			totalAmount: amount,
			operationDate: new Date().toISOString(),
			beneficiary: {
				productNumber: beneficiaryProductNumber,
				name: `${faker.name.firstName()} ${faker.name.lastName()} ${faker.name.lastName()}`,
			},
			details: generateBarcodes(amount),
		};
		const handler = () => {
			return new Response(200, {}, response);
		};

		return new SignedOperation(schema, handler);
	}

	if (request.method === 'GET') {
		return new Response(200, {}, { data: correosCash.models });
	}
}
