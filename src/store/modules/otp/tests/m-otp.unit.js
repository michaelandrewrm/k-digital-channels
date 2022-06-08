import otp from '@modules/otp/m-otp';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';

describe('m-otp', () => {
	let store;
	let storeMocked;

	beforeEach(async () => {
		const localVue = createLocalVue();
		localVue.use(Vuex);

		storeMocked = {
			modal: {
				namespaced: true,
				actions: { open: jest.fn(() => true) },
			},
			service: {
				namespaced: true,
				actions: { request: jest.fn() },
			},
			authn: {
				namespaced: true,
				state: { loggedIn: false },
			},
		};

		store = new Vuex.Store({
			modules: { ...storeMocked, otp },
		});
	});

	it('calls the service to send an otp', async () => {
		expect.assertions(2);

		expect(storeMocked.service.actions.request).not.toHaveBeenCalled();

		await store.dispatch('otp/send', {
			processId: 1234,
			otpValue: 123456,
		});

		expect(storeMocked.service.actions.request).toHaveBeenCalled();
	});

	it('calls the service asking a new code', async () => {
		expect.assertions(2);

		expect(storeMocked.service.actions.request).not.toHaveBeenCalled();

		const processId = 1234;
		await store.dispatch('otp/requestCode', processId);

		expect(storeMocked.service.actions.request).toHaveBeenCalled();
	});

	it('opens a modal on a request handling otp', async () => {
		expect.assertions(2);

		expect(storeMocked.modal.actions.open).not.toHaveBeenCalled();

		const modal = { name: 'm-test' };
		const props = { processId: 120000 };

		await store.dispatch('otp/handle', { component: modal, props });

		expect(storeMocked.modal.actions.open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ component: { name: 'm-test' }, props })
		);
	});

	it('disables modal on bridge mode', async () => {
		await store.dispatch('otp/disableModal');

		expect(storeMocked.modal.actions.open).not.toHaveBeenCalled();

		const modal = { name: 'm-test' };
		const props = { processId: 120000 };

		const handle = store.dispatch('otp/handle', { component: modal, props });

		window.postMessage(
			{
				name: 'bridge-response-otp',
				payload: { resolved: true },
			},
			'*'
		);

		expect(storeMocked.modal.actions.open).not.toHaveBeenCalled();

		const response = await handle;

		expect(response).toMatchObject({ resolved: true });
	});
});
