import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-transfers.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-transfers.vue', () => {
	let wp;
	let store;
	let router;

	const isEnabled = jest.fn().mockResolvedValue(true);

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.registerModule('app', { namespaced: true, state: { companyId: 'BC' } });
		store.mockModule('bizum', { isEnabled });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			computed: { isDesktop: () => true },
		});
	});

	it('has a name equal to v-transfers', () => {
		expect(wp.vm.$options.name).toBe('v-transfers');
	});

	it('should navigate to new transfer as default', async () => {
		await router.push({ name: 'global' });
		const from = router.currentRoute;

		await router.push({ name: 'transfers' });
		const next = jest.fn((cb) => cb(wp.vm));
		Component.beforeRouteEnter.call(wp.vm, router.currentRoute, from, next);

		await flushPromises();

		expect(router.currentRoute.name).toBe('transfer');
		expect(router.currentRoute.params.action).toBe('new');
	});

	it('should navigate to my transfers', async () => {
		await router.push({ name: 'transfers' });

		expect(wp.vm.$route.name).toBe('transfers');

		await wp.find('[data-testid="my-transfers"]').trigger('click');

		expect(wp.vm.$route).toMatchObject(
			expect.any(Object),
			expect.objectContaining({
				name: 'my-transfers',
				params: { productId: 'first' },
			})
		);
	});

	it('should not navigate to new transfer as default on no desktop', async () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			computed: { isDesktop: () => false },
		});

		await router.push({ name: 'global' });
		const from = router.currentRoute;

		await router.push({ name: 'transfers' });
		const next = jest.fn((cb) => cb(wp.vm));
		Component.beforeRouteEnter.call(wp.vm, router.currentRoute, from, next);

		await flushPromises();

		expect(router.currentRoute.name).toBe('transfers');
		expect(router.currentRoute.name).not.toBe('transfer');
		expect(router.currentRoute.params.action).not.toBe('new');
	});

	it('should not navigate to the current route', async () => {
		await router.push({ name: 'transfers' });
		const newTransferButton = wp.find('[data-testid="new-transfer"]');

		await newTransferButton.trigger('click');

		expect(router.currentRoute.name).toBe('transfer');

		await newTransferButton.trigger('click');

		expect(router.currentRoute.name).toBe('transfer');
	});

	it('should route back after error on navigate', async () => {
		await router.push({ name: 'transfers' });
		const push = jest.spyOn(router, 'push').mockRejectedValue();
		const historyBack = jest.spyOn(window.history, 'back');

		await wp.find('[data-testid="new-transfer"]').trigger('click');

		expect(push).toHaveBeenCalled();
		expect(historyBack).toHaveBeenCalled();

		expect(router.currentRoute.name).toBe('transfers');
	});
});
