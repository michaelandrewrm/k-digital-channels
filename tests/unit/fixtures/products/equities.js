export default [
	{
		id: 'equity-1',
		name: 'Cuenta Valores',
		alias: 'Cuenta Valores',
		productType: { id: '06', name: 'Broker' },
		productSubtype: { id: '16', name: 'Cuenta Valores' },
		relationType: { id: '01' },
		balance: { amount: 123.45, currency: { id: 'EUR', code: '978' } },
		postedBalance: { amount: 123.45, currency: { id: 'EUR', code: '978' } },
		productNumber: { format: { id: 'CCV', name: 'CCV' }, value: '****************2003' },
		signature: {
			id: '1',
			name: 'SOLIDARIO SIN CONDICIONES',
			conditions: {
				limit: { amount: -123.45, currency: { id: 'EUR', code: '978' } },
			},
		},
		status: { id: '01', name: 'VIGENTE' },
	},
];
