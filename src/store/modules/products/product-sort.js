import productFamilies from '@modules/products/product-families';
import { subtypesById, subtypesByTitle } from '@modules/products/product-subtypes';
import { typesByTitle } from '@modules/products/product-types';

const sortCriteria = {
	'account': 0,
	'hefame-account': 1,
	'currency-account': 2,
	'debit-card': 3,
	'credit-card': 4,
	'deposit': 5,
	'currency-deposit': 6,
	'subscription': 7,
	'loan': 8,
	'pension-plan': 9,
	'equities': 10,
	'fund': 11,
	'caminos-equities': 12,
	'credit': 13,
	'managed-portfolio': 14,
	'endorsement': 15,
	'investment': 16,
	'managed-rsi-portfolio': 17,
};

export default function(products) {
	return products
		.map((product) => {
			if (
				product.productType.id === typesByTitle.investment &&
				product.productSubtype.id === subtypesByTitle['investment-managed-account']
			) {
				Object.assign(product, {
					productType: { id: typesByTitle['managed-rsi-portfolio'] },
					productSubtype: { id: subtypesByTitle['managed-rsi-portfolio'] },
				});
			}

			if (!product.balance) {
				Object.assign(product, {
					balance: { amount: 0, currency: { id: 'UNDEFINED' } },
				});
			}

			if (!product.postedBalance) {
				Object.assign(product, {
					postedBalance: { amount: 0, currency: { id: 'UNDEFINED' } },
				});
			}

			const productSubtype = subtypesById[product.productSubtype.id];
			const families = Object.entries(productFamilies);
			const familyResult = families.find(([, group]) => group.includes(productSubtype));

			/* istanbul ignore else */
			if (familyResult) {
				const [family] = familyResult;

				Object.assign(product, { productFamily: family });
			}

			return product;
		})
		.sort(function(a, b) {
			const aPosition = sortCriteria[a.productFamily];
			const bPosition = sortCriteria[b.productFamily];

			if (bPosition !== undefined) {
				if (aPosition === bPosition) {
					return a?.relationType?.id - b?.relationType?.id;
				}
				return aPosition - bPosition;
			}

			return -1;
		});
}
