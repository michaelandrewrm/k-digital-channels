import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-transfer.vue';
import flushPromises from 'flush-promises';
import accounts from '@tests/fixtures/products/accounts';
import orderedTransfers from '@tests/fixtures/transfers/ordered';
import SessionCache from '@modules/session/session-cache';
import CButton from '@tests/stubs/c-button.stub';

import { AMOUNT_OVER_LIMIT } from '@modules/move-money/constants';

jest.mock('@modules/session/session-cache');
jest.mock('lodash/debounce', () => jest.fn((cb) => cb));

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-transfer.vue', () => {
	let wp;
	let store;
	let router;

	const simulate = jest.fn().mockResolvedValue({
		data: { fee: { amount: 0 }, expense: { amount: 0 }, total: { amount: 0 } },
	});
	const transfer = jest.fn().mockResolvedValue();
	const getOrigins = jest.fn().mockResolvedValue(accounts);
	const getDestinations = jest.fn().mockResolvedValue();
	const getTransfer = jest.fn().mockResolvedValue();
	const modifyTransfer = jest.fn().mockResolvedValue();
	const deleteTransfer = jest.fn().mockResolvedValue();

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('move-money', {
			simulate,
			transfer,
			getOrigins,
			getDestinations,
			getTransfer,
			modifyTransfer,
			deleteTransfer,
		});

		wp = shallowMount(Component, { localVue, store, router });
	});

	afterEach(() => {});

	it('has a name equal to v-transfer', () => {
		expect(wp.vm.$options.name).toBe('v-transfer');
	});

	it('should start at the origin list', async () => {
		await flushPromises();
		expect(wp.find('[data-testid="form-origin"]').exists()).toBeTruthy();
	});

	it('should start at the new beneficiary form', async () => {
		wp = shallowMount(Component, { localVue, store, router });

		await router.push({
			name: 'transfer',
			params: { action: 'new' },
			query: { origin: 'account-1' },
		});
		await flushPromises();

		expect(wp.find('[data-testid="form-new-destination"]').exists()).toBeTruthy();
	});

	it('should stay at the origin list after service throw an error', async () => {
		const getOriginsAction = jest.fn().mockRejectedValue();
		store.mockModule('move-money', { getOrigins: getOriginsAction, getDestinations });

		wp = shallowMount(Component, { localVue, store, router });

		await router.push({
			name: 'transfer',
			params: { action: 'new' },
			query: { origin: 'account-1' },
		});
		await flushPromises();

		expect(wp.find('[data-testid="form-origin"]').exists()).toBeTruthy();
	});

	it('should show the origin list if the preselected origin does not exist', async () => {
		const getOriginsAction = jest.fn().mockResolvedValue([]);
		store.mockModule('move-money', { getOrigins: getOriginsAction, getDestinations });

		wp = shallowMount(Component, { localVue, store, router });

		await router.push({
			name: 'transfer',
			params: { action: 'new' },
			query: { origin: 'account-1' },
		});
		await flushPromises();

		expect(wp.find('[data-testid="form-origin"]').exists()).toBeTruthy();
	});

	it('should show a resume for a transfer to cancel', async () => {
		const getDestinationsAction = jest.fn().mockResolvedValue(accounts);
		const getTransferAction = jest.fn().mockResolvedValue(orderedTransfers[0]);
		store.mockModule('move-money', {
			getOrigins,
			getDestinations: getDestinationsAction,
			getTransfer: getTransferAction,
			deleteTransfer,
			simulate,
		});

		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { CButton },
		});

		await wp.setProps({ action: 'cancel', type: 'scheduled', transferId: 'transfer-1' });
		await flushPromises();

		expect(wp.find('[data-testid="header-title"]').text()).toBe('Anular transferencia');
		expect(wp.find('[data-testid="submit-transfer"]').text()).toBe('Anular transferencia');
		expect(wp.find('[data-testid="form-resume"]').exists()).toBeTruthy();

		await wp.find('[data-testid="submit-transfer"]').trigger('click');

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(deleteTransfer).toHaveBeenCalled();
		deleteTransfer.mockClear();
	});

	it('should show a resume for a transfer to modify', async () => {
		const getDestinationsAction = jest.fn().mockResolvedValue(accounts);
		const getTransferAction = jest.fn().mockResolvedValue(orderedTransfers[0]);
		store.mockModule('move-money', {
			getOrigins,
			getDestinations: getDestinationsAction,
			getTransfer: getTransferAction,
			modifyTransfer,
			simulate,
		});

		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { CButton },
		});

		await wp.setProps({ action: 'modify', type: 'scheduled', transferId: 'transfer-1' });
		await flushPromises();

		expect(wp.find('[data-testid="header-title"]').text()).toBe('Modificar transferencia');
		expect(wp.find('[data-testid="submit-transfer"]').text()).toBe('Modificar transferencia');
		expect(wp.find('[data-testid="form-resume"]').exists()).toBeTruthy();

		await wp.find('[data-testid="submit-transfer"]').trigger('click');

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(modifyTransfer).toHaveBeenCalled();
		modifyTransfer.mockClear();
	});

	it('should show a resume for a transfer to repeat', async () => {
		const clear = jest.spyOn(SessionCache, 'clear');
		const getDestinationsAction = jest.fn().mockResolvedValue(accounts);
		const getTransferAction = jest.fn().mockResolvedValue(orderedTransfers[0]);
		store.mockModule('move-money', {
			getOrigins,
			getDestinations: getDestinationsAction,
			getTransfer: getTransferAction,
			simulate,
			transfer,
		});

		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { CButton },
		});

		await wp.setProps({ action: 'repeat', type: 'orderer', transferId: 'transfer-1' });
		await flushPromises();

		expect(wp.find('[data-testid="header-title"]').text()).toBe('Repetir transferencia');
		expect(wp.find('[data-testid="submit-transfer"]').text()).toBe('Continuar');
		expect(wp.find('[data-testid="form-resume"]').exists()).toBeTruthy();

		await wp.find('[data-testid="submit-transfer"]').trigger('click');

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(transfer).toHaveBeenCalled();
		expect(clear).toHaveBeenCalledWith('transfers');
		expect(clear).toHaveBeenCalledWith('products');
		transfer.mockClear();
	});

	it('should not show the submit button after simulate throw an error', async () => {
		const getDestinationsAction = jest.fn().mockResolvedValue(accounts);
		const getTransferAction = jest.fn().mockResolvedValue(orderedTransfers[0]);
		const simulateAction = jest
			.fn()
			.mockRejectedValue({ response: { data: { errorCode: AMOUNT_OVER_LIMIT } } });
		store.mockModule('move-money', {
			getOrigins,
			getDestinations: getDestinationsAction,
			getTransfer: getTransferAction,
			simulate: simulateAction,
			transfer,
		});

		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { CButton },
		});

		await wp.setProps({ action: 'repeat', type: 'orderer', transferId: 'transfer-1' });
		await flushPromises();

		expect(wp.find('[data-testid="submit-transfer"]').exists()).toBeFalsy();
	});

	it('should show an error after confirm', async () => {
		const getDestinationsAction = jest.fn().mockResolvedValue(accounts);
		const getTransferAction = jest.fn().mockResolvedValue(orderedTransfers[0]);
		const simulateAction = jest.fn().mockRejectedValue({});
		store.mockModule('move-money', {
			getOrigins,
			getDestinations: getDestinationsAction,
			getTransfer: getTransferAction,
			simulate: simulateAction,
			transfer,
		});

		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { CButton },
		});

		await wp.setProps({ action: 'repeat', type: 'orderer', transferId: 'transfer-1' });
		await flushPromises();
		await wp.find('[data-testid="submit-transfer"]').trigger('click');

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="confirmation-error"]').exists()).toBeTruthy();
	});

	it('should show the transfer fees', async () => {
		const simulateAction = jest.fn().mockResolvedValue({
			expense: { amount: 10 },
			fee: { amount: 15 },
			total: { amount: 25 },
		});
		const getOriginsAction = jest.fn().mockResolvedValue(accounts);
		const getDestinationsAction = jest.fn().mockResolvedValue(accounts);
		const getTransferAction = jest.fn().mockResolvedValue(orderedTransfers[0]);
		store.mockModule('move-money', {
			getOrigins: getOriginsAction,
			getDestinations: getDestinationsAction,
			getTransfer: getTransferAction,
			simulate: simulateAction,
			transfer,
		});

		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { CButton },
		});

		await router.push({
			name: 'transfers',
			params: { action: 'new' },
			query: { origin: 'account-1' },
		});
		await flushPromises();

		const fixtureDestination = accounts[1];

		await wp.setData({
			model: {
				destination: {
					account: { type: 'IBAN', id: fixtureDestination.productNumber?.value },
					name: fixtureDestination.name,
					transferMode: '',
					view: { name: fixtureDestination.alias, id: fixtureDestination.productNumber?.value },
				},
				amount: { amount: 1, currency: { id: 'EUR' } },
			},
		});

		await flushPromises();
		expect(wp.find('[data-testid="form-fees"]').exists()).toBeTruthy();
	});

	it('should not trigger more than one click on confirm button', async () => {
		const getDestinationsAction = jest.fn().mockResolvedValue(accounts);
		const getTransferAction = jest.fn().mockResolvedValue(orderedTransfers[0]);
		store.mockModule('move-money', {
			getOrigins,
			getDestinations: getDestinationsAction,
			getTransfer: getTransferAction,
			modifyTransfer,
			simulate,
		});

		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { CButton },
		});

		await wp.setProps({ action: 'modify', type: 'scheduled', transferId: 'transfer-1' });
		await flushPromises();

		expect(modifyTransfer).toHaveBeenCalledTimes(0);

		await wp.find('[data-testid="submit-transfer"]').trigger('click');
		await wp.find('[data-testid="submit-transfer"]').trigger('click');
		await wp.find('[data-testid="submit-transfer"]').trigger('click');

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(modifyTransfer).toHaveBeenCalledTimes(1);
	});
});
