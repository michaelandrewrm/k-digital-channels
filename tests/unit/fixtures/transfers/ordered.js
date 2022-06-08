export default [
	{
		id: 'orderer-1',
		reference: 'reference-1',
		orderer: {
			fromAccount: {
				id: 'account-1',
				productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: 'ES3102340098375445122708' },
				alias: 'Cuenta Corriente',
			},
		},
		beneficiary: {
			toAccount: {
				productNumber: { format: { id: 'IBAN' }, value: 'ES3102340098375445122709' },
				bic: 'BANKMUXXXXX',
			},
			description: 'Name Surname',
		},
		reason: 'reason-1',
		amount: { amount: 123.45, currency: { id: 'EUR' } },
		date: '2020-01-05',
		operationDate: '2019-11-22',
		status: { id: 'PAID' },
		transferMode: { id: 'SEPA', name: 'SEPA' },
		isCancellable: true,
	},
];
