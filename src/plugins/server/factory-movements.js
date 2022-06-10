import { Factory, trait } from 'miragejs';
import { faker } from '@faker-js/faker';

faker.seed(1);

const balanceGenerator = {
	balance: { amount: 0, currency: { id: 'EUR' } },
};

const fundFields = {
	reason: () => 'Suscripción',
	effectiveValue: {
		amount: () => parseFloat(faker.finance.amount()),
		currency: { id: 'EUR' },
	},
	isin: () => faker.finance.bic(),
	name: () => faker.company.companyName(),
	liquidationValue: {
		amount: () => parseFloat(faker.finance.amount()),
		currency: { id: 'EUR' },
	},
	unityQuantity: () => faker.datatype.number({ min: 1, max: 100000 }),
};

const inversisFundFields = {
	type: () => ({ name: 'Suscripción' }),
	amount: {
		amount: () => parseFloat(faker.finance.amount()),
		currency: { id: 'EUR' },
	},
	isin: () => ({ id: faker.finance.bic(), name: faker.company.companyName() }),
	titles: () => faker.datatype.number({ min: 1, max: 100000 }),
};

export default Factory.extend({
	'reason': () => faker.lorem.words(4),
	'amount': {
		amount: () => parseFloat(faker.finance.amount()) * -1,
		currency: { id: 'EUR' },
	},
	'valueDate': () => faker.date.past(0.4, '2022-00-00'),
	'operationDate': () => faker.date.past(0.3, '2022-00-00'),
	'type': {
		id: () => faker.random.arrayElement(['RZ', 'RB', 'TRPE', 'TR', 'TF', 'RQ', 'TP', 'XO']),
		name: faker.lorem.words(2),
	},
	'avoidable': () => faker.datatype.boolean(),
	'movementCoreId': () => faker.finance.bic(),
	'comment': {
		commentId: () => faker.finance.bic(),
		comment: () => faker.lorem.words(20),
	},
	'checking-account': trait(balanceGenerator),
	'account': trait(balanceGenerator),
	'remittance': trait(balanceGenerator),
	'currency-account': trait({}),
	'junior-account': trait(balanceGenerator),
	'support-account': trait(balanceGenerator),
	'hefame-account': trait(balanceGenerator),
	'managed-account': trait(balanceGenerator),
	'managed-currency-account': trait(balanceGenerator),
	'debit-card': trait({}),
	'credit-card': trait({}),
	'business-debit-card': trait({}),
	'business-credit-card': trait({}),
	'term-deposit': trait({
		amount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		state: {
			id: '00',
			name: 'Cancelada',
		},
	}),
	'deposit': trait({
		amount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		state: {
			id: '00',
			name: 'Cancelada',
		},
	}),
	'demand-deposit': trait(balanceGenerator),
	'currency-deposit': trait({}),
	'advised-fund': trait(fundFields),
	'commercialized-fund': trait(fundFields),
	'delegated-fund': trait(fundFields),
	'pension-plan': trait({
		unityQuantity: faker.datatype.number({ min: 1, max: 100000 }),
		unityValue: {
			amount: () => parseFloat(faker.finance.amount(1, 10000, 9)),
			currency: { id: 'EUR' },
		},
	}),
	'shares': trait({}),
	'securities-account': trait({
		reason: () => faker.finance.transactionType(),
		unityQuantity: () => faker.datatype.number({ min: 1, max: 100000 }),
		isin: () => faker.finance.bic(),
		name: () => faker.company.companyName(),
		price: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		liquidAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		commissionsRetentions: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
	}),
	'loan-var': trait({
		type: () => faker.lorem.words(4),
	}),
	'loan-fixed': trait({
		type: () => faker.lorem.words(4),
	}),
	'loan-mix': trait({
		type: () => faker.lorem.words(4),
	}),
	'tpv': trait({}),
	'guarantee-policy-fixed': trait(balanceGenerator),
	'guarantee-policy-var': trait(balanceGenerator),
	'discount-line': trait({}),
	'subscription': trait({}),
	'pending-movements': trait({
		originFund: { id: () => faker.finance.bic(), name: () => faker.finance.bic() },
	}),
	'investment-account-rto': trait(inversisFundFields),
	'investment-pension-plan': trait(inversisFundFields),
	'bizum': trait({
		valueDate: () => faker.date.recent(2),
		sender: {
			name: () => faker.name.findName(),
			phone: () => faker.phone.phoneNumber(),
			account: () => faker.finance.iban(),
		},
		beneficiary: { name: () => faker.name.findName(), phone: () => faker.phone.phoneNumber() },
		amount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		reason: () => faker.lorem.words(4),
		status: () =>
			faker.random.arrayElement([
				{ name: 'PENDING' },
				{ name: 'ACCEPTED' },
				{ name: 'REJECTED' },
				{ name: 'RETURN' },
				{ name: 'CANCELLED' },
				{ name: 'ERROR' },
				{ name: 'DENIED' },
				{ name: 'EXPIRED' },
			]),
		type: () =>
			faker.random.arrayElement([
				{ name: 'SENT' },
				{ name: 'RECEIVED' },
				{ name: 'REQUEST-SENT' },
				{ name: 'REQUEST-RECEIVED' },
			]),
		hasExtraInfo: false,
		possibleActions: ['ACCEPT', 'DENY', 'RETURN', 'CANCEL'],
	}),
});
