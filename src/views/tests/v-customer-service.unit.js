import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-customer-service';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-customer-service.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;
		store = shallowStore;
		router = localRouter;

		store.registerModule('app', { namespaced: true, state: { companyId: 'BC' } });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			computed: { isDesktop: () => true, isBancofar: () => false },
		});
	});

	it('has a name equal to v-customer-service', () => {
		expect(wp.vm.$options.name).toBe('v-customer-service');
	});

	it('should navigate to sirvase page', async () => {
		await wp.find('[data-testid="sirvase"]').trigger('click');

		expect(router.currentRoute.name).toBe('sirvase');
	});

	it('should navigate to chat page', async () => {
		await wp.find('[data-testid="chat"]').trigger('click');

		expect(router.currentRoute.name).toBe('customer-chat');
	});

	it('should navigate to online page', async () => {
		await wp.find('[data-testid="online"]').trigger('click');

		expect(router.currentRoute.name).toBe('customer-online');
	});

	it('should navigate to offices page', async () => {
		await wp.find('[data-testid="offices"]').trigger('click');

		expect(router.currentRoute.name).toBe('customer-offices');
	});

	it('should navigate to chat as default on Bancofar', async () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			computed: { isDesktop: () => true, isBancofar: () => true },
		});

		await router.push({ name: 'global' });
		const from = router.currentRoute;

		await router.push({ name: 'customer-service' });
		const next = jest.fn((cb) => cb(wp.vm));
		Component.beforeRouteEnter.call(wp.vm, router.currentRoute, from, next);

		await flushPromises();

		expect(router.currentRoute.name).toBe('customer-chat');
	});

	it('should navigate to sirvase as default on Caminos', async () => {
		await router.push({ name: 'global' });
		const from = router.currentRoute;

		await router.push({ name: 'customer-service' });
		const next = jest.fn((cb) => cb(wp.vm));
		Component.beforeRouteEnter.call(wp.vm, router.currentRoute, from, next);

		await flushPromises();

		expect(router.currentRoute.name).toBe('sirvase-dashboard');
	});

	it('should route back after error on navigation', async () => {
		await router.push({ name: 'customer-service' });
		const push = jest.spyOn(router, 'push').mockRejectedValue();
		const historyBack = jest.spyOn(window.history, 'back');

		await wp.find('[data-testid="online"]').trigger('click');

		expect(push).toHaveBeenCalled();
		expect(historyBack).toHaveBeenCalled();

		expect(router.currentRoute.name).toBe('customer-service');
	});
});
