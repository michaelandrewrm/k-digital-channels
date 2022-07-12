import { Response } from 'miragejs';
import { typesById, typesByTitle } from '@modules/products/product-types';
import { subtypesById } from '@modules/products/product-subtypes';
import { intervenersByTitle } from '@modules/products/product-interveners';
import { faker } from '@faker-js/faker';
import accountMock from './mock-product-account';
import remittanceMock from './mock-product-remittance';
import cardMock from './mock-product-card';
import creditMock from './mock-product-credit';
import endorsementMock from './mock-product-endorsement';
import depositMock from './mock-product-deposit';
import pensionPlanMock from './mock-product-pension-plan';
import loanMock from './mock-product-loan';
import equitiesMock from './mock-product-equities';
import fundMock from './mock-product-fund';
import fundAssetMock from './mock-product-fund-asset';
import subscriptionMock from './mock-subscription';
import managedPortfolioMock from './mock-managed-portfolio';

const productsMock = {
	'account': accountMock,
	'remittance': remittanceMock,
	'card': cardMock,
	'credit': creditMock,
	'endorsement': endorsementMock,
	'deposit': depositMock,
	'pension-plan': pensionPlanMock,
	'loan': loanMock,
	'equities': equitiesMock,
	'fund': fundMock,
	'fund-asset': fundAssetMock,
	'subscription': subscriptionMock,
	'managed-portfolio': managedPortfolioMock,
	'investment': managedPortfolioMock,
};

export default async function(schema, request) {
	if (window.name === 'skyline') {
		const user = schema.users.findBy({ documentId: 'A02' });
		const response = {
			result: { code: '200', info: 'OK' },
			data: user.products.models,
		};

		return new Response(200, {}, response);
	}

	const session = schema.sessions.find(request.requestHeaders.uuid);
	const byService = request?.queryParams?.byService;
	const { user } = session;
	let products = user.products.models;
	const productId = request?.params?.productId;

	if (byService) {
		const isAccount = ({ productType }) => productType.id === typesByTitle.account;
		const isHolder = ({ relationType }) => relationType.id === intervenersByTitle.holder;
		const models = products.filter(isAccount).filter(isHolder);
		const response = { result: { code: '200', info: 'OK' }, data: models };

		return new Response(200, {}, response);
	}

	if (productId) {
		const product = schema.products.all().models.find(({ id }) => id === productId);
		const assetId = request?.params?.assetId;
		const type = typesById[product.productType.id];
		let mock = productsMock[type];

		if (assetId) {
			mock = productsMock[`${type}-asset`];
		}

		return mock(schema, request);
	}

	products = products.map((product) => ({
		id: product.id,
		name: product.name,
		alias: product.alias,
		productType: product.productType,
		productSubtype: product.productSubtype,
		relationType: product.relationType,
		balance: product.balance,
		postedBalance: product.postedBalance,
		limitAmount: product.limitAmount,
		profiles: product?.profiles,
		onTime: product?.onTime,
		productNumber: product.productNumber,
		assets: product.assetIds.map((id) => id && schema.assets.find(id)),
	}));

	const createResources = (product) => {
		if (!product.movements?.models?.length) {
			const randomNumber = faker.datatype.number({ min: 0, max: 200 });
			let productSubtype = subtypesById[product.productSubtype.id];
			const isPremium = productSubtype.startsWith('premium-');
			const isCurrency = productSubtype.includes('currency-');
			const isManagedPortfolio = productSubtype === 'managed-portfolio';
			const isInvestmentManagedAccount = productSubtype === 'investment-managed-account';
			const isManaged = productSubtype.startsWith('managed-');

			if (isPremium) {
				const prefix = 'premium-';
				productSubtype = productSubtype.slice(prefix.length);
			}

			if (isManaged) {
				const prefix = 'managed-';
				productSubtype = productSubtype.slice(prefix.length);
			}

			if (productSubtype.startsWith('rsi-')) {
				const prefix = 'rsi-';
				productSubtype = productSubtype.slice(prefix.length);
			}

			if (isCurrency) {
				productSubtype = productSubtype.replace(/currency-/g, '');
			}

			if (isManagedPortfolio || isInvestmentManagedAccount) {
				return product.products.models.forEach(createResources);
			}

			if (!['caminos-equities', 'endorsement', 'endorsement-line'].includes(productSubtype)) {
				const movements = this.createList('movement', randomNumber, productSubtype);

				movements.sort(({ valueDate: a }, { valueDate: b }) => new Date(b) - new Date(a));
				product.update({ movements });
			}

			const includeAssets = [
				'securities-account',
				'advised-fund',
				'commercialized-fund',
				'delegated-fund',
			];

			if (includeAssets.includes(productSubtype)) {
				const assets = this.createList(
					'asset',
					faker.datatype.number({ min: 4, max: 10 }),
					productSubtype
				);

				product.update({ assets });
			}
		}
	};

	user.products.models.forEach(createResources);

	const response = {
		result: { code: '200', info: 'OK' },
		data: products,
	};

	return new Response(200, {}, response);
}
