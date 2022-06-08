export default [
	{
		id: 'favorite-1',
		orderer: {
			fromAccount: {
				id: 'account-1',
				productNumber: {
					format: { id: 'IBAN', name: 'IBAN' },
					value: 'ES3102340098375445122708',
				},
				alias: 'Cuenta Corriente',
			},
		},
		beneficiary: {
			toAccount: {
				productNumber: {
					format: { id: 'IBAN' },
					value: 'DK0409395839420007',
				},
			},
			description: 'Juana Navarrete',
		},
		reason: 'Excepturi et tenetur aliquam',
		amount: { amount: 995.99, currency: { id: 'EUR' } },
		date: '2020-01-05T10:46:38.906Z',
		operationDate: '2019-11-22T14:34:54.009Z',
		status: { id: 'PAID' },
		transferMode: { id: 'SEPA', name: 'SEPA' },
		alias: 'School payment',
		favorite: true,
		isCancellable: true,
	},
];
