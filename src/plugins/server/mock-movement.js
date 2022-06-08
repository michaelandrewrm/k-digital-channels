import { Response } from 'miragejs';
import { typesById } from '@modules/products/product-types';
import MockMovementLoan from './mock-movement-loan';
import MockMovementDeposit from './mock-movement-deposit';
import MockMovementEquities from './mock-movement-equities';
import MockMovementFund from './mock-movement-fund';

export default function(schema, request) {
	const { user } = schema.sessions.find(request.requestHeaders.uuid);

	if (request?.params?.productId && request?.params?.movementId) {
		const product = schema.products.find(request.params.productId);
		const type = typesById[product.productType.id];
		const isLoan = type === 'loan';
		const isDeposit = type === 'deposit';
		const isEquities = type === 'equities';
		const isFund = type === 'fund';
		const isSubscription = type === 'subscription';

		if (isLoan) {
			return MockMovementLoan.call(this, schema, request);
		}

		if (isDeposit || isSubscription) {
			return MockMovementDeposit.call(this, schema, request);
		}

		if (isEquities) {
			return MockMovementEquities.call(this, schema, request);
		}

		if (isFund) {
			return MockMovementFund.call(this, schema, request);
		}
	} else if (request.url.includes('bizum') && request?.params?.movementId) {
		return new Response(
			200,
			{},
			{ data: user.bizumData.movements.find(({ id }) => id === request.params.movementId) }
		);
	}

	return new Response(400, {}, {});
}
