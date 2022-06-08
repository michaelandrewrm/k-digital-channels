const getCurrencyFrom = (property) => ({ [property]: { currency } }) => currency.id;
const repeatedItems = (item, index, array) => array.indexOf(item) === index;

/**
 * @param {Array<{amount: Number, currency: {id: String}}>} products List of products
 * @param {String} [property="balance"] Property where is the amount to sum
 * @param {Function} [filterCallback]
 *
 * @returns {Object} Total amount of products
 */
export default function(products, property = 'balance', filterCallBack) {
	const currencies = products.map(getCurrencyFrom(property)).filter(repeatedItems);

	const singleCurrency = currencies.length === 1;
	const hasEuro = currencies.includes('EUR');

	return products
		.filter(({ [property]: { currency } }) => {
			if (singleCurrency) {
				return true;
			}
			if (hasEuro) {
				return currency.id === 'EUR';
			}
			return currency.id === currencies[0];
		})
		.reduce(
			(total, product) => {
				const { amount = 0, currency } = product[property];
				let allowed = true;

				if (typeof filterCallBack === 'function') {
					allowed = Boolean(filterCallBack(product));
				}

				const sum = total.amount + (allowed ? amount || 0 : 0);

				return { amount: sum, currency };
			},
			{ amount: 0 }
		);
}
