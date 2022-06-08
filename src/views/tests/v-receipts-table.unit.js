import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-receipts-table.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-receipts-table.vue', () => {
	let wp;
	let store;

	const resourcesOK = {
		namespaced: true,
		actions: {
			fetch: jest.fn().mockResolvedValue({
				data: [
					{ pendingAmount: { amount: 10, currency: { id: 'EUR' } } },
					{ pendingAmount: { amount: 14, currency: { id: 'EUR' } } },
				],
			}),
		},
	};

	beforeEach(() => {
		const { localStore } = newInstance;
		store = localStore;

		store.registerModule('resources', resourcesOK);

		wp = shallowMount(Component, {
			localVue,
			store,
		});
	});

	it('has a name equal to v-receipts-table', () => {
		expect(wp.vm.$options.name).toBe('v-receipts-table');
	});

	it('renders correctly', async () => {
		await wp.setProps({ productId: '1234' });
		await flushPromises();

		expect(wp.find('[data-testid="total"]').text()).toContain('24,00');
	});
});
