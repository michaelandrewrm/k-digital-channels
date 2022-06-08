import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';

export default async (schema, request) => {
	if (!request?.params?.productId) {
		return new Response(400, {}, {});
	}

	const { productId } = request.params;
	const { hasReceipts } = schema.products.find(productId);
	let receipts = [];

	if (hasReceipts) {
		receipts = Array.from({ length: 6 }).map((a, i) => ({
			id: i,
			reason: 'Cuota Préstamo',
			date: '2020-03-20',
			pendingAmount: {
				amount: parseFloat(faker.finance.amount()),
				currency: { id: 'EUR', code: '978' },
			},
		}));
	}

	const response = {
		data: receipts,

		paging: {
			hasMorePages: false,
			nextPaginationKey: null,
		},
	};

	return new Response(200, {}, response);
};
