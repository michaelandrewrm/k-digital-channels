export default function(server) {
	server.createList('communication', 10);

	server.create('user', 'firstTime', {
		documentId: 'A00',
		products: [
			...server.createList('product', 1, 'account'),
			...server.createList('product', 1, 'debitCard'),
		],
	});

	server.create('user', 'sca', {
		documentId: 'A01',
		products: [
			...server.createList('product', 1, 'account'),
			...server.createList('product', 1, 'creditCard'),
		],
	});

	server.create('user', {
		documentId: 'A02',
		products: [
			...server.createList('product', 1, 'account'),
			...server.createList('product', 1, 'debitCard'),
			...server.createList('product', 1, 'creditCard'),
		],
	});

	server.create('user', {
		documentId: 'A03',
		products: [
			...server.createList('product', 1, 'checkingAccount'),
			...server.createList('product', 1, 'account'),
			...server.createList('product', 1, 'juniorAccount'),
			...server.createList('product', 1, 'supportAccount'),
			...server.createList('product', 1, 'currencyAccount'),
			...server.createList('product', 1, 'debitCard'),
			...server.createList('product', 1, 'creditCard'),
			...server.createList('product', 1, 'businessDebitCard'),
			...server.createList('product', 1, 'businessCreditCard'),
			...server.createList('product', 4, 'credit'),
			...server.createList('product', 2, 'currencyDeposit'),
			...server.createList('product', 1, 'termDeposit'),
			...server.createList('product', 1, 'demandDeposit'),
			...server.createList('product', 1, 'pensionPlan'),
			...server.createList('product', 1, 'loanFixed'),
			...server.createList('product', 1, 'loanVar'),
			...server.createList('product', 1, 'securitiesAccount'),
			...server.createList('product', 1, 'advisedFund'),
			...server.createList('product', 1, 'delegatedFund'),
			...server.createList('product', 1, 'commercializedFund'),
			...server.createList('product', 1, 'caminosEquities'),
			...server.createList('product', 1, 'pendingMovements'),
			...server.createList('product', 1, 'endorsement'),
			...server.createList('product', 1, 'endorsementLine'),
			...server.createList('product', 1, 'premiumAccount'),
			...server.createList('product', 2, 'premiumDebitCard'),
			...server.createList('product', 1, 'premiumCreditCard'),
			...server.createList('product', 1, 'premiumDeposit'),
			...server.createList('product', 2, 'managedPortfolio', {
				products: () => [
					...server.createList('product', 1, 'checkingAccount'),
					...server.createList('product', 1, 'currencyAccount'),
					...server.createList('product', 1, 'debitCard'),
					...server.createList('product', 1, 'creditCard'),
					...server.createList('product', 1, 'delegatedFund'),
					...server.createList('product', 1, 'termDeposit'),
					...server.createList('product', 1, 'currencyDeposit'),
					...server.createList('product', 1, 'securitiesAccount'),
				],
			}),
			...server.createList('product', 2, 'investmentManagedAccount', {
				products: () => [
					...server.createList('product', 1, 'managedAccount'),
					...server.createList('product', 1, 'managedCurrencyAccount'),
				],
			}),
			...server.createList('product', 1, 'investmentPensionPlan', {
				assets: () => server.createList('asset', 2, 'investment-account-advised'),
			}),
			...server.createList('product', 1, 'investmentAccountRTO', {
				assets: () => server.createList('asset', 4, 'investment-account-rto'),
			}),
		],
		transfers: [
			...server.createList('transfer', 10),
			...server.createList('transfer', 10, 'favorite'),
			...server.createList('transfer', 10, 'scheduled'),
			...server.createList('transfer', 10, 'periodic'),
			...server.createList('transfer', 1, 'unknown'),
		],
		contracts: [
			...server.createList('contract', 3, 'owner'),
			...server.createList('contract', 1, 'user'),
		],
		signatures: [
			...server.createList('signature', 3, 'pending'),
			...server.createList('signature', 3, 'signed'),
		],
		bizum: true,
	});

	server.create('user', {
		documentId: 'A04',
		products: [
			...server.createList('product', 1, 'managedPortfolio', {
				products: () => [
					...server.createList('product', 1, 'delegatedFund'),
					...server.createList('product', 1, 'termDeposit'),
				],
			}),
			...server.createList('product', 1, 'investmentAccountRTO', {
				assets: () => server.createList('asset', 4, 'investment-account-rto'),
			}),
			...server.createList('product', 1, 'investmentPensionPlan', {
				assets: () => server.createList('asset', 2, 'investment-account-advised'),
			}),
		],
	});

	server.create('user', { documentId: 'A05', empty: true });

	server.create('user', { documentId: 'A06' }, 'blocked');

	server.create('agent', { userId: '007', companies: ['BC'] });
}
