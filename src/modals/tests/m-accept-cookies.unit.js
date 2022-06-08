import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-accept-cookies.vue';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-accept-cookies.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		store.registerModule('app', {
			namespaced: true,
			state() {
				return {
					cookiesDetail: 'abc',
				};
			},
		});

		wp = shallowMount(Component, { localVue, store, stubs: { CButton } });
	});

	it('has a name equal to m-accept-cookies', () => {
		expect(wp.vm.$options.name).toBe('m-accept-cookies');
	});

	it('should emit a close event when clicking OK', () => {
		expect(wp.emitted().close).toBeFalsy();
		wp.find('[data-testid="accept-cookies"]').trigger('click');
		expect(wp.emitted().close).toBeTruthy();
	});

	it('should emit a close event when clicking CANCEL', () => {
		expect(wp.emitted().close).toBeFalsy();
		wp.find('[data-testid="reject-cookies"]').trigger('click');
		expect(wp.emitted().close).toBeTruthy();
	});
});
