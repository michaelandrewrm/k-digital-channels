import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-list.vue';
import WList from '@tests/stubs/w-list.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-list.vue', () => {
	let store;

	const fixture = [
		{
			id: '6425efa7-2498-47ae-96c7-dcd0ed6f761e',
			orderer: {
				fromAccount: {
					id: 'cfc2f9a0-ec13-4889-b624-8738cdbd24df',
					productNumber: {
						format: { id: 'IBAN', name: 'IBAN' },
						value: 'ES3102340098375445122708',
					},
					alias: 'Cuenta Corriente',
				},
			},
			beneficiary: {
				toAccount: {
					productNumber: {
						format: { id: 'IBAN' },
						value: 'BA051007492508990020',
					},
				},
				description: 'Pablo Anaya',
			},
			reason: 'Quod doloribus perspiciatis est minus suscipit animi.',
			amount: { amount: 233.59, currency: { id: 'EUR' } },
			date: '2020-03-04T07:52:46.460Z',
			operationDate: '2020-01-20T05:33:40.375Z',
			status: { id: 'PAID' },
		},
		{
			id: '44459764-b778-4a05-9442-2e3cafd2de5e',
			orderer: {
				fromAccount: {
					id: 'cfc2f9a0-ec13-4889-b624-8738cdbd24df',
					productNumber: {
						format: { id: 'IBAN', name: 'IBAN' },
						value: 'ES3102340098375445122708',
					},
					alias: 'Cuenta Corriente',
				},
			},
			beneficiary: {
				toAccount: {
					productNumber: {
						format: { id: 'IBAN' },
						value: 'GR34140902574W4426DU3218902',
					},
				},
				description: 'Eloisa Ontiveros',
			},
			reason: 'Sequi assumenda aut quis harum ea non natus.',
			amount: { amount: 922.51, currency: { id: 'EUR' } },
			date: '2020-02-01T11:29:31.653Z',
			operationDate: '2019-09-27T14:04:41.111Z',
			status: { id: 'REJECTED' },
		},
	];

	beforeEach(() => {
		const { localStore } = newInstance;

		store = localStore;
	});

	it('has a name equal to w-transfer-list', () => {
		const request = jest.fn().mockResolvedValue(fixture);

		store.registerModule('move-money', {
			namespaced: true,
			actions: { getTransfers: request },
		});

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'ordered' },
		});

		expect(wp.vm.$options.name).toBe('w-transfer-list');
	});

	it('renders correctly', async () => {
		const request = jest.fn().mockResolvedValue(fixture);

		store.registerModule('move-money', {
			namespaced: true,
			actions: { getTransfers: request },
		});

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'ordered', productId: 'cfc2f9a0-ec13-4889-b624-8738cdbd24df' },
			stubs: {
				WList,
				WTransferOrdered: { template: '<div class="w-transfer-ordered"></div>' },
			},
		});

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeTruthy();
	});

	it('shows an error when the service fails', async () => {
		const request = jest.fn().mockRejectedValue();

		store.registerModule('move-money', {
			namespaced: true,
			actions: { getTransfers: request },
		});

		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'ordered', productId: 'cfc2f9a0-ec13-4889-b624-8738cdbd24df' },
			stubs: {
				WList,
				WTransferOrdered: { template: '<div class="w-transfer-ordered"></div>' },
			},
		});

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
	});
});
