import { subtypesById } from '@modules/products/product-subtypes';
import accountMock from './mock-product-account';
import cardMock from './mock-product-card';
import depositMock from './mock-product-deposit';

const mocks = {
	account: accountMock,
	card: cardMock,
	deposit: depositMock,
};

export default (schema, request) => {
	if (request?.params?.productId) {
		const product = schema.products.find(request.params.productId);
		const prefix = 'premium-';
		let productFamily = subtypesById[product.productSubtype.id].slice(prefix.length);

		if (productFamily === 'credit-card' || productFamily === 'debit-card') {
			productFamily = 'card';
		}

		const mockProduct = mocks[productFamily];

		return mockProduct(schema, request);
	}
};
