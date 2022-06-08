import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';
import { decryptAES } from '@modules/secure/cypher';
import { subtypesById } from '@modules/products/product-subtypes';
import productFamilies from '@modules/products/product-families';

export default async function(schema, request) {
	const { seed, key, user } = schema.sessions.find(request.requestHeaders.uuid);
	const { products } = user;
	const families = Object.entries(productFamilies);
	const response = { data: [] };
	const validFamilies = [
		'account',
		'hefame-account',
		'currency-account',
		'debit-card',
		'credit-card',
	];

	if (request.method === 'GET' && request.url.endsWith('/movements')) {
		response.data = products.models.map((product) => {
			let movements = [];
			const subtype = subtypesById[(product.productSubtype?.id)];
			const [productFamily] = families.find(([, group]) => group.includes(subtype)) || [null];

			if (validFamilies.includes(productFamily) && product.onTime) {
				const randomNumber = faker.datatype.number({ min: 0, max: 10 });
				movements = this.createList('movement', randomNumber, subtype);
			}

			return { productId: product.id, movements };
		});
	}

	if (request.method === 'GET' && !request.url.endsWith('/movements')) {
		response.data = products.models.filter(({ productSubtype }) => {
			const subtype = subtypesById[(productSubtype?.id)];
			const [productFamily] = families.find(([, group]) => group.includes(subtype)) || [null];

			return validFamilies.includes(productFamily);
		});
	}

	if (request.method === 'PATCH') {
		const { payload } = JSON.parse(request.requestBody);
		const data = await decryptAES({ seed, key, data: payload });

		products.models.forEach((item) => {
			const itemData = data?.productsOnTime.find(({ id }) => id === item.id);

			if (itemData) {
				item.update({ onTime: itemData.onTime });
			}
		});
	}

	return new Response(200, {}, response);
}
