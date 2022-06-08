/* eslint-disable no-param-reassign */
import { Factory, trait } from 'miragejs';
import { faker } from '@faker-js/faker';
import { intervenersByTitle } from '@modules/products/product-interveners';

const IBAN = {
	format: { id: 'IBAN', name: 'IBAN' },
	value: () => faker.helpers.replaceSymbolWithNumber('ES##0234################'),
};

const PAN = {
	format: { id: 'PAN', name: 'PAN' },
	value: () => faker.helpers.replaceSymbolWithNumber('################'),
};

const FIDES = {
	format: { id: 'FIDES', name: 'FIDES' },
	value: () => faker.helpers.replaceSymbolWithNumber('###############'),
};

export default Factory.extend({
	profiles: [],

	onTime: () => faker.datatype.boolean(),

	balance: {
		amount: () => parseFloat(faker.finance.amount(1000, 10000)),
		currency: { id: 'EUR' },
	},

	postedBalance: {
		amount: () => parseFloat(faker.finance.amount()) * 3,
		currency: { id: 'EUR' },
	},

	relationType: {
		id: () =>
			faker.random.arrayElement([
				intervenersByTitle.holder,
				faker.random.arrayElement(Object.values(intervenersByTitle)),
			]),
	},

	openingDate: () => faker.date.past(2).toISOString(),
	lastMovementDate: () => faker.date.recent().toISOString(),

	checkingAccount: trait({
		name: 'Cuenta Corriente',
		alias: 'Cuenta Corriente',
		bic: () => faker.finance.bic(),
		productType: { id: '01', name: 'Cuentas' },
		productSubtype: { id: '01', name: 'Cuenta Corriente' },
		productNumber: IBAN,
		hasWithholdings: () => faker.datatype.boolean(),
	}),

	account: trait({
		name: 'Cuenta Transparente',
		alias: 'Cuenta Transparente',
		bic: () => faker.finance.bic(),
		productType: { id: '01', name: 'Cuentas' },
		productSubtype: { id: '02', name: 'Cuenta Transparente' },
		productNumber: IBAN,
		hasWithholdings: () => faker.datatype.boolean(),
	}),

	premiumAccount: trait({
		name: 'Cuenta PREMIUM',
		alias: 'Cuenta PREMIUM',
		bic: () => faker.finance.bic(),
		productType: { id: '11' },
		productSubtype: { id: '26' },
		productNumber: IBAN,
		hasWithholdings: () => faker.datatype.boolean(),
	}),

	currencyAccount: trait({
		name: 'Cuenta Divisa',
		alias: 'Cuenta Divisa',
		bic: () => faker.finance.bic(),
		productType: { id: '01', name: 'Cuentas' },
		productSubtype: { id: '03', name: 'Cuenta Divisa' },
		balance: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'USD' },
		},
		postedBalance: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'USD' },
		},
		productNumber: IBAN,

		afterCreate(post) {
			const currency = faker.random.arrayElement([
				'USD',
				'GBP',
				'AUD',
				'CAD',
				'CHF',
				'JPY',
				'DKK',
				'NOK',
				'SEK',
			]);

			post.balance.currency.id = currency;
			post.postedBalance.currency.id = currency;
		},
		hasWithholdings: () => faker.datatype.boolean(),
	}),

	juniorAccount: trait({
		name: 'Cuenta Junior',
		alias: 'Cuenta Junior',
		bic: () => faker.finance.bic(),
		productType: { id: '01', name: 'Cuentas' },
		productSubtype: { id: '04', name: 'Cuenta Junior' },
		productNumber: IBAN,
		hasWithholdings: () => faker.datatype.boolean(),
	}),

	supportAccount: trait({
		name: 'Cuenta Soporte',
		alias: 'Cuenta Soporte',
		bic: () => faker.finance.bic(),
		productType: { id: '01', name: 'Cuentas' },
		productSubtype: { id: '05', name: 'Cuenta Soporte' },
		productNumber: IBAN,
		hasWithholdings: () => faker.datatype.boolean(),
	}),

	managedAccount: trait({
		name: 'Cuenta Corriente Gestionada',
		alias: 'Cuenta Corriente Gestionada',
		bic: () => faker.finance.bic(),
		productType: { id: '01', name: 'Cuentas' },
		productSubtype: { id: '39', name: 'Cuenta Corriente Gestionada' },
		productNumber: IBAN,
	}),

	managedCurrencyAccount: trait({
		name: 'Cuenta Corriente Gestionada Divisa',
		alias: 'Cuenta Corriente Gestionada Divisa',
		bic: () => faker.finance.bic(),
		productType: { id: '01', name: 'Cuentas' },
		productSubtype: { id: '40', name: 'Cuenta Corriente Gestionada Divisa' },
		productNumber: IBAN,
		afterCreate(post) {
			const currency = faker.random.arrayElement([
				'USD',
				'GBP',
				'AUD',
				'CAD',
				'CHF',
				'JPY',
				'DKK',
				'NOK',
				'SEK',
			]);

			post.balance.currency.id = currency;
			post.postedBalance.currency.id = currency;
		},
	}),

	hefameAccount: trait({
		name: 'Farmacuenta Hefame',
		alias: 'Farmacuenta Hefame',
		productType: { id: '01', name: 'Cuentas' },
		productSubtype: { id: '43', name: 'Farmacuenta Hefame' },
		productNumber: IBAN,
	}),

	debitCard: trait({
		name: 'Débito transparente',
		alias: 'Débito transparente',
		productType: { id: '02', name: 'Tarjetas' },
		productSubtype: { id: '06', name: 'Tarjeta Débito' },
		productNumber: PAN,
		expirationDate: () => faker.date.future().toISOString(),
		cvv: () => faker.datatype.number({ min: 100, max: 999 }),
		pin: () => faker.datatype.number({ min: 1000, max: 9999 }),
		registerDate: () => faker.date.past(2).toISOString(),
		lastUseDate: () => faker.date.recent().toISOString(),
	}),

	creditCard: trait({
		name: 'Crédito transparente',
		alias: 'Crédito transparente',
		productType: { id: '02', name: 'Tarjetas' },
		productSubtype: { id: '07', name: 'Tarjeta Crédito' },
		productNumber: PAN,
		expirationDate: () => faker.date.future().toISOString(),
		cvv: () => faker.datatype.number({ min: 100, max: 999 }),
		pin: () => faker.datatype.number({ min: 1000, max: 9999 }),
		registerDate: () => faker.date.past(2).toISOString(),
		lastUseDate: () => faker.date.recent().toISOString(),
	}),

	businessDebitCard: trait({
		name: 'Débito Business',
		alias: 'Débito Business',
		productType: { id: '02', name: 'Tarjetas' },
		productSubtype: { id: '33', name: 'Tarjeta de débito' },
		productNumber: PAN,
		expirationDate: () => faker.date.future().toISOString(),
		cvv: () => faker.datatype.number({ min: 100, max: 999 }),
		pin: () => faker.datatype.number({ min: 1000, max: 9999 }),
		registerDate: () => faker.date.past(2).toISOString(),
		lastUseDate: () => faker.date.recent().toISOString(),
	}),

	businessCreditCard: trait({
		name: 'Crédito Business',
		alias: 'Crédito Business',
		productType: { id: '02', name: 'Tarjetas' },
		productSubtype: { id: '34', name: 'Tarjeta Crédito' },
		productNumber: PAN,
		expirationDate: () => faker.date.future().toISOString(),
		cvv: () => faker.datatype.number({ min: 100, max: 999 }),
		pin: () => faker.datatype.number({ min: 1000, max: 9999 }),
		registerDate: () => faker.date.past(2).toISOString(),
		lastUseDate: () => faker.date.recent().toISOString(),
	}),

	premiumDebitCard: trait({
		name: 'Tarjeta de débito PREMIUM',
		alias: 'Tarjeta de débito PREMIUM',
		productType: { id: '11' },
		productSubtype: { id: '28' },
		productNumber: PAN,
		expirationDate: () => faker.date.future().toISOString(),
		cvv: () => faker.datatype.number({ min: 100, max: 999 }),
		pin: () => faker.datatype.number({ min: 1000, max: 9999 }),
		registerDate: () => faker.date.past(2).toISOString(),
		lastUseDate: () => faker.date.recent().toISOString(),
	}),

	premiumCreditCard: trait({
		name: 'Tarjeta de crédito PREMIUM',
		alias: 'Tarjeta de crédito PREMIUM',
		productType: { id: '11' },
		productSubtype: { id: '29' },
		productNumber: PAN,
		expirationDate: () => faker.date.future().toISOString(),
		cvv: () => faker.datatype.number({ min: 100, max: 999 }),
		pin: () => faker.datatype.number({ min: 1000, max: 9999 }),
		registerDate: () => faker.date.past(2).toISOString(),
		lastUseDate: () => faker.date.recent().toISOString(),
	}),

	credit: trait({
		alias: 'Crédito',
		balance: {
			amount: () => parseFloat(faker.finance.amount()) * -1,
			currency: { id: 'EUR' },
		},
		postedBalance: {
			amount: () => parseFloat(faker.datatype.number({ min: 1000, max: 9999 })),
			currency: { id: 'EUR' },
		},
		limitAmount: {
			amount: () => parseFloat(faker.datatype.number({ min: 10000, max: 99999 })),
			currency: { id: 'EUR' },
		},
		name: 'Póliza',
		productNumber: IBAN,
		productSubtype: {},
		productType: { id: '10', name: 'Crédito' },
		signature: {
			id: '1',
			name: 'Solidario sin condiciones',
			conditions: {
				limit: {
					amount: () => parseFloat(faker.finance.amount()) * -1,
					currency: { id: 'EUR' },
				},
			},
		},
		status: { id: '01', name: 'Vigente' },
		afterCreate(post) {
			const type = faker.random.arrayElement([
				{ id: '23', name: 'Póliza Garantía Interés Fijo' },
				{ id: '24', name: 'Póliza Garantía Interés Variable' },
				{ id: '41', name: 'Póliza Garantía Interés Fijo' },
				{ id: '42', name: 'Póliza Garantía Interés Variable' },
			]);

			// eslint-disable-next-line no-param-reassign
			post.productSubtype = type;
			// eslint-disable-next-line no-param-reassign
			post.name = type.name;
		},
	}),

	termDeposit: trait({
		name: 'Depósito Caminos',
		alias: 'Depósito Caminos',
		bic: () => faker.finance.bic(),
		productType: { id: '03', name: 'Depósitos' },
		productSubtype: { id: '08', name: 'Depósito a plazo' },
		productNumber: FIDES,
	}),

	currencyDeposit: trait({
		name: 'Depósito Caminos',
		alias: 'Depósito Caminos',
		bic: () => faker.finance.bic(),
		productType: { id: '03', name: 'Depósitos' },
		productSubtype: { id: '10', name: 'Depósito en divisas' },
		productNumber: IBAN,
		balance: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'USD' },
		},
		postedBalance: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'USD' },
		},

		afterCreate(post) {
			const currency = faker.random.arrayElement([
				'USD',
				'GBP',
				'AUD',
				'CAD',
				'CHF',
				'JPY',
				'DKK',
				'NOK',
				'SEK',
			]);

			// eslint-disable-next-line no-param-reassign
			post.balance.currency.id = currency;
			// eslint-disable-next-line no-param-reassign
			post.postedBalance.currency.id = currency;
		},
	}),

	premiumDeposit: trait({
		name: 'Depósito a plazos PREMIUM',
		alias: 'Depósito a plazos PREMIUM',
		productType: { id: '11' },
		productSubtype: { id: '30' },
		bic: () => faker.finance.bic(),
		productNumber: FIDES,
	}),

	demandDeposit: trait({
		name: 'Depósito Caminos',
		alias: 'Depósito Caminos',
		bic: () => faker.finance.bic(),
		productType: { id: '03', name: 'Depósitos' },
		productSubtype: { id: '09', name: 'Depósito a la vista' },
		productNumber: IBAN,
	}),

	pensionPlan: trait({
		name: 'Plan de Pensiones',
		alias: 'Plan de Pensiones',
		productType: { id: '05', name: 'Plan de Pensiones' },
		productSubtype: { id: '14', name: 'Plan de Pensiones' },
		productNumber: IBAN,
	}),

	loanFixed: trait({
		name: 'Préstamo transparente',
		alias: 'Mi préstamo plus',
		productType: { id: '07', name: 'Préstamo' },
		productSubtype: { id: '18', name: 'Préstamo Interés Fijo' },
		productNumber: IBAN,
		balance: {
			amount: () => parseFloat(faker.finance.amount()) * -1,
			currency: { id: 'EUR' },
		},
		nextPaymentAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		nextPaymentDate: () => faker.date.future().toISOString(),
		pendingAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		installmentAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		startAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		startDate: () => faker.date.past().toISOString(),
		expiryDate: () => faker.date.future(10).toISOString(),
		nextReviewDate: () => faker.date.future(1).toISOString(),
		paymentsPaid: () => faker.datatype.number({ min: 1, max: 20 }),
		pendingPayments: () => faker.datatype.number({ min: 21, max: 100 }),
		interest: {
			method: { id: '01', name: 'FIJO' },
			referentialIndex: { id: '01', name: 'Euribor 12 meses' },
			interestRate: 6,
			differential: 6,
		},
		hasReceipts: () => faker.datatype.boolean(),
	}),

	loanVar: trait({
		name: 'Préstamo Plus',
		alias: 'Mi préstamo variable',
		productType: { id: '07', name: 'Préstamo' },
		productSubtype: { id: '17', name: 'Préstamo Interés Variable' },
		productNumber: IBAN,
		balance: {
			amount: () => parseFloat(faker.finance.amount()) * -1,
			currency: { id: 'EUR' },
		},
		nextPaymentAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		nextPaymentDate: () => faker.date.future().toISOString(),
		pendingAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		installmentAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		startAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		startDate: () => faker.date.past().toISOString(),
		expiryDate: () => faker.date.future(10).toISOString(),
		nextReviewDate: () => faker.date.future(1).toISOString(),
		paymentsPaid: () => faker.datatype.number({ min: 1, max: 20 }),
		pendingPayments: () => faker.datatype.number({ min: 21, max: 100 }),
		interest: {
			method: { id: '02', name: 'VARIABLE' },
			referentialIndex: { id: '01', name: 'Euribor 12 meses' },
			interestRate: 6,
			differential: 6,
		},
		hasReceipts: () => faker.datatype.boolean(),
	}),

	securitiesAccount: trait({
		name: 'Cuenta Valores',
		alias: 'Cta.Valores Personal',
		productNumber: IBAN,
		productType: { id: '06', name: 'Broker' },
		productSubtype: { id: '16', name: 'Cuenta valores' },
		createDate: () => faker.date.past().toISOString(),
		lastValueDate: () => faker.date.recent().toISOString(),
		totalValue: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
	}),

	advisedFund: trait({
		name: 'Cuenta Multifondos Inversión Asesorada',
		alias: 'Cuenta Multifondos Inversión Asesorada',
		productNumber: FIDES,
		createDate: () => faker.date.past().toISOString(),
		productType: { id: '04', name: 'Fondos' },
		productSubtype: { id: '11', name: 'Fondos Inversión Asesorada' },
	}),

	commercializedFund: trait({
		name: 'Cuenta Multifondos Inversión Comercializada',
		alias: 'Cuenta Multifondos Inversión Comercializada',
		productNumber: FIDES,
		createDate: () => faker.date.past().toISOString(),
		productType: { id: '04', name: 'Fondos' },
		productSubtype: { id: '12', name: 'Fondos Inversión Comercializada' },
	}),

	delegatedFund: trait({
		name: 'Cuenta Multifondos Inversión Gestionada',
		alias: 'Cuenta Multifondos Inversión Gestionada',
		productNumber: FIDES,
		createDate: () => faker.date.past().toISOString(),
		productType: { id: '04', name: 'Fondos' },
		productSubtype: { id: '13', name: 'Fondos Inversión Gestionada' },
	}),

	caminosEquities: trait({
		name: 'Acciones Banco Caminos',
		alias: 'Acciones Banco Caminos',
		productNumber: FIDES,
		productType: { id: '06', name: 'Broker' },
		productSubtype: { id: '15', name: 'Acciones Banco Caminos' },
		createDate: () => faker.date.past().toISOString(),
		unityQuantity: () => faker.datatype.number({ min: 100, max: 2000 }),
		unityValue: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		lastValueDate: () => faker.date.recent().toISOString(),
		totalValue: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		effectiveUnityValue: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
	}),

	managedPortfolio: trait({
		name: 'Cartera gestionada',
		alias: 'GESTION DISCRECCIONAL CAR',
		balance: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		productNumber: FIDES,
		productType: { id: '15', name: 'Carteras Gestionadas' },
		productSubtype: { id: '27', name: 'Cartera Gestionada' },
		relationType: { id: '01', name: 'TITULAR' },
		createDate: () => faker.date.past().toISOString(),
	}),

	pendingMovements: trait({
		name: 'Gestifonsa Mixto 10, clase A',
		alias: 'Gestifonsa Mixto 10, clase A',
		productType: { id: '16' },
		productSubtype: { id: '31' },
	}),

	endorsement: trait({
		alias: 'AVAL DEFINITIVO',
		name: 'AVAL DEFINITIVO',
		productSubtype: { id: '20', name: 'Aval' },
		productType: { id: '08', name: 'Avales' },
		productNumber: FIDES,
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
		guarantyId: () => faker.datatype.number({ min: 1, max: 999999 }),
		guarantyAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		startingAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		outstandingAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
	}),

	endorsementLine: trait({
		alias: 'AVAL',
		name: 'AVAL',
		productSubtype: { id: '21', name: 'Linea de Avales' },
		productType: { id: '08', name: 'Avales' },
		productNumber: FIDES,
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
		status: { id: '96', name: 'DUDOSAMOROSA' },
		guarantyId: () => faker.datatype.number({ min: 1, max: 999999 }),
		guarantyAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		startingAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
		outstandingAmount: {
			amount: () => parseFloat(faker.finance.amount()),
			currency: { id: 'EUR' },
		},
	}),

	investmentAccountRTO: trait({
		name: 'Cuenta inversora',
		alias: 'Cuenta inversora RTO',
		productNumber: IBAN,
		productType: { id: '13', name: 'Cuentas inversoras' },
		productSubtype: { id: '37', name: 'Cuentas inversoras RTO' },
	}),

	investmentManagedAccount: trait({
		name: 'Cartera Gestionada RSI/Inversis',
		alias: 'Cartera Gestionada RSI/Inversis',
		productNumber: IBAN,
		productType: { id: '13', name: 'Cartera Gestionada RSI/Inversis' },
		productSubtype: { id: '36', name: 'Cartera Gestionada RSI/Inversis' },
	}),

	investmentPensionPlan: trait({
		name: 'Planes de pensiones',
		alias: 'Planes de pensiones',
		productNumber: IBAN,
		productType: { id: '13', name: 'Cuentas inversoras' },
		productSubtype: { id: '38', name: 'Cuentas planes de pensiones' },
	}),
});
