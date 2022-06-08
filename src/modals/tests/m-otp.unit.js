import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@modals/m-otp.vue';
import CButton from '@tests/stubs/c-button.stub';
import CTextField from '@tests/stubs/c-text-field.stub';

import { OTP_INVALID, OTP_EXPIRED, OTP_ERROR } from '@modules/service/constants';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-otp.vue', () => {
	let wp;
	let store;
	let router;

	const LModal = {
		template: `
			<div class="l-modal" @keydown.capture="keyHandler">
				<slot name="header" />
				<slot />
				<slot name="buttons" />
				<slot name="actions" />
			</div>
		`,
		methods: {
			keyHandler: jest.fn(),
		},
	};

	const sendOTP = jest.fn().mockResolvedValue({ data: {}, status: 200 });
	const requestCode = jest.fn().mockResolvedValue();
	const openModal = jest.fn().mockResolvedValue();

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('otp', { send: sendOTP, requestCode });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { LModal, CButton, CTextField },
			sync: false,
		});
	});

	it('has a name equal to m-otp', () => {
		expect(wp.vm.$options.name).toBe('m-otp');
	});

	it('can not send an empty otp', async () => {
		expect.assertions(2);

		await wp.setProps({ processId: '123-abc-456-def', sca: false });

		expect(sendOTP).not.toHaveBeenCalled();

		wp.find('[data-testid="send-otp-button"]').trigger('click');

		expect(sendOTP).not.toHaveBeenCalled();
	});

	it('needs a valid processId', async () => {
		expect.assertions(2);

		expect(sendOTP).not.toHaveBeenCalled();

		await wp.find('[data-testid="otp-code-input"]').setValue('123456');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');

		expect(sendOTP).not.toHaveBeenCalled();
	});

	it('should send a valid otp', async () => {
		wp.setProps({ processId: '123-abc-456-def', sca: false });

		expect(sendOTP).not.toHaveBeenCalled();

		await wp.find('[data-testid="otp-code-input"]').setValue('123456');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');

		expect(sendOTP).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ processId: '123-abc-456-def', otpValue: '123456' })
		);

		await flushPromises();

		expect(wp.emitted('close')).toBeTruthy();

		sendOTP.mockRestore();
	});

	it('should ask for a new code after 30 sec', async () => {
		expect.assertions(3);

		wp.setProps({ processId: '123-abc-456-def', sca: false });

		expect(wp.find('[data-testid="ask-for-a-new-otp-code"]').exists()).toBeFalsy();

		jest.advanceTimersByTime(31000);
		await localVue.nextTick();

		expect(wp.find('[data-testid="ask-for-a-new-otp-code"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="ask-for-a-new-otp-code"]').text()).toBe(
			wp.vm.$t('OTP_RESEND_CODE')
		);
	});

	it('should ask for a new code when user clicks for it', async () => {
		store.unregisterModule('otp');
		store.mockModule('otp', {
			send: jest.fn().mockRejectedValue({
				response: {
					data: {
						errorCode: OTP_INVALID,
						additionalInfo: { processId: '123-abc-456-def' },
					},
				},
			}),
			requestCode,
		});

		wp.setProps({ processId: '123-abc-456-def', sca: false });

		expect(wp.vm.attempts).toBe(0);

		await wp.find('[data-testid="otp-code-input"]').setValue('666666');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		await flushPromises();

		expect(wp.vm.attempts).toBe(1);

		await wp.find('[data-testid="ask-for-a-new-otp-code"]').trigger('click');

		expect(requestCode).toHaveBeenCalledWith(expect.anything(), '123-abc-456-def');
	});

	it('does not allow words as otp code', async () => {
		expect.assertions(3);

		wp.setProps({ processId: '123-abc-456-def', sca: false });

		expect(sendOTP).not.toHaveBeenCalled();

		await wp.find('[data-testid="otp-code-input"]').setValue('resend');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');

		expect(sendOTP).not.toHaveBeenCalled();

		wp.find('[data-testid="otp-code-input"]').trigger('keydown.enter');

		expect(sendOTP).not.toHaveBeenCalled();
	});

	it('shows an error after an invalid attempt', async () => {
		store.unregisterModule('otp');
		store.mockModule('otp', {
			send: jest.fn().mockRejectedValue({
				response: {
					data: {
						errorCode: OTP_INVALID,
						additionalInfo: { processId: '123-abc-456-def' },
					},
				},
			}),
			requestCode,
		});

		wp.setProps({ processId: '123-abc-456-def', sca: false });

		expect(wp.vm.attempts).toBe(0);

		await wp.find('[data-testid="otp-code-input"]').setValue('666666');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		await flushPromises();

		expect(wp.vm.attempts).toBe(1);
		expect(wp.find('[data-testid="attempts-message"]').text()).toBe('Te quedan 2 intentos.');
		expect(wp.find('[data-testid="otp-code-validation"]').exists()).toBeTruthy();
	});

	it('shows go back after an invalid attempt', async () => {
		store.unregisterModule('otp');
		store.mockModule('otp', {
			send: jest.fn().mockRejectedValue({
				response: {
					data: {
						errorCode: 'nocode',
						additionalInfo: { processId: '123-abc-456-def' },
					},
				},
			}),
			requestCode,
		});

		wp.setProps({ processId: '123-abc-456-def', sca: false });

		expect(wp.vm.attempts).toBe(0);

		await wp.find('[data-testid="otp-code-input"]').setValue('666666');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		await flushPromises();

		expect(wp.emitted('close'));
	});

	it('shows the otp error modal on invalid OTP ', async () => {
		expect.assertions(1);

		store.unregisterModule('otp');
		store.mockModule('otp', {
			send: jest.fn().mockRejectedValue({ response: { data: { errorCode: OTP_INVALID } } }),
			requestCode,
		});
		store.mockModule('modal', { open: openModal });

		wp.setProps({ processId: '123-abc-456-def', sca: false });

		await wp.find('[data-testid="otp-code-input"]').setValue('666666');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		await flushPromises();

		expect(openModal).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-otp-error' })
		);
	});

	it('shows the blocked user modal on invalid OTP and SCA', async () => {
		expect.assertions(1);

		store.unregisterModule('otp');
		store.mockModule('otp', {
			send: jest.fn().mockRejectedValue({ response: { data: { errorCode: OTP_ERROR } } }),
			requestCode,
		});
		store.mockModule('modal', { open: openModal });

		wp.setProps({ processId: '123-abc-456-def', sca: true });

		await wp.find('[data-testid="otp-code-input"]').setValue('666666');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		await flushPromises();

		expect(openModal).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-sign-blocked' })
		);
	});

	it('shows the error otp modal on invalid OTP and not SCA', async () => {
		expect.assertions(1);

		store.unregisterModule('otp');
		store.mockModule('otp', {
			send: jest.fn().mockRejectedValue({ response: { data: { errorCode: OTP_ERROR } } }),
			requestCode,
		});
		store.mockModule('modal', { open: openModal });

		wp.setProps({ processId: '123-abc-456-def', sca: false });

		await wp.find('[data-testid="otp-code-input"]').setValue('666666');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		await flushPromises();

		expect(openModal).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-otp-error' })
		);
	});

	it('shows the expired otp modal on expired OTP', async () => {
		expect.assertions(1);

		store.unregisterModule('otp');
		store.mockModule('otp', {
			send: jest.fn().mockRejectedValue({ response: { data: { errorCode: OTP_EXPIRED } } }),
			requestCode,
		});
		store.mockModule('modal', { open: openModal });

		wp.setProps({ processId: '123-abc-456-def', sca: true });

		await wp.find('[data-testid="otp-code-input"]').setValue('666666');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		await flushPromises();

		expect(openModal).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-otp-expired' })
		);
	});

	it('should show a fatal error', async () => {
		store.unregisterModule('otp');
		store.mockModule('otp', {
			send: jest.fn().mockRejectedValue({ response: {} }),
			requestCode,
		});
		store.mockModule('modal', { open: openModal });

		wp.setProps({ processId: '123-abc-456-def', sca: false });

		await wp.find('[data-testid="otp-code-input"]').setValue('666666');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		await flushPromises();

		expect(openModal).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-otp-expired' })
		);
	});

	it('should show the help otp modal', async () => {
		store.unregisterModule('otp');
		store.mockModule('otp', {
			send: jest.fn().mockRejectedValue({
				response: {
					data: {
						errorCode: OTP_INVALID,
						additionalInfo: { processId: '123-abc-456-def' },
					},
				},
			}),
			requestCode,
		});
		store.mockModule('modal', { open: openModal });

		wp.setProps({ processId: '123-abc-456-def', sca: false });

		expect(wp.vm.attempts).toBe(0);

		await wp.find('[data-testid="otp-code-input"]').setValue('666666');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		await flushPromises();

		await wp.find('[data-testid="ask-for-a-new-otp-code"]').trigger('click');
		jest.runAllTimers();

		expect(wp.vm.attempts).toBe(1);

		await wp.find('[data-testid="otp-code-input"]').setValue('666666');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		await flushPromises();

		await wp.find('[data-testid="ask-for-a-new-otp-code"]').trigger('click');
		jest.runAllTimers();

		expect(wp.vm.attempts).toBe(2);

		await localVue.nextTick();

		const helpLink = wp.find('[data-testid="ask-for-otp-help"]');

		expect(helpLink.exists()).toBeTruthy();
		expect(helpLink.text()).toBe(wp.vm.$t('OTP_SHOW_HELP'));

		await helpLink.trigger('click');

		expect(openModal).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-otp-invalid' })
		);
	});
});
