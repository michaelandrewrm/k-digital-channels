import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-amortization-table.vue';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-amortization-table.vue', () => {
	let shallowWrapper;
	let store;
	let router;

	beforeEach(() => {
		const { localStore, localRouter } = newInstance;

		store = localStore;
		router = localRouter;

		shallowWrapper = shallowMount(Component, {
			localVue,
			store,
			router,
			sync: false,
		});
	});

	it('has a name equal to v-amortization-table', () => {
		expect(shallowWrapper.vm.$options.name).toBe('v-amortization-table');
	});

	it('shows a list of installments', async () => {
		expect.assertions(1);

		const { _actions: actions } = store;
		const repaymentsGet = actions['repayments/get'];

		repaymentsGet[0] = jest.fn().mockResolvedValue({
			elements: [
				{
					number: 1,
					date: '2014-10-30',
					amount: { amount: 120, currency: { id: 'EUR' } },
					pendingAmount: { amount: 1080, currency: { id: 'EUR' } },
					interest: { amount: 20, currency: { id: 'EUR' } },
					installment: { amount: 25, currency: { id: 'EUR' } },
				},
				{
					number: 2,
					date: '2014-10-30',
					amount: { amount: 120, currency: { id: 'EUR' } },
					pendingAmount: { amount: 1080, currency: { id: 'EUR' } },
					interest: { amount: 20, currency: { id: 'EUR' } },
					installment: { amount: 25, currency: { id: 'EUR' } },
				},
			],
			tae: 10,
			totalAmount: { amount: 1200, currency: { id: 'EUR' } },
			totalInterest: { amount: 120, currency: { id: 'EUR' } },
			totalInstallment: { amount: 1200, currency: { id: 'EUR' } },
		});

		shallowWrapper.setProps({ productId: 1234 });
		await flushPromises();

		expect(shallowWrapper.findAll('[data-testid="installments"]').length).toBe(2);
	});
});
