export default [
	{
		id: 'fund-1',
		name: 'Cuenta Multifondos Inversión Asesorada',
		alias: 'Cuenta Multifondos Inversión Asesorada',
		productType: { id: '04', name: 'Fondos' },
		productSubtype: { id: '11', name: 'Fondos Inversión Asesorada' },
		relationType: { id: '01' },
		balance: { amount: 123.45, currency: { id: 'EUR', code: '978' } },
		postedBalance: { amount: 123.45, currency: { id: 'EUR', code: '978' } },
		productNumber: { format: { id: 'FIDES', name: 'FIDES' }, value: '4671' },
	},
	{
		id: 'fund-2',
		name: 'Cuenta Multifondos Inversión Gestionada',
		alias: 'Cuenta Multifondos Inversión Gestionada',
		productType: { id: '04', name: 'Fondos' },
		productSubtype: { id: '13', name: 'Fondos Inversión Gestionada' },
		relationType: { id: '01' },
		balance: { amount: 123.45, currency: { id: 'EUR', code: '978' } },
		postedBalance: { amount: 123.45, currency: { id: 'EUR', code: '978' } },
		productNumber: { format: { id: 'FIDES', name: 'FIDES' }, value: '7581' },
	},
];
