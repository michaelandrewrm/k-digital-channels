import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';

export default async (schema, request) => {
	if (!request?.params?.productId) {
		return new Response(400, {}, {});
	}

	const response = {
		elements: Array.from({ length: 12 }).map((a, i) => ({
			number: i,
			date: '2014-10-30',
			amount: {
				amount: parseFloat(faker.finance.amount()),
				currency: { id: 'EUR', code: '978' },
			},
			pendingAmount: {
				amount: parseFloat(faker.finance.amount()),
				currency: { id: 'EUR', code: '978' },
			},
			interest: {
				amount: parseFloat(faker.finance.amount()),
				currency: { id: 'EUR', code: '978' },
			},
			installment: {
				amount: parseFloat(faker.finance.amount()),
				currency: { id: 'EUR', code: '978' },
			},
		})),

		tae: 5.5,

		totalAmount: {
			amount: parseFloat(faker.finance.amount()),
			currency: { id: 'EUR', code: '978' },
		},

		totalInterest: {
			amount: parseFloat(faker.finance.amount()),
			currency: { id: 'EUR', code: '978' },
		},

		totalInstallment: {
			amount: parseFloat(faker.finance.amount()),
			currency: { id: 'EUR', code: '978' },
		},
	};

	return new Response(200, {}, response);
};
