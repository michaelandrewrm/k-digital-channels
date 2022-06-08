import { shallowMount } from '@vue/test-utils';
import component from '@views/v-sirvase-welcome';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-sirvase-welcome.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, shallowRouter } = newInstance;
		store = shallowStore;
		router = shallowRouter;

		router.addRoute({ path: '/main/sirvase', name: 'sirvase' });
		router.addRoute({ path: '/main/sirvase-create', name: 'sirvase-create' });

		wp = shallowMount(component, { localVue, store, router, stubs: { CButton } });
	});

	it('has a name equal to v-sirvase-welcome', () => {
		expect(wp.vm.$options.name).toBe('v-sirvase-welcome');
	});

	it('should navigate to create profile page', async () => {
		const replaceState = jest.spyOn(window.history, 'replaceState');

		await wp.find('[data-testid="create"]').trigger('click');

		expect(replaceState).toHaveBeenCalledWith({}, '', '/main/sirvase');
		expect(router.currentRoute.name).toBe('sirvase-create');
	});
});
