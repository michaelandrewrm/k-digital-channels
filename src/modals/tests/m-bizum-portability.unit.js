import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-bizum-portability';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-bizum-portability.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		wp = shallowMount(Component, { localVue, store, stubs: { LModal, CButton } });
	});

	it('has a name equal to m-bizum-portability', () => {
		expect(wp.vm.$options.name).toBe('m-bizum-portability');
	});

	it('should emit a close event', async () => {
		expect(wp.emitted().close).toBeFalsy();
		await wp.find('[data-testid="accept"]').trigger('click');
		expect(wp.emitted().close).toBeTruthy();
	});
});
