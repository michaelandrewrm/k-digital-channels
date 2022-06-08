import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-remember-password.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-remember-password.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		store.registerModule('app', { namespaced: true, state: { whatsapp: '+34 682 101 050' } });

		wp = shallowMount(Component, { localVue, store, stubs: { LModal, CButton } });
	});

	it('has a name equal to m-remember-password', () => {
		expect(wp.vm.$options.name).toBe('m-remember-password');
	});
});
