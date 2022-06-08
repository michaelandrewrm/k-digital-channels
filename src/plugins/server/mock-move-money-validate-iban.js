import { Response } from 'miragejs';
import IBAN from 'iban';

export default async function(schema, request) {
	const { iban, type, bic } = request.queryParams;

	if (IBAN.isValidBBAN('ES', iban) && type === 'CCC') {
		const transferMode = iban.slice(0, 4) === '0234' ? 'INTERNAL' : 'SEPA';
		const response = { data: [{ transferMode }] };
		return new Response(200, {}, response);
	}

	if (!type || (!IBAN.isValidBBAN('ES', iban) && type === 'CCC')) {
		return new Response(400, {}, { errorCode: 'C400000305', description: 'Invalid IBAN / CCC' });
	}

	if (!IBAN.isValid(iban)) {
		return new Response(400, {}, { errorCode: 'C400000305', description: 'Invalid IBAN / CCC' });
	}

	if (iban.slice(4, 8) === '0234') {
		const response = { data: [{ transferMode: 'INTERNAL' }] };
		return new Response(200, {}, response);
	}

	// Código de países que pertenecen a SEPA
	const listSEPA = [
		'AT',
		'BE',
		'BG',
		'HR',
		'CY',
		// 'CZ', // force to throw an error on CZ
		'FO',
		'GL',
		'DK',
		'EE',
		'FI',
		'FR',
		'DE',
		'GI',
		'GR',
		'HU',
		'IS',
		'IE',
		'IT',
		'LV',
		'LI',
		'LT',
		'LU',
		'MT',
		'MC',
		'NL',
		'NO',
		'PL',
		'PT',
		'RO',
		'SM',
		'SK',
		'SI',
		'ES',
		'SE',
		'CH',
		'GB',
	];

	if (listSEPA.includes(iban.slice(0, 2).toUpperCase())) {
		const response = { data: [{ transferMode: 'SEPA' }] };
		return new Response(200, {}, response);
	}

	if (bic && bic.length > 4) {
		const response = { data: [{ transferMode: 'INTERNATIONAL' }] };
		return new Response(200, {}, response);
	}

	return new Response(400, {}, {});
}
