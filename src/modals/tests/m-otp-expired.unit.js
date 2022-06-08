import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-otp-expired.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-otp-expired.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue, stubs: { LModal, CButton } });
	});

	it('has a name equal to m-otp-expired', () => {
		expect(wp.vm.$options.name).toBe('m-otp-expired');
	});

	it('should emit a close event', async () => {
		expect(wp.vm.value).toBe('');
		expect(wp.emitted().close).toBeFalsy();

		await wp.find('[data-testid="resend"]').trigger('click');

		expect(wp.emitted().close).toBeTruthy();
		expect(wp.vm.value).toBe('resend');
	});
});
