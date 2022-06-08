import { Response } from 'miragejs';
import { SCA_REQUIRED } from '@modules/service/constants';
import SignedOperation from './mock-signed-operation';

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { user } = session;
	const CHUNK_LENGTH = 10;

	const paginationKey = request?.queryParams?.paginationKey;
	const dateFrom = request?.queryParams?.dateFrom;
	const dateTo = request?.queryParams?.dateTo;
	const queryReason = request?.queryParams?.reason;

	let resources;

	if (request?.params?.productId) {
		const product = schema.products.find(request.params.productId);
		resources = product.movements.models;
	}

	if (request.url.includes('bizum')) {
		if (!user?.bizumData?.movements) {
			const bizumMovements = this.createList('movement', 10, 'bizum');
			user.update({ bizumData: { movements: bizumMovements } });
			resources = bizumMovements;
		} else {
			resources = user.bizumData.movements;
		}

		if (request?.queryParams?.status === 'COMPLETED') {
			resources = resources.filter(({ status }) => status.name !== 'PENDING');
		} else if (request?.queryParams?.status === 'PENDING') {
			resources = resources.filter(({ status }) => status.name === 'PENDING');
		}
	}

	if (!resources?.length) {
		return new Response(400, {}, {});
	}

	resources
		.sort(({ valueDate: a }, { valueDate: b }) => new Date(b) - new Date(a))
		.filter(({ valueDate, reason }) => {
			const date = new Date(valueDate);
			const RFC3339 = /^(\d{4})(\d{2})(\d{2})$/;
			const matchedReason = Boolean(reason.match(queryReason)?.length);
			let parsedDateFrom;
			let parsedDateTo;

			if (dateFrom) {
				const m = dateFrom.match(RFC3339);
				parsedDateFrom = new Date(`${m[1]}-${m[2]}-${m[3]}`);
			}

			if (dateTo) {
				const m = dateTo.match(RFC3339);
				parsedDateTo = new Date(`${m[1]}-${m[2]}-${m[3]}`);
			}

			if (matchedReason) {
				if (parsedDateFrom && parsedDateTo) {
					return date > parsedDateFrom && date < parsedDateTo;
				}

				if (parsedDateFrom) {
					return date > parsedDateFrom;
				}

				if (parsedDateTo) {
					return date < parsedDateTo;
				}
			}

			if (parsedDateFrom && parsedDateTo && !queryReason) {
				return date > parsedDateFrom && date < parsedDateTo;
			}

			if (parsedDateFrom && !queryReason) {
				return date > parsedDateFrom;
			}

			if (parsedDateTo && !queryReason) {
				return date < parsedDateTo;
			}

			return !queryReason ? true : matchedReason;
		});
	const indexPagKey = resources.findIndex(({ id }) => paginationKey === id);
	const index = indexPagKey === -1 ? 0 : indexPagKey;
	const part = resources.slice(index, index + CHUNK_LENGTH);
	const nextPaginationKey = resources[index + CHUNK_LENGTH]?.id;
	const limit = new Date(new Date().setDate(new Date().getDate() - 90));
	const has90DaysOldMovement = part.some(({ valueDate }) => new Date(valueDate) < limit);

	if (has90DaysOldMovement && !user.sca) {
		if (request?.queryParams?.generateOtp) {
			const handler = () => {
				user.update({ sca: true });

				const response = {
					result: {
						code: '200',
						info: 'OK',
					},
					data: part,
					paging: {
						hasMorePages: Boolean(nextPaginationKey),
						nextPaginationKey,
					},
				};
				return new Response(200, {}, response);
			};

			return new SignedOperation(schema, handler);
		}
		return new Response(401, {}, { errorCode: SCA_REQUIRED });
	}

	const response = {
		result: {
			code: '200',
			info: 'OK',
		},
		data: part,
		paging: {
			hasMorePages: Boolean(nextPaginationKey),
			nextPaginationKey,
		},
	};

	return new Response(200, {}, response);
}
