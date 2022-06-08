import { Factory, trait } from 'miragejs';
import { faker } from '@faker-js/faker';

const equity = {
	id: () => faker.finance.bic(),
	isin: () => faker.finance.bic(),
	name: () => faker.company.companyName(),
	unityQuantity: () => faker.datatype.number({ min: 1, max: 100000 }),
	market: () => faker.company.bs(),
	lastValueDate: () => faker.date.recent().toISOString(),
	totalValue: {
		amount: () => parseFloat(faker.finance.amount()),
		currency: { id: 'EUR', code: '978' },
	},
	lastTotalValue: {
		amount: () => parseFloat(faker.finance.amount()),
		currency: { id: 'EUR', code: '978' },
	},
	blockedTitles: () => faker.datatype.number({ min: 0, max: 100 }),
	profiles: [],
};

const fund = {
	costEffectiveness: () => faker.finance.amount(1, 10, 5),
	effectiveValue: {
		amount: () => parseFloat(faker.finance.amount()),
		currency: { id: 'EUR', code: '978' },
	},
	id: () => faker.datatype.uuid(),
	isin: () => faker.finance.bic(),
	name: () => faker.company.companyName(),
	liquidationValue: {
		amount: () => parseFloat(faker.finance.amount()),
		currency: { id: 'EUR', code: '978' },
	},
	liquidationValueDate: () => faker.date.recent().toISOString(),
	monthCostEffectiveness: () => faker.finance.amount(1, 100, 5),
	unityQuantity: () => faker.finance.amount(1, 100, 5),
	yearCostEffectiveness: () => faker.finance.amount(1, 100, 5),
	profiles: [],
};

const investment = {
	isin: () => faker.finance.bic(),
	isinDescription: () => faker.company.companyName(),
	availableTitles: () => faker.datatype.number({ min: 1, max: 100 }),
	blockedTitles: () => faker.datatype.number({ min: 0, max: 100 }),
	averageCost: {
		amount: () => parseFloat(faker.finance.amount()),
		currency: { id: 'EUR', code: '978' },
	},
	marketPrice: {
		amount: () => parseFloat(faker.finance.amount()),
		currency: { id: 'EUR', code: '978' },
	},
	equivalentEur: () => faker.finance.amount(),
	plusMinus: {
		amount: () => parseFloat(faker.finance.amount()),
		currency: { id: 'EUR', code: '978' },
	},
	portfolioPercentage: () => faker.datatype.number({ min: 0, max: 1, precision: 0.01 }),
	productTypeCode: () => faker.random.arrayElement(['RV', 'RF', 'IIC', 'PLP']),
	profiles: [],
};

export default Factory.extend({
	'securities-account': trait(equity),

	'advised-fund': trait(fund),

	'commercialized-fund': trait(fund),

	'delegated-fund': trait(fund),

	'investment-account-rto': trait(investment),

	'investment-account-advised': trait(investment),

	'investment-pension-plan': trait(investment),
});
