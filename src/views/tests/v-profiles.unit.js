import { shallowMount } from '@vue/test-utils';
import component from '@views/v-profiles';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-profiles.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(async () => {
		const { shallowStore, localRouter } = newInstance;
		store = shallowStore;
		router = localRouter;

		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfiles: null, profiles: [], isWelcome: false },
		});

		await router.replace('/');

		wp = shallowMount(component, { localVue, store, router });
	});

	it('has a name equal to v-profiles', () => {
		expect(wp.vm.$options.name).toBe('v-profiles');
	});

	it('should navigate to welcome profile page', () => {
		expect(router.currentRoute.name).toBe('profiles-welcome');
	});

	it('should navigate to dashboard profile page', async () => {
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfiles: null, profiles: [], isWelcome: true },
		});

		await router.replace('/');

		wp = shallowMount(component, { localVue, store, router });

		await flushPromises();

		expect(router.currentRoute.name).toBe('profiles-dashboard');
	});
});
