import { Response } from 'miragejs';
import SignedOperation from './mock-signed-operation';

export default function(schema, request) {
	if (request.params.userId && request.params.action) {
		const isNotUnlock = request.params.action !== 'unlock';

		if (isNotUnlock) {
			const handler = () => {
				return new Response(203);
			};

			return new SignedOperation(schema, handler);
		}

		return new Response(203);
	}

	const {
		documentNumber: reqDocumentNumber,
		name: reqName,
		surname1: reqSurname1,
		surname2: reqSurname2,
	} = request.queryParams;

	if (
		reqDocumentNumber === 'error' ||
		reqName === 'error' ||
		reqSurname1 === 'error' ||
		reqSurname2 === 'error'
	) {
		return new Response(400, {}, { errorCode: 'C4010000' });
	}

	function hasSearchString(text, searchString) {
		return text.toLowerCase().indexOf(searchString) === 0;
	}

	const users = schema.users.all().models.filter(({ documentId, name, surname1, surname2 }) => {
		const cond1 = reqDocumentNumber ? hasSearchString(documentId, reqDocumentNumber) : true;
		const cond2 = reqName ? hasSearchString(name, reqName) : true;
		const cond3 = reqSurname1 ? hasSearchString(surname1, reqSurname1) : true;
		const cond4 = reqSurname2 ? hasSearchString(surname2, reqSurname2) : true;

		return cond1 && cond2 && cond3 && cond4;
	});

	return new Response(
		200,
		{},
		{
			data: users,
			pageNumber: 0,
			totalPages: Math.ceil(users.length / 25),
		}
	);
}
