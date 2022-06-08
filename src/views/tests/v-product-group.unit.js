import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-product-group.vue';
import categorizeProducts from '@modules/products/product-sort';

import accounts from '@tests/fixtures/products/accounts';
import cards from '@tests/fixtures/products/cards';
import deposits from '@tests/fixtures/products/deposits';
import funds from '@tests/fixtures/products/funds';
import loans from '@tests/fixtures/products/loans';
import pensionPlans from '@tests/fixtures/products/pensionPlans';
import pendingMovements from '@tests/fixtures/products/pendingMovements';

const newInstance = createPristineVue();
const { localVue } = newInstance;

expect.extend({
	toBeCurrency(received, amount, currencySign = '€') {
		const formattedReceived = received.replace(/\s/g, ' ').replace(/,/, '.');
		const formattedAmount = `${amount} ${currencySign}`;

		return formattedReceived === formattedAmount
			? {
					pass: true,
					message() {
						return `Expected: not ${formattedReceived}\nReceived:     ${formattedAmount}`;
					},
			  }
			: {
					pass: false,
					message() {
						return `Expected: ${formattedReceived}\nReceived: ${formattedAmount}`;
					},
			  };
	},
});

describe('v-product-group.vue', () => {
	let wp;
	let router;
	let store;

	const collection = categorizeProducts([
		...accounts,
		...cards,
		...deposits,
		...loans,
		...funds,
		...pensionPlans,
		...pendingMovements,
	]);

	const fetch = jest.fn().mockResolvedValue(collection);

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.registerModule('app', { namespaced: true, state: { companyId: 'BC' } });
		store.mockModule('products', { fetch });
		store.registerModule('profiles', { namespaced: true, state: { defaultProfile: null } });

		wp = shallowMount(Component, { localVue, store, router });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-product-group', () => {
		expect(wp.vm.$options.name).toBe('v-product-group');
	});

	it('should show a correct title for accounts', async () => {
		await wp.setProps({ familyId: 'account' });
		expect(wp.find('h1').text()).toBe(wp.vm.$t('MY_PRODUCT.ALL.ACCOUNT'));
	});

	it('should show a correct title for currency accounts', async () => {
		const { $t } = wp.vm;

		await wp.setProps({ familyId: 'currency-usd-account' });
		expect(wp.find('h1').text()).toBe(
			$t('MY_PRODUCT.ALL.CURRENCY-ACCOUNT', { currency: $t('CURRENCY.USD') })
		);
	});

	it('should show a correct title for deposits', async () => {
		await wp.setProps({ familyId: 'deposit' });
		expect(wp.find('h1').text()).toBe(wp.vm.$t('MY_PRODUCT.ALL.DEPOSIT'));
	});

	it('should show a correct title for currency deposits', async () => {
		const { $t } = wp.vm;

		await wp.setProps({ familyId: 'currency-usd-deposit' });
		expect(wp.find('h1').text()).toBe(
			$t('MY_PRODUCT.ALL.CURRENCY-DEPOSIT', { currency: $t('CURRENCY.USD') })
		);
	});

	it('should show a correct title for debit cards', async () => {
		await wp.setProps({ familyId: 'debit-card' });
		expect(wp.find('h1').text()).toBe(wp.vm.$t('MY_PRODUCT.ALL.DEBIT-CARD'));
	});

	it('should show a correct title for credit cards', async () => {
		await wp.setProps({ familyId: 'credit-card' });
		expect(wp.find('h1').text()).toBe(wp.vm.$t('MY_PRODUCT.ALL.CREDIT-CARD'));
	});

	it('should show a correct title for loan', async () => {
		await wp.setProps({ familyId: 'loan' });
		expect(wp.find('h1').text()).toBe(wp.vm.$t('MY_PRODUCT.ALL.LOAN'));
	});

	it('should show a correct title for funds', async () => {
		await wp.setProps({ familyId: 'fund' });
		expect(wp.find('h1').text()).toBe(wp.vm.$t('MY_PRODUCT.ALL.FUND'));
	});

	it('should show a correct title for credit cards', async () => {
		await wp.setProps({ familyId: 'credit-card' });
		expect(wp.find('h1').text()).toBe(wp.vm.$t('MY_PRODUCT.ALL.CREDIT-CARD'));
	});

	it('should show a correct title for pending movements', async () => {
		await wp.setProps({ familyId: 'pending-movements' });
		expect(wp.find('h1').text()).toBe(wp.vm.$t('MY_PRODUCT.ALL.PENDING-MOVEMENTS'));
	});

	it('should show a balance card', async () => {
		await wp.setProps({ familyId: 'account' });
		await flushPromises();

		expect(
			wp
				.find('[data-testid="balance-card"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('493,80 € Saldo');
	});

	it('should not show a balance card', async () => {
		await wp.setProps({ familyId: 'debit-card' });
		await flushPromises();

		expect(wp.find('[data-testid="balance-card"]').exists()).toBeFalsy();
	});

	it('should navigate between tabs on deposits', async () => {
		await wp.setProps({ familyId: 'deposit' });
		await flushPromises();

		expect(wp.findComponent({ name: 'c-card-item' }).attributes('title')).toBe(
			'Depósito Caminos a plazos'
		);

		expect(wp.find('[data-testid="tabs-nav"]').exists()).toBeTruthy();

		await wp.find('[data-testid="tabs-nav"]').vm.$emit('select', 1);
		await flushPromises();

		expect(wp.findComponent({ name: 'c-card-item' }).attributes('title')).toBe(
			'Depósito Caminos a la vista'
		);
	});

	it('should navigate to product', async () => {
		const push = jest.spyOn(router, 'push');

		await wp.setProps({ familyId: 'account' });
		await flushPromises();
		await wp.findComponent({ name: 'c-card-item' }).trigger('click');

		expect(push).toHaveBeenCalledWith({
			name: 'product',
			params: { familyId: 'account', productId: 'account-1' },
		});
	});

	it('should call router back on error after navigate to product', async () => {
		await router.push({ name: 'product-group', params: { familyId: 'account' } });
		await wp.setProps({ familyId: 'account' });
		await flushPromises();

		const push = jest.spyOn(router, 'push').mockRejectedValue();
		const back = jest.spyOn(router, 'back');

		await wp.findComponent({ name: 'c-card-item' }).trigger('click');
		await flushPromises();

		expect(push).toHaveBeenCalled();
		expect(back).toHaveBeenCalled();
		expect(router.currentRoute.name).toBe('product-group');
	});

	it('should group products by same currency', async () => {
		await wp.setProps({ familyId: 'deposit' });
		await flushPromises();

		const items = wp.findAllComponents({ name: 'c-card-item' });

		expect(items).toHaveLength(2);

		expect(
			items
				.at(0)
				.attributes('info')
				.replace(/\s+/g, ' ')
		).toBe('123,45 €');

		expect(
			items
				.at(1)
				.attributes('info')
				.replace(/\s+/g, ' ')
		).toBe('123,45 €');
	});
});
