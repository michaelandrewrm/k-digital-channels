export default [
	{
		id: 'credit-1',
		alias: 'Póliza Garantía Interés Fijo',
		name: 'Póliza Garantía Interés Fijo',
		balance: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
		postedBalance: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
		limitAmount: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
		productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: 'ES3102340098375445120327' },
		productType: { id: '10', name: 'Crédito' },
		productSubtype: { id: '23', name: 'Póliza Garantía Interés Fijo' },
		relationType: { id: '01', name: 'Titular' },
		signature: {
			id: '1',
			name: 'Solidario sin condiciones',
			conditions: {
				limit: {
					amount: -123.45,
					currency: { code: '978', id: 'EUR' },
				},
			},
		},
		status: { id: '01', name: 'Vigente' },
	},
	{
		id: 'credit-2',
		alias: 'Póliza Garantía Interés Variable',
		name: 'Póliza Garantía Interés Variable',
		balance: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
		postedBalance: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
		limitAmount: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
		productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: 'ES3102340098375445120328' },
		productType: { id: '10', name: 'Crédito' },
		productSubtype: { id: '24', name: 'Póliza Garantía Interés Variable' },
		relationType: { id: '01', name: 'Titular' },
		signature: {
			id: '1',
			name: 'Solidario sin condiciones',
			conditions: {
				limit: {
					amount: -123.45,
					currency: { code: '978', id: 'EUR' },
				},
			},
		},
		status: { id: '01', name: 'Vigente' },
	},
];
