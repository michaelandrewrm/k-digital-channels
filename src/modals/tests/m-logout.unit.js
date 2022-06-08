import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-logout.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-logout.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue, stubs: { LModal, CButton } });
	});

	it('has a name equal to m-logout', () => {
		expect(wp.vm.$options.name).toBe('m-logout');
	});

	it('should emit a close event', async () => {
		expect(wp.vm.value).toBeNull();
		expect(wp.emitted().close).toBeFalsy();
		await wp.find('[data-testid="cancel"]').trigger('click');
		expect(wp.emitted().close).toBeTruthy();

		await wp.find('[data-testid="logout"]').trigger('click');
		expect(wp.emitted().close).toBeTruthy();
		expect(wp.vm.value).toBeTruthy();
	});
});
