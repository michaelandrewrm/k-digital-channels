import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-pension-plan-operative';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-pension-plan-operative', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.registerModule('app', {
			namespaced: true,
			state() {
				return { telephone: '786 523 102' };
			},
		});

		wp = shallowMount(Component, { localVue, store, router, stubs: { LModal, CButton } });
	});

	it('has a name equal m-pension-plan-operative', () => {
		expect(wp.vm.$options.name).toBe('m-pension-plan-operative');
	});

	it('should emit a close event', async () => {
		expect(wp.emitted().close).toBeFalsy();
		await wp.find('[data-testid="confirm-button"]').trigger('click');
		expect(wp.emitted().close).toBeTruthy();
	});
});
