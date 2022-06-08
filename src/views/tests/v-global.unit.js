import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-global.vue';
import CButtonStub from '@tests/stubs/c-button.stub';
import flushPromises from 'flush-promises';
import accounts from '@tests/fixtures/products/accounts';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-global.vue', () => {
	let wp;
	let store;
	let router;

	const CCurrencyLabel = {
		template: '<div>{{ $nc(balance) }}</div>',
		props: ['balance'],
	};

	const stubs = {
		CNotificationBell: CButtonStub,
		CIconButton: CButtonStub,
		CCurrencyLabel,
	};

	const fetchSignatures = jest.fn().mockResolvedValue();
	const getUnreadMessages = jest.fn();
	const getAnnouncements = jest.fn().mockResolvedValue([{ a: 1 }]);
	const start = jest.fn();
	const end = jest.fn();
	const open = jest.fn();
	const getContracts = jest.fn();
	const setContract = jest.fn();
	const requestActive = jest.fn().mockRejectedValue();
	const getMovements = jest.fn().mockResolvedValue([1, 2, 3]);
	const markUserGreeted = jest.fn();

	beforeEach(async () => {
		jest.useFakeTimers();
		localStorage.setItem('userSession', JSON.stringify({ userName: 'user1' }));

		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('loading', { start, end });
		store.mockModule('modal', { open });
		store.mockModule('signatures', { fetch: fetchSignatures });
		store.mockModule('contracts', { get: getContracts, set: setContract });
		store.mockModule('bizum', { requestActive, getMovements });
		store.registerModule('app', { namespaced: true, state: { companyId: 'BC' } });
		store.registerModule('authn', { namespaced: true, state: { isMultiple: false } });
		store.registerModule('session', {
			namespaced: true,
			state: { userName: 'user1', userGreeted: false },
			actions: { markUserGreeted },
		});
		store.registerModule('communications', {
			namespaced: true,
			state: { unreadMessages: 0 },
			actions: { getUnreadMessages, getAnnouncements },
		});
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: null, profiles: [] },
		});

		wp = shallowMount(Component, { localVue, store, router, stubs });

		/**
		 * We emit 'products' from w-product-list
		 * to simulate products fetch
		 */

		await wp.findComponent({ name: 'w-product-list' }).vm.$emit('products', accounts);
		await flushPromises();
	});

	afterEach(() => {
		localStorage.clear();
		jest.clearAllMocks();
	});

	it('has a name equal to v-global', () => {
		expect(wp.vm.$options.name).toBe('v-global');
	});

	it('should show the global balance', async () => {
		expect(
			wp
				.findComponent({ name: 'c-currency-label' })
				.text()
				.replace(/\s/g, ' ')
		).toBe('617,25 €');
	});

	it('should navigate to communications after click on notification bell', async () => {
		await wp.find('[data-testid="notification-bell"]').trigger('click');

		expect(router.currentRoute.name).toBe('communications');
		expect(router.currentRoute.params.type).toBe('alerts');
	});

	it('should show the greeting message', async () => {
		expect(wp.vm.userGreeted).toBeFalsy();

		await flushPromises();
		jest.runTimersToTime(500);
		await wp.vm.$nextTick();

		expect(
			wp
				.find('[data-testid="greeting-message"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Hola user1');

		jest.runOnlyPendingTimers();
		await wp.vm.$nextTick();
		expect(wp.find('[data-testid="greeting-message"]').exists()).toBeFalsy();
	});

	it('should toggle chart button when sheet is not lifted', async () => {
		expect(wp.vm.chartType).toBeFalsy();
		expect(wp.find('[data-testid="chart-button"]').attributes('icon')).toBe('@icons/graphBar');

		await wp.find('[data-testid="chart-button"]').trigger('click');

		expect(wp.vm.chartType).toBeTruthy();
		expect(wp.find('[data-testid="chart-button"]').attributes('icon')).toBe('@icons/graphLine');
	});

	it('should reset sheet after click on chart button', async () => {
		expect(wp.vm.resetSheet).toBeFalsy();
		await wp.find('l-global-stub').vm.$emit('sheet-lifted', true);

		await wp.find('[data-testid="chart-button"]').trigger('click');
		expect(wp.vm.resetSheet).toBeTruthy();
	});

	it('should stop the greeting if the view destroy before the greeting', async () => {
		const showUserGreeting = jest.spyOn(wp.vm, 'showUserGreeting');
		const hideUserGreeting = jest.spyOn(wp.vm, 'hideUserGreeting');

		expect(wp.vm.userGreeted).toBeFalsy();
		expect(showUserGreeting).not.toHaveBeenCalled();
		expect(hideUserGreeting).not.toHaveBeenCalled();

		await wp.destroy();

		jest.runAllTimers();

		expect(showUserGreeting).not.toHaveBeenCalled();
		expect(hideUserGreeting).not.toHaveBeenCalled();
	});

	it('should show a modal with announcements', async () => {
		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				props: { slides: [{ a: 1 }] },
			})
		);
	});

	it('should open balance info modal', async () => {
		await wp.find('[data-testid="balance-modal"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-balance' })
		);
	});

	it('should open a modal and select a contract', async () => {
		const connectedContract = { id: 'owner-1', description: 'owner-desc-1', type: 'owner' };
		const fixture = {
			connectedContract,
			contracts: [
				{
					id: 'owner-1',
					description: 'owner-desc-1',
					type: 'owner',
				},
				{
					id: 'user-1',
					description: 'user-desc-1',
					type: 'user',
				},
			],
		};
		const openAction = jest.fn().mockResolvedValue(fixture.contracts[1]);
		const getAction = jest.fn().mockResolvedValue({ data: fixture });

		store.mockModule('modal', { open: openAction });
		store.unregisterModule('authn');
		store.unregisterModule('contracts');
		store.registerModule('authn', { namespaced: true, state: { isMultiple: true } });
		store.registerModule('contracts', {
			namespaced: true,
			state: { connectedContract },
			actions: { get: getAction, set: setContract },
		});

		wp = shallowMount(Component, { localVue, store, router });
		await flushPromises();

		await wp.find('[data-testid="contract-button"]').trigger('click');

		expect(getAction).toHaveBeenCalled();

		await flushPromises();

		expect(openAction).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				component: { default: expect.objectContaining({ name: 'm-contracts' }) },
			})
		);

		await flushPromises();

		expect(setContract).toHaveBeenCalled();
	});
});
