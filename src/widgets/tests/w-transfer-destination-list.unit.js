import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-destination-list.vue';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-destination-list.vue', () => {
	let store;

	const fixture = [
		{
			id: 'cfc2f9a0-ec13-4889-b624-8738cdbd24df',
			alias: 'Cuenta Corriente',
			productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: '2708' },
			postedBalance: { amount: 1801.14, currency: { id: 'EUR' } },
			ownAccount: true,
		},
		{
			id: '00bc5eb3-8113-454e-a283-43214a9f5077',
			alias: 'Cuenta Transparente',
			productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: '8557' },
			postedBalance: { amount: 826.74, currency: { id: 'EUR' } },
			ownAccount: true,
		},
	];

	const moveMoneyOK = {
		namespaced: true,
		actions: { getDestinations: jest.fn().mockResolvedValue(fixture) },
	};

	const moveMoneyKO = {
		namespaced: true,
		actions: { getDestinations: jest.fn().mockRejectedValue() },
	};

	const moveMoneyRetry = {
		namespaced: true,
		actions: {
			getDestinations: jest
				.fn()
				.mockRejectedValueOnce()
				.mockImplementation(() => {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(fixture);
						}, 1000);
					});
				}),
		},
	};

	beforeEach(() => {
		const { localStore } = newInstance;

		store = localStore;
		store.registerModule('move-money', moveMoneyOK);
	});

	it('has a name equal to w-transfer-destination-list', () => {
		const wp = shallowMount(Component, { localVue, store });

		expect(wp.vm.$options.name).toBe('w-transfer-destination-list');
	});

	it('renders correctly', async () => {
		const wp = shallowMount(Component, { localVue, store });

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="list"]').element).toMatchSnapshot();
	});

	it('shows an error when the service fails', async () => {
		const { localStore } = newInstance;

		store = localStore;
		store.registerModule('move-money', moveMoneyKO);

		const wp = shallowMount(Component, { localVue, store });

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
	});

	it('can retry a request if its fails', async () => {
		const { localStore } = newInstance;

		store = localStore;
		store.registerModule('move-money', moveMoneyRetry);
		jest.useFakeTimers();

		const wp = shallowMount(Component, { localVue, store });

		await flushPromises();

		wp.find('[data-testid="error"] a').trigger('click');
		await wp.vm.$nextTick();

		jest.advanceTimersToNextTimer(1);
		await flushPromises();
		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="loading"]').exists()).toBeTruthy();

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="list"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="loading"]').exists()).toBeFalsy();
	});

	it('emit an event when select a product', async () => {
		const wp = shallowMount(Component, { localVue, store });

		await flushPromises();

		await wp.find('[data-testid="list"] button').trigger('click');

		expect(wp.emitted().select).toBeTruthy();
	});
});
