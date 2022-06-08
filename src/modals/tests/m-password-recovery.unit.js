import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@modals/m-password-recovery.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';
import CTransferField from '@tests/stubs/c-text-field.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-password-recovery.vue', () => {
	let wp;
	let store;

	const recoverPassword = jest.fn().mockResolvedValue();
	const open = jest.fn().mockResolvedValue();
	const closeAll = jest.fn();
	const removeSession = jest.fn();

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('user', { recoverPassword });
		store.mockModule('modal', { open, closeAll });
		store.mockModule('secure', { removeSession });

		wp = shallowMount(Component, { localVue, store, stubs: { LModal, CButton, CTransferField } });
	});

	it('has a name equal to m-password-recovery', () => {
		expect(wp.vm.$options.name).toBe('m-password-recovery');
	});

	it('should emit a close event and delete session on cancel button', async () => {
		await wp.find('[data-testid="cancel"]').trigger('click');
		expect(wp.emitted('close')).toBeTruthy();
		expect(removeSession).toHaveBeenCalled();
	});

	it('should show an error after invalid characters on document number', async () => {
		await wp.find('[data-testid="id-number"]').setValue('@');

		expect(
			wp
				.find('[for="m-password-recovery__id-number"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('El campo contiene caracteres no permitidos');
	});

	it('should show an error after invalid document number', async () => {
		await wp.find('[data-testid="id-number"]').setValue('9999999M');
		await wp.find('[data-testid="id-number"]').setValue('');

		expect(
			wp
				.find('[for="m-password-recovery__id-number"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Este campo es obligatorio');
	});

	it('should show an error after invalid characters on card number', async () => {
		await wp.find('[data-testid="card-number"]').setValue('@');

		expect(
			wp
				.find('[for="m-password-recovery__card-number"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('El campo contiene caracteres no permitidos');
	});

	it('should show an error after invalid card number', async () => {
		await wp.find('[data-testid="card-number"]').setValue('1234567890123456');
		await wp.find('[data-testid="card-number"]').setValue('');

		expect(
			wp
				.find('[for="m-password-recovery__card-number"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Este campo es obligatorio');
	});

	it('should format a card number', async () => {
		await wp.find('[data-testid="card-number"]').setValue('1234 5678 9012 3456');

		expect(wp.find('[data-testid="card-number"]').element.value).toBe('1234567890123456');
	});

	it('should show an error after invalid characters on pin number', async () => {
		await wp.find('[data-testid="pin-number"]').setValue('@');

		expect(
			wp
				.find('[for="m-password-recovery__pin-number"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('El campo contiene caracteres no permitidos');
	});

	it('should show an error after invalid pin number', async () => {
		await wp.find('[data-testid="pin-number"]').setValue('1234');
		await wp.find('[data-testid="pin-number"]').setValue('');

		expect(
			wp
				.find('[for="m-password-recovery__pin-number"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Este campo es obligatorio');
	});

	it('should show an error after request a password recovery', async () => {
		const recoverPasswordAction = jest.fn().mockRejectedValue();
		store.mockModule('user', { recoverPassword: recoverPasswordAction });

		await wp.find('[data-testid="id-number"]').setValue('9999999M');
		await wp.find('[data-testid="card-number"]').setValue('1234567890123456');
		await wp.find('[data-testid="pin-number"]').setValue('1234');

		await wp.find('[data-testid="confirm"]').trigger('click');

		expect(recoverPasswordAction).toHaveBeenCalled();

		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				name: 'm-error',
			})
		);
		expect(removeSession).toHaveBeenCalled();
		expect(closeAll).toHaveBeenCalled();
	});

	it('should request a password recovery', async () => {
		await wp.find('[data-testid="id-number"]').setValue('9999999M');
		await wp.find('[data-testid="card-number"]').setValue('1234567890123456');
		await wp.find('[data-testid="pin-number"]').setValue('1234');

		await wp.find('[data-testid="confirm"]').trigger('click');

		expect(recoverPassword).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ documentId: '9999999M', pan: '1234567890123456', pin: '1234' })
		);
	});
});
