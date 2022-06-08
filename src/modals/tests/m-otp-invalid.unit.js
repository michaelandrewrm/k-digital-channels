import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-otp-invalid.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-otp-invalid.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		store.registerModule('app', {
			namespaced: true,
			state() {
				return { telephone: '786 523 102' };
			},
		});

		wp = shallowMount(Component, { localVue, store, stubs: { LModal, CButton } });
	});

	it('has a name equal m-otp-invalid', () => {
		expect(wp.vm.$options.name).toBe('m-otp-invalid');
	});

	it('should emit a close event', async () => {
		expect(wp.emitted().close).toBeFalsy();
		await wp.find('[data-testid="accept"]').trigger('click');
		expect(wp.emitted().close).toBeTruthy();
	});
});
