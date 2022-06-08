export default [
	{
		alias: 'OPERACIÓN. F.I. Y SICAV PENDIENTES',
		id: 'pending-movements-1',
		name: 'OPERACIÓN. F.I. Y SICAV PENDIENTES',
		reason: 'Operativa en curso',
		originFund: {},
		balance: {
			amount: 123.45,
			currency: { id: 'EUR', code: '978' },
		},
		postBalance: {
			amount: 123.45,
			currency: { id: 'EUR', code: '978' },
		},
		operationDate: '2020-10-09T21:39:49.195Z',
		productSubtype: { id: '31', name: 'Operaciones en vuelo' },
		productType: { id: '16', name: 'Operaciones en vuelo' },
		relationType: { id: '06', name: 'AUTORIZADO' },
		productNumber: { value: '9216', format: { id: 'FIDES', name: 'FIDES' } },
		signature: {
			id: '0',
			name: 'SIN FIRMA',
			conditions: {
				limit: { amount: -123.45, currency: { id: 'EUR', code: '978' } },
			},
		},
		status: { id: '01', name: 'VIGENTE' },
	},
];
