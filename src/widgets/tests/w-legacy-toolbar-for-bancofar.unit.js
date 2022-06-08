import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-legacy-toolbar-for-bancofar.vue';
import CToggle from '@tests/stubs/generic-checkbox.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-legacy-toolbar-for-bancofar.vue', () => {
	let wp;
	let router;
	let store;

	beforeEach(() => {
		const { shallowRouter, shallowStore } = newInstance;

		router = shallowRouter;
		store = shallowStore;

		store.mockModule('app', {});

		router.addRoute({ name: 'global', path: '/global' });
		router.addRoute({ name: 'sso-rsi', path: '/sso-rsi' });

		router.push({ name: 'global' });

		wp = shallowMount(Component, { localVue, router, store, stubs: { CToggle } });
	});

	it("has a name equal 'w-legacy-toolbar-for-bancofar'", () => {
		expect(wp.vm.$options.name).toBe('w-legacy-toolbar-for-bancofar');
	});

	it('navigate to skyline or rsi if button clicked', async () => {
		expect(router.currentRoute.name).toBe('global');
		await wp.find('[data-test-id="toggle-skyline"]').trigger('click');
		expect(router.currentRoute.name).toBe('sso-rsi');
		await wp.find('[data-test-id="toggle-skyline"]').trigger('click');
		expect(router.currentRoute.name).toBe('global');
	});
});
