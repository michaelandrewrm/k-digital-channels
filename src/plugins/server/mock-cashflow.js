import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';

const randomBalance = () => faker.datatype.number({ min: 10000, max: 12000 });

export default async function() {
	const today = new Date();
	let balance = randomBalance();
	const data = Array.from({ length: 13 })
		.map((v, index) => {
			const year = today.getFullYear();
			const month = today.getMonth() + 1;
			const day = 0;

			const date = new Date(year, month - index, day);
			const income = faker.datatype.number({ min: 2200, max: 2500 });
			const outcome = faker.datatype.number({ min: 500, max: 3500 });

			balance += income;
			balance -= outcome;

			return {
				date: date.toISOString(),
				outcomeAmount: {
					amount: outcome,
					currency: { id: 'EUR', code: '978' },
				},
				incomeAmount: {
					amount: income,
					currency: { id: 'EUR', code: '978' },
				},
				balance: {
					amount: balance,
					currency: { id: 'EUR', code: '978' },
				},
			};
		})
		.reverse();

	const response = { data };

	return new Response(200, {}, response);
}
