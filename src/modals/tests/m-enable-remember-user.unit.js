import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-enable-remember-user';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-enable-remember-user.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		wp = shallowMount(Component, { localVue, store, stubs: { LModal, CButton } });
	});

	it('has a name equal to m-enable-remember-user', () => {
		expect(wp.vm.$options.name).toBe('m-enable-remember-user');
	});

	it('should emit a close event', async () => {
		expect(wp.vm.value).toBeFalsy();
		expect(wp.emitted().close).toBeFalsy();

		await wp.find('[data-testid="cancel"]').trigger('click');
		expect(wp.emitted().close).toBeTruthy();

		await wp.find('[data-testid="confirm"]').trigger('click');
		expect(wp.emitted().close).toBeTruthy();
		expect(wp.vm.value).toBeTruthy();
	});
});
