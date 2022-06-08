import { Response } from 'miragejs';

export default async function(schema, request) {
	const session = schema.sessions.find(request.requestHeaders.uuid);
	const { user } = session;

	const {
		ownAccounts,
		internalAccounts,
		externalAccounts,
		postedInternalAccounts,
		postedExternalAccounts,
	} = user.limits;

	const response = {
		/**
		 * Límite por operación para traspasos.
		 */
		ownAccounts: {
			amount: ownAccounts,
			currency: { id: 'EUR' },
		},

		/**
		 * Límite por operación para transferencias a cuentas de Banco Caminos.
		 */
		internalAccounts: {
			amount: internalAccounts,
			currency: { id: 'EUR' },
		},

		/**
		 * Límite diario para transferencias a cuentas de Banco Caminos.
		 */
		postedInternalAccounts: {
			amount: postedInternalAccounts,
			currency: { id: 'EUR' },
		},

		/**
		 * Límite por operación para transferencias a cuentas externas.
		 */

		externalAccounts: {
			amount: externalAccounts,
			currency: { id: 'EUR' },
		},

		/**
		 * Límite diario para transferencias a cuentas externas.
		 */
		postedExternalAccounts: {
			amount: postedExternalAccounts,
			currency: { id: 'EUR' },
		},
	};

	return new Response(200, {}, response);
}
