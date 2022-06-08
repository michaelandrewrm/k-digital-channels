import { shallowMount } from '@vue/test-utils';
import component from '@views/v-profiles-welcome';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-profiles-welcome.vue', () => {
	let wp;
	let store;
	let router;

	const setWelcome = jest.fn();

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;
		store = shallowStore;
		router = localRouter;

		store.mockModule('profiles', { setWelcome });

		wp = shallowMount(component, { localVue, store, router, stubs: { CButton } });
	});

	it('has a name equal to v-profiles-welcome', () => {
		expect(wp.vm.$options.name).toBe('v-profiles-welcome');
	});

	it('should navigate to create profile page', async () => {
		const replaceState = jest.spyOn(window.history, 'replaceState');

		await wp.find('[data-testid="create"]').trigger('click');

		expect(setWelcome).toHaveBeenCalled();
		expect(replaceState).toHaveBeenCalledWith({}, '', '/main/profiles');
		expect(router.currentRoute.name).toBe('profiles-create');
	});
});
