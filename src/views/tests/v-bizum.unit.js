import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bizum.vue';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-bizum.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(async () => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;
	});

	it("has a name equal 'v-bizum'", () => {
		const requestActive = jest.fn().mockResolvedValue();
		const getProduct = jest.fn().mockResolvedValue();

		store.mockModule('bizum', { requestActive, getProduct });

		wp = shallowMount(Component, { localVue, store, router });

		expect(wp.vm.$options.name).toBe('v-bizum');
	});

	it('go to dashboard', async () => {
		const requestActive = jest.fn().mockResolvedValue();
		const getProduct = jest.fn().mockResolvedValue();

		store.mockModule('bizum', { requestActive, getProduct });

		wp = shallowMount(Component, { localVue, store, router });

		await flushPromises();
		expect(router.currentRoute.name).toBe('bizum-dashboard');
	});

	it('go to register on bizum', async () => {
		const requestActive = jest.fn().mockRejectedValue();
		const getProduct = jest.fn().mockRejectedValue();

		store.mockModule('bizum', { requestActive, getProduct });

		wp = shallowMount(Component, { localVue, store, router });

		await flushPromises();
		expect(router.currentRoute.name).toBe('bizum-welcome');
	});
});
