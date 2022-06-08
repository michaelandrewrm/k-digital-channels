import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-confirm-image-deletion.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-confirm-image-deletion.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue, stubs: { LModal, CButton } });
	});

	it('has a name equal to m-confirm-image-deletion', () => {
		expect(wp.vm.$options.name).toBe('m-confirm-image-deletion');
	});

	it('should emit a close event', async () => {
		expect(wp.vm.value).toBeNull();
		expect(wp.emitted().close).toBeFalsy();
		await wp.find('[data-testid="cancel"]').trigger('click');
		expect(wp.emitted('close').length).toBe(1);

		await wp.find('[data-testid="accept"]').trigger('click');
		expect(wp.emitted('close').length).toBe(2);
		expect(wp.vm.value).toBeTruthy();
	});
});
