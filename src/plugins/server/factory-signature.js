import { Factory, trait } from 'miragejs';
import { faker } from '@faker-js/faker';

export default Factory.extend({
	signatureId: () => faker.datatype.uuid(),
	operationType: 'transfer',
	operationDescription: 'transferencia',
	creationDate: faker.date.past(2).toISOString(),
	data: {
		amount: () => parseFloat(faker.finance.amount()),
		currency: 'EUR',
		origin: () => faker.datatype.number(9999),
		destination: () => faker.datatype.number(9999),
	},
	pending: trait({ status: 'PENDING' }),
	signed: trait({
		status: 'SIGNED',
		signatureDate: faker.date.future(2).toISOString(),
	}),
	canceled: trait({ status: 'CANCELED' }),
	expired: trait({ status: 'EXPIRED' }),
});
