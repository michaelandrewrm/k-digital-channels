import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@modals/m-password-reset.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';
import CTextField from '@tests/stubs/c-text-field.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-password-reset.vue', () => {
	let wp;
	let store;

	const resetPassword = jest.fn().mockResolvedValue();
	const open = jest.fn().mockResolvedValue();
	const closeAll = jest.fn();

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('user', { resetPassword });
		store.mockModule('modal', { open, closeAll });

		wp = shallowMount(Component, { localVue, store, stubs: { LModal, CButton, CTextField } });
	});

	it('has a name equal to m-password-reset', () => {
		expect(wp.vm.$options.name).toBe('m-password-reset');
	});

	it('should emit a close event on cancel button', async () => {
		await wp.find('[data-testid="cancel"]').trigger('click');
		expect(wp.emitted('close')).toBeTruthy();
	});

	it('should show an error after invalid password', async () => {
		await wp.find('[data-testid="prevPassword"]').setValue('123abc');
		await wp.find('[data-testid="prevPassword"]').setValue('');

		expect(
			wp
				.find('[for="m-password-reset__password"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Este campo es obligatorio');
	});

	it('should show an error after request a password reset', async () => {
		const resetPasswordAction = jest
			.fn()
			.mockRejectedValue({ response: { data: { errorCode: 'C401000201' } } });
		store.mockModule('user', { resetPassword: resetPasswordAction });

		await wp.find('[data-testid="prevPassword"]').setValue('123abc');
		await wp.setData({ isValidNextPassword: true, nextPassword: '456def' });
		await wp.find('[data-testid="confirm"]').trigger('click');

		expect(resetPasswordAction).toHaveBeenCalled();

		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				name: 'm-error',
			})
		);

		expect(
			wp
				.find('[for="m-password-reset__password"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('La contraseña introducida no es correcta');
	});

	it('should request a password reset', async () => {
		await wp.find('[data-testid="prevPassword"]').setValue('123abc');
		await wp.setData({ isValidNextPassword: true, nextPassword: '456def' });
		await wp.find('[data-testid="confirm"]').trigger('click');

		await flushPromises();

		expect(resetPassword).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ oldPassword: '123abc', password: '456def' })
		);
	});
});
