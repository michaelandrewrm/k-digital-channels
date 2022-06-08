import { Response } from 'miragejs';
import { faker } from '@faker-js/faker';
import getOrigins from './mock-move-money-origins';

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { user } = session;
	const mode =
		(request.url.includes('favorite') && 'favorite') ||
		(request.url.includes('scheduled') && 'scheduled') ||
		'ordered';

	const requestOrigins = await getOrigins(schema, request);
	const origins = requestOrigins.data.data;

	const addTransfersToRandomOrigins = (model) => {
		if (model?.beneficiary?.toAccount?.id) {
			const { id } = model.beneficiary.toAccount;
			const [beneficiary] = origins.filter((product) => product.id === id);
			model.update({
				beneficiary: {
					toAccount: {
						bic: model?.beneficiary?.toAccount?.bic,
						productNumber: beneficiary?.productNumber,
					},
					description: model?.beneficiary?.description,
				},
			});
		}

		if (model?.orderer) {
			return model;
		}

		const randomOrigin = faker.random.arrayElement(origins);
		model.update({
			orderer: {
				fromAccount: {
					productNumber: randomOrigin.productNumber,
					alias: randomOrigin.alias,
				},
			},
		});
		return model;
	};

	if (request?.params?.transferId) {
		const model = schema.transfers.find(request.params.transferId);
		const response = { data: model };

		return new Response(200, {}, response);
	}

	const [today] = new Date().toISOString().split('T');

	const models = Array.from(user.transfers.models).filter((transfer) => {
		const isScheduled = new Date(transfer.nextExecutionDate || 0) > new Date(today);

		if (mode === 'favorite') {
			return transfer.favorite;
		}
		if (mode === 'scheduled') {
			return (transfer.periodicity || isScheduled) && !transfer.favorite;
		}

		return transfer.date && !transfer.periodicity && !isScheduled && !transfer.favorite;
	});

	const transfers = models.map(addTransfersToRandomOrigins);
	const response = { data: transfers };

	return new Response(200, {}, response);
}
