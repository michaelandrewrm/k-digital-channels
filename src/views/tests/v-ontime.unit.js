import { shallowMount } from '@vue/test-utils';
import component from '@views/v-ontime';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-ontime.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(async () => {
		const { shallowStore, shallowRouter } = newInstance;
		store = shallowStore;
		router = shallowRouter;

		store.registerModule('ontime', {
			namespaced: true,
			state: { isWelcome: false, productsOntime: [] },
			actions: { get: jest.fn().mockResolvedValue([]) },
		});
		router.addRoute({ name: 'ontime-welcome', path: '/ontime-welcome' });
		router.addRoute({ name: 'ontime-dashboard', path: '/ontime-dashboard' });

		await router.replace('/');

		wp = shallowMount(component, { localVue, store, router });
	});

	it('has a name equal to v-ontime', () => {
		expect(wp.vm.$options.name).toBe('v-ontime');
	});

	it('should navigate to welcome ontime page', () => {
		expect(router.currentRoute.name).toBe('ontime-welcome');
	});

	it('should navigate to dashboard ontime page', async () => {
		const getAction = jest.fn().mockResolvedValue([]);
		store.unregisterModule('ontime');
		store.registerModule('ontime', {
			namespaced: true,
			state: { isWelcome: true, productsOntime: [] },
			actions: { get: getAction },
		});

		await router.replace('/');

		wp = shallowMount(component, { localVue, store, router });

		await flushPromises();

		expect(getAction).toHaveBeenCalled();
		expect(router.currentRoute.name).toBe('ontime-dashboard');
	});
});
