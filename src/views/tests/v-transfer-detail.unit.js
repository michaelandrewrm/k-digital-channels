import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-transfer-detail.vue';
import orderedTransfers from '@tests/fixtures/transfers/ordered';
import accounts from '@tests/fixtures/products/accounts';
import scheduledTransfers from '@tests/fixtures/transfers/scheduled';

const [fixture] = orderedTransfers;
const newInstance = createPristineVue();
const { localVue } = newInstance;

const [fixtureProduct] = accounts;
const STATUS_ENABLED = { id: '01' };
const STATUS_DISABLED = { id: '98' };
const blob = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

describe('v-transfer-detail.vue', () => {
	let wp;
	let store;
	let router;

	const WActions = {
		props: ['options'],
		template: `
			<div>
				<button
					v-for="option in options"
					:key="option.id"
					:data-testid="option.id"
					@click="option.action"
				>
					{{ option.title }}
				</button>
			</div>`,
	};

	const getOrigins = jest.fn().mockResolvedValue([{ ...fixtureProduct, status: STATUS_ENABLED }]);
	const getTransfer = jest.fn().mockResolvedValue(fixture);
	const deleteTransfer = jest.fn().mockResolvedValue();
	const getReceipt = jest.fn().mockResolvedValue(blob);

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore, localRouter } = newInstance;
		store = shallowStore;
		router = localRouter;

		store.mockModule('move-money', { getOrigins, getTransfer, deleteTransfer, getReceipt });

		wp = shallowMount(Component, { localVue, store, router });
	});

	it('has a name equal to v-transfer-detail', () => {
		expect(wp.vm.$options.name).toBe('v-transfer-detail');
	});

	it('should render correctly', async () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'ordered', transferId: 'transfer-1' },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(getTransfer).toHaveBeenCalled();
		expect(getOrigins).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ type: 'transferList' })
		);
		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="header-title"]').text()).toBe('Detalle de transferencia');
		expect(
			wp
				.findComponent({ name: 'c-acrylic-sheet' })
				.text()
				.replace(/\s+/g, ' ')
		).toBe('reason-1 123,45 € Cuenta Corriente **** **** **** **** **** 2708');
		expect(wp.find('[data-testid="data"]').exists()).toBeTruthy();
	});

	it('shows an error when the service fails', async () => {
		const getTransferAction = jest.fn().mockRejectedValue();
		store.mockModule('move-money', { getTransfer: getTransferAction, getOrigins });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'ordered', transferId: 'transfer-1' },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="data"]').exists()).toBeFalsy();
	});

	it('shows a loading skeleton on delay', async () => {
		const getTransferAction = jest
			.fn()
			.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(fixture), 1000)));
		store.mockModule('move-money', { getTransfer: getTransferAction, getOrigins });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'ordered', transferId: 'transfer-1' },
		});

		jest.advanceTimersToNextTimer(1);
		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="data"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="loading"]').exists()).toBeTruthy();

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="data"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="loading"]').exists()).toBeFalsy();
	});

	it('can retry a request if its fails', async () => {
		const getTransferAction = jest
			.fn()
			.mockRejectedValueOnce({ response: 500 })
			.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(fixture), 1000)));
		store.mockModule('move-money', { getTransfer: getTransferAction, getOrigins });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'ordered', transferId: 'transfer-1' },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		await wp.find('[data-testid="error"] a').trigger('click');

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="data"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="loading"]').exists()).toBeTruthy();

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="data"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="loading"]').exists()).toBeFalsy();
	});

	it('should show repeat button for ordered transfers', async () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'ordered', transferId: 'transfer-1' },
			stubs: { 'w-actions': WActions },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="repeat-transfer"]').exists()).toBeTruthy();
	});

	it('should trigger repeat button for ordered transfers', async () => {
		const push = jest.spyOn(router, 'push');

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'ordered', transferId: 'transfer-1' },
			stubs: { 'w-actions': WActions },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		wp.find('[data-testid="repeat-transfer"]').trigger('click');
		expect(push).toHaveBeenCalledWith({
			name: 'transfer',
			params: { action: 'repeat', type: 'ordered', transferId: 'transfer-1' },
		});
	});

	it('should show cancel button for scheduled transfers', async () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'scheduled', transferId: 'transfer-1' },
			stubs: { 'w-actions': WActions },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="cancel-transfer"]').exists()).toBeTruthy();
	});

	it('should trigger cancel button for scheduled transfers', async () => {
		const push = jest.spyOn(router, 'push');

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'scheduled', transferId: 'transfer-1' },
			stubs: { 'w-actions': WActions },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		wp.find('[data-testid="cancel-transfer"]').trigger('click');
		expect(push).toHaveBeenCalledWith({
			name: 'transfer',
			params: { action: 'cancel', type: 'scheduled', transferId: 'transfer-1' },
		});
	});

	it('should show repeat and delete buttons for favorite transfers', async () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'favorite', transferId: 'transfer-1' },
			stubs: { 'w-actions': WActions },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="repeat-transfer"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="delete-transfer"]').exists()).toBeTruthy();
	});

	it('should trigger repeat and delete buttons for favorite transfers', async () => {
		const back = jest.spyOn(router, 'back');
		const push = jest.spyOn(router, 'push');
		const openModal = jest.fn().mockResolvedValue(true);
		const openNotification = jest.fn().mockResolvedValue(true);
		store.mockModule('modal', { open: openModal });
		store.mockModule('notification', { open: openNotification });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'favorite', transferId: 'transfer-1' },
			stubs: { 'w-actions': WActions },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		wp.find('[data-testid="repeat-transfer"]').trigger('click');
		expect(push).toHaveBeenCalledWith({
			name: 'transfer',
			params: { action: 'repeat', type: 'favorite', transferId: 'transfer-1' },
		});

		push.mockReset();

		wp.find('[data-testid="delete-transfer"]').trigger('click');
		await flushPromises();

		expect(deleteTransfer).toHaveBeenCalled();
		expect(back).toHaveBeenCalled();
		expect(openNotification).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ text: 'Transferencia favorita eliminada con éxito' })
		);
	});

	it('should show an error if transfer deletion fails', async () => {
		const openModal = jest.fn().mockResolvedValue(true);
		const openNotification = jest.fn().mockResolvedValue(true);
		const deleteTransferAction = jest.fn().mockRejectedValue();
		store.mockModule('modal', { open: openModal });
		store.mockModule('notification', { open: openNotification });
		store.mockModule('move-money', {
			getTransfer,
			getOrigins,
			deleteTransfer: deleteTransferAction,
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'favorite', transferId: 'transfer-1' },
			stubs: { 'w-actions': WActions },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		wp.find('[data-testid="delete-transfer"]').trigger('click');
		await flushPromises();

		expect(deleteTransfer).toHaveBeenCalled();
		expect(openNotification).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'Algo no ha ido bien, por favor, inténtalo de nuevo mas tarde.',
			})
		);
	});

	it('should not show cancel button for not cancellable ordered transfers', async () => {
		const getTransferAction = jest.fn().mockResolvedValue({ ...fixture, isCancellable: false });
		store.mockModule('move-money', { getTransfer: getTransferAction, getOrigins });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'ordered', transferId: 'transfer-1' },
			stubs: { 'w-actions': WActions },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="repeat-transfer"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="cancel-transfer"]').exists()).toBeFalsy();
	});

	it('should not show repeat button for transfers in USD', async () => {
		const conditions = {
			amount: { amount: 123.45, currency: { id: 'USD' } },
		};
		const getTransferAction = jest.fn().mockResolvedValue({ ...fixture, ...conditions });
		store.mockModule('move-money', { getTransfer: getTransferAction, getOrigins });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'ordered', transferId: 'transfer-1' },
			stubs: { 'w-actions': WActions },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="repeat-transfer"]').exists()).toBeFalsy();
	});

	it('should not show actions for disabled accounts', async () => {
		const getOriginsActions = jest
			.fn()
			.mockResolvedValue([{ ...fixtureProduct, status: STATUS_DISABLED }]);
		store.mockModule('move-money', { getTransfer, getOrigins: getOriginsActions });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'ordered', transferId: 'transfer-1' },
			stubs: { 'w-actions': WActions },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="repeat-transfer"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="cancel-transfer"]').exists()).toBeFalsy();
	});

	it('should not show cancel button for no SEPA transfers', async () => {
		const conditions = {
			transferMode: { id: 'INTERNATIONAL', name: 'INTERNATIONAL' },
		};
		const getTransferAction = jest.fn().mockResolvedValue({ ...fixture, ...conditions });
		store.mockModule('move-money', { getTransfer: getTransferAction, getOrigins });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'ordered', transferId: 'transfer-1' },
			stubs: { 'w-actions': WActions },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="cancel-transfer"]').exists()).toBeFalsy();
	});

	it('should show the correct frequency for scheduled transfers', async () => {
		const getTransferAction = jest.fn().mockResolvedValue(scheduledTransfers[1]);
		store.mockModule('move-money', { getTransfer: getTransferAction, getOrigins });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { type: 'scheduled', transferId: 'transfer-1' },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="frequency-label"]').attributes('description')).toBe('Bimestral');
	});

	it('should download the receipt', async () => {
		const open = jest.fn();
		store.mockModule('move-money', { getOrigins, getTransfer, deleteTransfer, getReceipt });
		store.mockModule('notification', { open });

		wp = await shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'ordered', transferId: 'transfer-1' },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		await wp.find('[data-testid="download-document"]').trigger('click');
		await flushPromises();

		expect(getReceipt).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				reference: 'reference-1',
				transferMode: 'SEPA',
				reportType: 'pdf',
			})
		);

		expect(open.mock.calls[0][1].props.channel.port1.postMessage).toHaveBeenCalledWith({
			name: 'downloaded',
			blob: expect.any(Blob),
			b64Data: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
		});
	});

	it('should fail downloading the receipt', async () => {
		const open = jest.fn();
		const getReceiptAction = jest.fn().mockRejectedValue();
		store.mockModule('move-money', {
			getOrigins,
			getTransfer,
			deleteTransfer,
			getReceipt: getReceiptAction,
		});
		store.mockModule('notification', { open });

		jest.useFakeTimers();

		wp = await shallowMount(Component, {
			localVue,
			store,
			propsData: { type: 'ordered', transferId: 'transfer-1' },
		});

		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		await wp.find('[data-testid="download-document"]').trigger('click');
		await flushPromises();

		expect(getReceipt).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				reference: 'reference-1',
				transferMode: 'SEPA',
				reportType: 'pdf',
			})
		);

		expect(open.mock.calls[0][1].props.channel.port1.postMessage).toHaveBeenCalledWith({
			name: 'error',
		});
	});
});
