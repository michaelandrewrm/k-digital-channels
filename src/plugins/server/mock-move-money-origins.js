import { Response } from 'miragejs';
import { typesByTitle } from '@modules/products/product-types';
import { subtypesByTitle } from '@modules/products/product-subtypes';

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { user } = session;

	const models = JSON.parse(JSON.stringify(user.products.models));
	const products = models
		.filter((product) => {
			const { productType } = product;
			const { productSubtype } = product;

			const isAccount = productType.id === typesByTitle.account;
			const isDeposit = productSubtype.id === subtypesByTitle['demand-deposit'];
			const isPremiumAccount = productSubtype.id === subtypesByTitle['premium-account'];
			const isPremiumDeposit = productSubtype.id === subtypesByTitle['premium-deposit'];

			const isElegible = isAccount || isDeposit || isPremiumAccount || isPremiumDeposit;

			return isElegible;
		})
		.map((product) => ({
			id: product.id,
			alias: product.alias,
			productNumber: {
				format: product.productNumber.format,
				value: product.productNumber.value,
			},
			balance: product.balance,
			postedBalance: product.postedBalance,
			productType: product.productType,
			productSubtype: product.productSubtype,
			profiles: product?.profiles,
			status: { id: '01', name: 'VIGENTE' },
		}));

	const response = {
		result: {
			code: '200',
			info: 'OK',
		},
		data: products,
	};

	return new Response(200, {}, response);
}
