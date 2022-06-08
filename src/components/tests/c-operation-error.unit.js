import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-operation-error';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-operation-error.vue', () => {
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

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { contactUs: true },
			stubs: { CButton },
		});
	});

	it('has a name equal to c-operation-error', () => {
		expect(wp.vm.$options.name).toBe('c-operation-error');
	});

	it('confirm when clicking on buttons', async () => {
		expect(wp.emitted('confirm')).toBeFalsy();

		await wp.find('[data-testid="confirm"]').trigger('click');

		expect(wp.emitted('confirm')).toBeTruthy();
	});
});
