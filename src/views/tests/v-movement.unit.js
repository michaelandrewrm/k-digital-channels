import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-movement.vue';
import accounts from '@tests/fixtures/products/accounts';
import CTextField from '@tests/stubs/c-text-field.stub';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const blob = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

describe('v-movement.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = {
		id: 'movement-1',
		balance: { amount: 123.45, currency: { id: 'EUR' } },
		type: { id: 'RB', name: 'Recibo' },
		valueDate: '2020-04-30T17:18:21.650Z',
		operationDate: '2020-04-30T17:18:21.650Z',
		amount: { amount: -123.45, currency: { id: 'EUR' } },
		reason: 'Recibo luz',
		reference: 'reference-1',
		movementCoreId: 'movement-core-1',
	};

	const productsGet = jest.fn().mockResolvedValue(accounts[0]);
	const resourcesGet = jest.fn().mockResolvedValue(fixture);
	const getReceipt = jest.fn().mockResolvedValue(blob);
	const getCertificate = jest.fn().mockResolvedValue(blob);

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.registerModule('app', { namespaced: true, state: { companyId: 'BC' } });
		store.mockModule('products', { get: productsGet, getReceipt, getCertificate });
		store.mockModule('resources', { get: resourcesGet });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: {
				productId: 'account-1',
				productType: 'account',
				movementId: 'movement-1',
				familyId: 'account',
			},
			stubs: {
				'w-movement-sheet-account': true,
				'w-movement-detail-account': true,
				'c-icon-button': CButton,
				'c-transfer-textarea': CTextField,
			},
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-movement', () => {
		expect(wp.vm.$options.name).toBe('v-movement');
	});

	it('should render the widget correctly', async () => {
		jest.runAllTimers();
		await flushPromises();

		expect(
			wp
				.findComponent({ name: 'c-acrylic-sheet' })
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Recibo luz -123,45 € Cuenta: 123,45 €');
	});

	it('should render the detail correctly', async () => {
		jest.runAllTimers();
		await flushPromises();

		expect(wp.find('.w-movement-detail-account').exists()).toBeTruthy();
	});

	it('should show an error', async () => {
		const get = jest.fn().mockRejectedValue();
		store.mockModule('resources', { get });

		jest.runAllTimers();
		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
	});

	it('should download a pdf detail', async () => {
		const openAction = jest.fn().mockResolvedValue();
		store.mockModule('notification', { open: openAction });

		jest.runAllTimers();
		await flushPromises();

		await wp.find('[data-testid="download-document"]').trigger('click');
		await flushPromises();

		expect(openAction).toHaveBeenCalled();
		expect(getReceipt).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				productId: 'account-1',
				movementId: 'movement-1',
				query: { reference: 'reference-1' },
				reportType: 'pdf',
			})
		);
		expect(openAction.mock.calls[0][1].props.channel.port1.postMessage).toHaveBeenCalledWith({
			name: 'downloaded',
			blob: expect.any(Blob),
			b64Data: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
		});
	});

	it('should fail downloading a pdf detail', async () => {
		const openAction = jest.fn().mockResolvedValue();
		const getReceiptAction = jest.fn().mockRejectedValue();
		store.mockModule('notification', { open: openAction });
		store.mockModule('products', { get: productsGet, getReceipt: getReceiptAction });

		jest.runAllTimers();
		await flushPromises();

		await wp.find('[data-testid="download-document"]').trigger('click');
		await flushPromises();

		expect(openAction).toHaveBeenCalled();
		expect(getReceiptAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				productId: 'account-1',
				movementId: 'movement-1',
				query: { reference: 'reference-1' },
				reportType: 'pdf',
			})
		);
		expect(openAction.mock.calls[0][1].props.channel.port1.postMessage).toHaveBeenCalledWith({
			name: 'error',
		});
	});

	it('should download a transfer certificate', async () => {
		const getAction = jest
			.fn()
			.mockResolvedValue({ ...fixture, type: { id: 'TR', name: 'Transfer' } });
		const openAction = jest.fn().mockResolvedValue();
		store.mockModule('resources', { get: getAction });
		store.mockModule('notification', { open: openAction });

		jest.runAllTimers();
		await flushPromises();

		await wp.find('[data-testid="download-certificate"]').trigger('click');
		await flushPromises();

		expect(openAction).toHaveBeenCalled();
		expect(getCertificate).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				productId: 'account-1',
				movementId: 'movement-1',
				query: { reference: 'reference-1' },
			})
		);
		expect(openAction.mock.calls[0][1].props.channel.port1.postMessage).toHaveBeenCalledWith({
			name: 'downloaded',
			blob: expect.any(Blob),
			b64Data: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
		});
	});

	it('should go back when no detail', async () => {
		const back = jest.spyOn(router, 'back');
		const getAction = jest.fn().mockResolvedValue();

		store.mockModule('resources', { get: getAction });

		jest.runAllTimers();
		await flushPromises();

		expect(back).toHaveBeenCalled();
	});

	it('should show a comment', async () => {
		const getAction = jest
			.fn()
			.mockResolvedValue({ ...fixture, comment: { comment: '', commentId: 'comment-1' } });
		store.mockModule('resources', { get: getAction });

		jest.runAllTimers();
		await flushPromises();

		expect(wp.find('[data-testid="comment"]').exists()).toBeTruthy();
	});

	it('should not enable delete and send options on empty comments', async () => {
		const getAction = jest
			.fn()
			.mockResolvedValue({ ...fixture, comment: { comment: '', commentId: 'comment-1' } });
		store.mockModule('resources', { get: getAction });

		jest.runAllTimers();
		await flushPromises();

		expect(wp.find('[data-testid="options-send"]').attributes('disabled')).toBeTruthy();
		expect(wp.find('[data-testid="options-delete"]').attributes('disabled')).toBeTruthy();
	});

	it('should not enable a send option when a comment has not been updated', async () => {
		const getAction = jest.fn().mockResolvedValue({
			...fixture,
			comment: { comment: 'last comment', commentId: 'comment-1' },
		});
		store.mockModule('resources', { get: getAction });

		jest.runAllTimers();
		await flushPromises();

		await wp.find('[data-testid="comment-input"]').setValue('last comment');

		expect(wp.find('[data-testid="options-send"]').attributes('disabled')).toBeTruthy();
		expect(wp.find('[data-testid="options-delete"]').attributes('disabled')).toBeFalsy();
	});

	it('should request a comment update and disable the send button', async () => {
		const getAction = jest.fn().mockResolvedValue({
			...fixture,
			comment: { comment: 'last comment', commentId: 'comment-1' },
		});
		const putComment = jest
			.fn()
			.mockResolvedValue({ comment: 'new comment', commentId: 'comment-1' });
		const openAction = jest.fn().mockResolvedValue();
		store.mockModule('resources', { get: getAction, putComment });
		store.mockModule('notification', { open: openAction });

		jest.runAllTimers();
		await flushPromises();

		await wp.find('[data-testid="comment-input"]').setValue('new comment');
		wp.find('[data-testid="options-send"]').trigger('click');
		await flushPromises();

		expect(putComment).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				productId: 'account-1',
				movementId: 'movement-1',
				comment: 'new comment',
				commentId: 'comment-1',
			})
		);
		expect(openAction).toHaveBeenCalled();

		await localVue.nextTick();

		expect(wp.find('[data-testid="options-send"]').attributes('disabled')).toBeTruthy();
	});

	it('should request a comment delete and disable the delete button', async () => {
		const getAction = jest.fn().mockResolvedValue({
			...fixture,
			comment: { comment: 'last comment', commentId: 'comment-1' },
		});
		const deleteComment = jest.fn().mockResolvedValue({ comment: '', commentId: 'comment-1' });
		const openAction = jest.fn().mockResolvedValue();
		store.mockModule('resources', { get: getAction, deleteComment });
		store.mockModule('notification', { open: openAction });

		jest.runAllTimers();
		await flushPromises();

		wp.find('[data-testid="options-delete"]').trigger('click');
		await flushPromises();

		expect(deleteComment).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				productId: 'account-1',
				movementId: 'movement-1',
			})
		);
		expect(openAction).toHaveBeenCalled();

		await localVue.nextTick();

		expect(wp.find('[data-testid="options-delete"]').attributes('disabled')).toBeTruthy();
	});

	it('should request for create comment instead of update', async () => {
		const get = jest.fn().mockResolvedValue(fixture);
		const postComment = jest
			.fn()
			.mockResolvedValue({ comment: 'new comment', commentId: 'comment-1' });
		const openAction = jest.fn().mockResolvedValue();
		store.mockModule('resources', { get, postComment });
		store.mockModule('notification', { open: openAction });

		jest.runAllTimers();
		await flushPromises();

		await wp.find('[data-testid="comment-input"]').setValue('new comment');
		wp.find('[data-testid="options-send"]').trigger('click');
		await flushPromises();

		expect(postComment).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				productId: 'account-1',
				movementId: 'movement-1',
				comment: 'new comment',
			})
		);
		expect(openAction).toHaveBeenCalled();

		await localVue.nextTick();

		expect(wp.find('[data-testid="options-send"]').attributes('disabled')).toBeTruthy();
	});

	it('should show comment is 200 characters', async () => {
		const getAction = jest.fn().mockResolvedValue({
			...fixture,
			comment: { comment: 'new comment', commentId: 'comment-1' },
		});
		store.mockModule('resources', { get: getAction });

		jest.runAllTimers();
		await flushPromises();

		expect(wp.find('[data-testid="comment-invalid"]').exists()).toBeFalsy();

		await wp.find('[data-testid="comment-input"]').setValue('a'.repeat(200));

		expect(wp.find('[data-testid="comment-invalid"]').exists()).toBeTruthy();
	});

	it('should request for return receipt', async () => {
		const openAction = jest.fn().mockResolvedValue();
		store.mockModule('modal', { open: openAction });

		jest.runAllTimers();
		await flushPromises();

		await wp.find('[data-testid="return-receipt"]').trigger('click');

		expect(openAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-return-receipt' }),
				props: {
					movementId: 'movement-1',
					productNumber: 'ES3102340098375445122708',
					receiptId: 'movement-core-1',
				},
			})
		);
	});
});
