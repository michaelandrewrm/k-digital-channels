export default [
	{
		id: 'loan-1',
		name: 'Préstamo transparente',
		alias: 'Mi préstamo plus',
		productType: { id: '07', name: 'Préstamo' },
		productSubtype: { id: '18', name: 'Préstamo Interés Fijo' },
		relationType: { id: '01' },
		balance: { amount: -123.45, currency: { id: 'EUR', code: '978' } },
		postedBalance: { amount: 123.45, currency: { id: 'EUR', code: '978' } },
		productNumber: { format: { id: 'FIDES', name: 'FIDES' }, value: '***********0314' },
	},
	{
		id: 'loan-2',
		name: 'Hipoteca vivienda interés variable',
		alias: 'Préstamo hipotecario',
		productType: { id: '07', name: 'Préstamo' },
		productSubtype: { id: '17', name: 'Hipoteca / Préstamo Interés Variable' },
		relationType: { id: '01' },
		balance: { amount: -123.45, currency: { id: 'EUR', code: '978' } },
		postedBalance: { amount: 123.45, currency: { id: 'EUR', code: '978' } },
		productNumber: { format: { id: 'FIDES', name: 'FIDES' }, value: '***********0315' },
	},
];
