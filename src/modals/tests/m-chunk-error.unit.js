import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-chunk-error.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-chunk-error.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		wp = shallowMount(Component, { localVue, store, stubs: { LModal, CButton } });
	});

	it('has a name equal m-chunk-error', () => {
		expect(wp.vm.$options.name).toBe('m-chunk-error');
	});

	it('should reload the page', async () => {
		const { location } = window;
		delete window.location;
		window.location = { reload: jest.fn() };
		await wp.find('[data-testid="accept"]').trigger('click');
		expect(window.location.reload).toHaveBeenCalled();
		window.location = location;
	});
});
