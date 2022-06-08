import { Response } from 'miragejs';
import { intervenersByTitle } from '@modules/products/product-interveners';
import { typesByTitle } from '@modules/products/product-types';
import SignedOperation from './mock-signed-operation';

export default (schema, request) => {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { user } = session;

	if (!request?.params?.productId) {
		return new Response(400, {}, {});
	}

	const chargeAccount = user.products.filter(
		({ productType }) => productType.id === typesByTitle.account
	).models[0];

	const product = schema.products.find(request.params.productId);

	const model = {
		id: product.id,
		name: product.name,
		alias: product.alias,
		productType: product.productType,
		productSubtype: product.productSubtype,
		nextPaymentAmount: product.nextPaymentAmount,
		nextPaymentDate: product.nextPaymentDate,
		connectedAccount: chargeAccount.productNumber,
		pendingAmount: product.pendingAmount,
		installmentAmount: product.installmentAmount,
		startAmount: product.startAmount,
		productNumber: product.productNumber,
		interveners: [
			{
				id: user.id,
				name: user.name,
				relationType: {
					id: intervenersByTitle.holder,
					name: 'holder',
				},
			},
		],
		interest: product.interest,
		startDate: product.startDate,
		expiryDate: product.expiryDate,
		nextReviewDate: product.nextReviewDate,
		paymentsPaid: product.paymentsPaid,
		pendingPayments: product.pendingPayments,
	};

	const response = model;

	const handler = () => {
		return new Response(200, {}, response);
	};

	return new SignedOperation(schema, handler);
};
