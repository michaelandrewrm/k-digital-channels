import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-main.vue';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-main.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { localRouter, shallowStore } = newInstance;
		store = shallowStore;
		router = localRouter;

		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: null, lastRequestTimestamp: null },
		});
		store.registerModule('contracts', { namespaced: true, state: { connectedContract: null } });
		store.registerModule('session', { namespaced: true, state: { userName: 'username' } });
		store.registerModule('authn', { namespaced: true, state: { isEmbedded: false } });
		store.registerModule('user', { namespaced: true, state: { connectedContract: null } });
		store.registerModule('app', { namespaced: true, state: { companyId: 'BC' } });
		store.mockModule('liveagent', { install: jest.fn().mockResolvedValue() });
		store.mockModule('loading', {
			start: jest.fn().mockResolvedValue(),
			end: jest.fn().mockResolvedValue(),
		});

		router.push({ name: 'global' });

		wp = shallowMount(Component, { localVue, store, router });
	});

	it('has a name equal to v-main', () => {
		expect(wp.vm.$options.name).toBe('v-main');
	});

	it('should navigate to personal area if personal area item of toolbar is clicked', async () => {
		const toolbar = wp.find('[data-testid="toolbar"]');

		expect(router.currentRoute.name).toBe('global');

		await toolbar.vm.$emit('item-selected', 'personal-area');
		await flushPromises();

		expect(router.currentRoute.name).toBe('personal-area');
	});

	it('should open the menu', async () => {
		expect(wp.find('[data-testid="menu"]').exists()).toBeFalsy();

		const toolbar = wp.find('[data-testid="toolbar"]');
		await toolbar.vm.$emit('toggle-menu');
		expect(wp.find('[data-testid="menu"]').exists()).toBeTruthy();
	});
});
