export default [
	{
		id: 'scheduled-1',
		orderer: {
			fromAccount: {
				id: 'account-1',
				productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: 'ES3102340098375445122708' },
				alias: 'Cuenta Corriente',
			},
		},
		beneficiary: {
			toAccount: {
				productNumber: { format: { id: 'IBAN' }, value: 'DK0409395839420007' },
			},
			description: 'Juana Navarrete',
		},
		reason: 'reason-1',
		amount: { amount: 123.45, currency: { id: 'EUR' } },
		operationDate: '2019-11-22',
		status: { id: 'PAID' },
		nextExecutionDate: '2021-07-24',
		firstExecutionDate: '2019-10-05',
		transferMode: { id: 'SEPA', name: 'SEPA' },
		isCancellable: true,
	},
	{
		id: 'scheduled-2',
		orderer: {
			fromAccount: {
				id: 'account-1',
				productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: 'ES3102340098375445122708' },
				alias: 'Cuenta Corriente',
			},
		},
		beneficiary: {
			toAccount: {
				productNumber: { format: { id: 'IBAN' }, value: 'DK0409395839420007' },
			},
			description: 'Juana Navarrete',
		},
		reason: 'reason-1',
		amount: { amount: 123.45, currency: { id: 'EUR' } },
		date: '2020-01-05',
		operationDate: '2019-11-22',
		status: { id: 'PAID' },
		nextExecutionDate: '2021-07-24',
		endExecutionDate: '2021-01-08',
		firstExecutionDate: '2019-10-05',
		transferMode: { id: 'SEPA', name: 'SEPA' },
		periodicity: { type: 'PERIODIC', frequency: '2' },
		isCancellable: true,
	},
	{
		id: 'scheduled-3',
		orderer: {
			fromAccount: {
				id: 'account-4',
				productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: 'ES3102340098375445122711' },
				alias: 'Cuenta Corriente',
			},
		},
		beneficiary: {
			toAccount: {
				productNumber: { format: { id: 'IBAN' }, value: 'DK0409395839420007' },
			},
			description: 'Juana Navarrete',
		},
		reason: 'reason-1',
		amount: { amount: 123.45, currency: { id: 'EUR' } },
		date: '2020-01-05',
		operationDate: '2019-11-22',
		status: { id: 'PAID' },
		nextExecutionDate: '2021-07-24',
		endExecutionDate: '2021-01-08',
		firstExecutionDate: '2019-10-05',
		transferMode: { id: 'SEPA', name: 'SEPA' },
		periodicity: { type: 'PERIODIC', frequency: '2' },
		isCancellable: true,
	},
];
