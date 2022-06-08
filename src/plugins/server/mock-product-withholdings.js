import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';

export default async (schema, request) => {
	if (!request?.params?.productId) {
		return new Response(400, {}, {});
	}

	const { productId } = request.params;
	const { hasWithholdings } = schema.products.find(productId);
	let withholdings = [];

	if (hasWithholdings) {
		const randomNumber = () => faker.datatype.number({ min: 1, max: 10 });
		const randomUUID = () => faker.datatype.uuid();
		const randomAmount = () => parseFloat(faker.finance.amount()) * -1;
		const randomDate = () => faker.date.past().toISOString();

		withholdings = Array.from({ length: randomNumber() }).map(() => ({
			id: randomUUID(),
			reason: 'Traspaso',
			amount: {
				amount: randomAmount(),
				currency: { id: 'EUR', code: '978' },
			},
			operationDate: randomDate(),
		}));
	}

	const response = { data: withholdings };

	return new Response(200, {}, response);
};
