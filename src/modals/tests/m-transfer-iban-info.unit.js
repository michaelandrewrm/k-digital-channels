import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-transfer-iban-info';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-transfer-iban-info.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue, stubs: { LModal, CButton } });
	});

	it('has a name equal to m-transfer-iban-info', () => {
		expect(wp.vm.$options.name).toBe('m-transfer-iban-info');
	});

	it('should emit a close event', async () => {
		expect(wp.emitted().close).toBeFalsy();
		await wp.find('[data-testid="accept"]').trigger('click');
		expect(wp.emitted().close).toBeTruthy();
	});
});
