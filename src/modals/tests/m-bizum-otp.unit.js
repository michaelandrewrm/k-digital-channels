import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-bizum-otp.vue';
import CButton from '@tests/stubs/c-button.stub';
import CTextField from '@tests/stubs/c-text-field.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-bizum-otp.vue', () => {
	let wp;
	let store;

	const stubs = { LModal, CTextField, CButton };

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		wp = shallowMount(Component, { localVue, store, stubs });
	});

	it('has a name equal to m-bizum-otp', () => {
		expect(wp.vm.$options.name).toBe('m-bizum-otp');
	});

	/**
	 * El usuario no debería poder enviar el formulario sin ingresar
	 * previamente el código OTP de seis dígitos.
	 */
	it('cant send an empty otp', async () => {
		const sendOTP = jest.fn().mockResolvedValue();
		store.mockModule('bizum', { sendOTP });
		await wp.setProps({ signupId: 'abc' });

		expect(store.mockedActions['bizum/sendOTP']).not.toHaveBeenCalled();
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		expect(store.mockedActions['bizum/sendOTP']).not.toHaveBeenCalled();

		await wp.find('[data-testid="otp-code-input"]').setValue('123456');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		expect(store.mockedActions['bizum/sendOTP']).toHaveBeenCalled();
	});

	/**
	 * Debería enviar al servicio un codigo OTP junto con el signupId
	 */
	it('can send a valid otp', async () => {
		const sendOTP = jest.fn().mockResolvedValue();
		store.mockModule('bizum', { sendOTP });
		await wp.setProps({ signupId: 'abc' });

		await wp.find('[data-testid="otp-code-input"]').setValue('123456');
		await wp.find('[data-testid="send-otp-button"]').trigger('click');
		expect(store.mockedActions['bizum/sendOTP']).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ signupId: 'abc', otpValue: '123456' })
		);
	});
});
