import sumAmounts from '@modules/products/product-sum-amounts';

describe('product-sum-balances.js', () => {
	it('sums all euro balances', () => {
		const fixture = [
			{ balance: { amount: 25, currency: { id: 'EUR' } } },
			{ balance: { amount: 45, currency: { id: 'EUR' } } },
		];

		const total = sumAmounts(fixture);

		expect(total).toMatchObject({
			amount: 70,
			currency: { id: 'EUR' },
		});
	});

	it('sums only euro balances excluding currency ones', () => {
		const fixture = [
			{ balance: { amount: 25, currency: { id: 'EUR' } } },
			{ balance: { amount: 5, currency: { id: 'EUR' } } },
			{ balance: { amount: 45, currency: { id: 'USD' } } },
		];

		const total = sumAmounts(fixture);

		expect(total).toMatchObject({
			amount: 30,
			currency: { id: 'EUR' },
		});
	});

	it('sums same currency balances because there are no euro', () => {
		const fixture = [
			{ balance: { amount: 25, currency: { id: 'USD' } } },
			{ balance: { amount: 45, currency: { id: 'USD' } } },
		];

		const total = sumAmounts(fixture);

		expect(total).toMatchObject({
			amount: 70,
			currency: { id: 'USD' },
		});
	});

	it('sums only a currency balance if there are more than one', () => {
		const fixture = [
			{ balance: { amount: 25, currency: { id: 'USD' } } },
			{ balance: { amount: 45, currency: { id: 'USD' } } },
			{ balance: { amount: 20, currency: { id: 'ARS' } } },
			{ balance: { amount: 10, currency: { id: 'ARS' } } },
		];

		const total = sumAmounts(fixture);

		expect(total).toMatchObject({
			amount: 70,
			currency: { id: 'USD' },
		});
	});

	it('sums pending amounts or custom properties', () => {
		const fixture = [
			{ pendingAmount: { amount: 25, currency: { id: 'EUR' } } },
			{ pendingAmount: { amount: 45, currency: { id: 'EUR' } } },
		];

		const total = sumAmounts(fixture, 'pendingAmount');

		expect(total).toMatchObject({
			amount: 70,
			currency: { id: 'EUR' },
		});
	});

	it('sums balances without valid amounts', () => {
		const fixture = [
			{ balance: { currency: { id: 'EUR' } } },
			{ balance: { amount: null, currency: { id: 'EUR' } } },
			{ balance: { amount: 45, currency: { id: 'EUR' } } },
		];

		const total = sumAmounts(fixture);

		expect(total).toMatchObject({
			amount: 45,
			currency: { id: 'EUR' },
		});
	});

	it('sums balances if they pass the filter callback', () => {
		const fixture = [
			{ name: 'premium', balance: { amount: 10, currency: { id: 'EUR' } } },
			{ name: 'premium', balance: { amount: 20, currency: { id: 'EUR' } } },
			{ name: 'account', balance: { amount: 45, currency: { id: 'EUR' } } },
			{ name: 'premium', balance: { amount: 45, currency: { id: 'EUR' } } },
		];

		const total = sumAmounts(fixture, 'balance', ({ name }) => name === 'premium');

		expect(total).toMatchObject({
			amount: 75,
			currency: { id: 'EUR' },
		});
	});
});
