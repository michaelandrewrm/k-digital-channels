import { Factory, trait } from 'miragejs';
import { faker } from '@faker-js/faker';
import frequencyTypes from '@modules/move-money/frequency-types';

const randomPastDate = () =>
	faker.date
		.past()
		.toISOString()
		.split('T')[0];

const randomFutureDate = () =>
	faker.date
		.future()
		.toISOString()
		.split('T')[0];

let bic;

const amount = {
	amount: () => parseFloat(faker.finance.amount()),
	currency: { id: 'EUR' },
};

export default Factory.extend({
	reference: () => faker.datatype.uuid(),
	beneficiary: {
		toAccount: {
			productNumber: {
				format: { id: 'IBAN' },
				value: () => {
					const iban = faker.finance.iban();
					bic = `BANK${iban.slice(0, 2)}XXXXX`;
					return iban;
				},
			},
			bic: () => bic,
		},
		description: () => faker.name.findName(),
	},
	transferMode: { id: 'SEPA', name: 'SEPA' },
	reason: () => faker.lorem.sentence().replace('.', ''),
	amount: {
		amount: () => parseFloat(faker.finance.amount()),
		currency: { id: () => faker.random.arrayElement(['EUR', 'EUR', 'EUR', 'USD']) },
	},
	date: randomPastDate,
	operationDate: randomPastDate,
	status: {
		id: () => faker.random.arrayElement(['PAID', 'AUTHORIZED', 'REJECTED', 'RETURNED']),
	},

	favorite: trait({
		alias: () => faker.lorem.sentence(3),
		favorite: true,
		amount,
	}),

	scheduled: trait({
		nextExecutionDate: randomFutureDate,
		amount,
	}),

	periodic: trait({
		periodicity: {
			type: 'PERIODIC',
			firstExecutionDate: randomPastDate,
			frequency: faker.random.arrayElement(Object.keys(frequencyTypes)),
		},
		endExecutionDate: randomFutureDate,
		nextExecutionDate: randomFutureDate,
		amount,
	}),

	unknown: trait({
		beneficiary: {
			toAccount: {
				productNumber: {
					format: { id: 'UNKNOWN' },
					value: () => faker.finance.account(),
				},
				bic: () => faker.finance.bic(),
			},
			description: () => faker.name.findName(),
		},
		amount,
	}),

	isCancellable: () => faker.datatype.boolean(),
});
