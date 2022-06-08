import { shallowMount } from '@vue/test-utils';
import component from '@views/v-ontime-welcome';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-ontime-welcome.vue', () => {
	let wp;
	let store;
	let router;

	const setWelcome = jest.fn();

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;
		store = shallowStore;
		router = localRouter;

		store.mockModule('ontime', { setWelcome });

		wp = shallowMount(component, { localVue, store, router, stubs: { CButton } });
	});

	it('has a name equal to v-ontime-welcome', () => {
		expect(wp.vm.$options.name).toBe('v-ontime-welcome');
	});

	it('should navigate to create ontime page', async () => {
		const replaceState = jest.spyOn(window.history, 'replaceState');

		await wp.find('[data-testid="create"]').trigger('click');

		expect(setWelcome).toHaveBeenCalled();
		expect(replaceState).toHaveBeenCalledWith({}, '', '/main/ontime');
		expect(router.currentRoute.name).toBe('ontime-create');
	});
});
