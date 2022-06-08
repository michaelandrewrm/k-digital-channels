export default [
	{
		id: 'endorsement-1',
		alias: 'AVAL DEFINITIVO',
		name: 'AVAL DEFINITIVO',
		balance: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
		postedBalance: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
		productNumber: { format: { id: 'FIDES', name: 'FIDES' }, value: '000199015739988' },
		productSubtype: { id: '20', name: 'Aval' },
		productType: { id: '08', name: 'Avales' },
		relationType: { id: '01', name: 'TITULAR' },
		signature: {
			id: '1',
			name: 'SOLIDARIO SIN CONDICIONES',
			conditions: {
				limit: {
					amount: -1,
					currency: {
						code: '978',
						id: 'EUR',
					},
				},
			},
		},
		status: { id: '01', name: 'VIGENTE' },
	},
	{
		id: 'endorsement-2',
		alias: 'AVAL',
		name: 'AVAL',
		balance: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
		postedBalance: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
		productNumber: { format: { id: 'FIDES', name: 'FIDES' }, value: '000199015739988' },
		productSubtype: { id: '21', name: 'Linea de Avales' },
		productType: { id: '08', name: 'Avales' },
		relationType: { id: '01', name: 'TITULAR' },
		signature: {
			id: '1',
			name: 'SOLIDARIO SIN CONDICIONES',
			conditions: {
				limit: {
					amount: -1,
					currency: {
						code: '978',
						id: 'EUR',
					},
				},
			},
		},
		status: { id: '01', name: 'VIGENTE' },
	},
];
