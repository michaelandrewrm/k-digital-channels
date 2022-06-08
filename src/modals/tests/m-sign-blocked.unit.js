import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-sign-blocked.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-sign-blocked.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		const replace = jest.fn().mockResolvedValue();

		store.mockModule('modal', { replace });

		wp = shallowMount(Component, { localVue, store, stubs: { LModal, CButton } });
	});

	it('has a name equal to m-sign-blocked', () => {
		expect(wp.vm.$options.name).toBe('m-sign-blocked');
	});

	it('should open a modal on clicking unlock user', async () => {
		expect(store.mockedActions['modal/replace']).not.toHaveBeenCalled();

		await wp.find('[data-testid="unlock-user"]').trigger('click');

		expect(store.mockedActions['modal/replace']).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-unlock-user' })
		);
	});

	it('should emit a close event', async () => {
		expect(wp.vm.value).toBeNull();
		expect(wp.emitted().close).toBeFalsy();

		await wp.find('[data-testid="change-user"]').trigger('click');

		expect(wp.emitted().close).toBeTruthy();
		expect(wp.vm.value).toBe('CHANGE_USER');
	});
});
