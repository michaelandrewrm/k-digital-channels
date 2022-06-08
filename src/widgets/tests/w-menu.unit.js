import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@widgets/w-menu';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-menu.vue', () => {
	let wp;
	let store;
	let router;

	const connectedContract = {
		id: 'owner-1',
		description: 'owner-desc-1',
		type: 'owner',
	};

	const items = [
		{
			id: 'item-1',
			icon: {},
			iconActive: {},
			title: 'item 1',
		},
		{
			id: 'item-2',
			icon: {},
			title: 'item 2',
		},
		{
			id: 'item-3',
			icon: {},
			title: 'item 3',
		},
		{
			id: 'item-4',
			icon: {},
			iconActive: {},
			title: 'item 4',
		},
	];

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { title: 'Username', connectedContract, items },
		});
	});

	it('has name equal to w-menu', () => {
		expect(wp.vm.$options.name).toBe('w-menu');
	});

	it('should close the menu', () => {
		wp.find('[data-testid="close-button"]').trigger('click');
		expect(wp.emitted('close-menu')).toBeTruthy();
	});

	it('should select an item and close the menu', async () => {
		await wp
			.findAll('[data-testid="menu-item"]')
			.at(0)
			.trigger('click');

		expect(wp.emitted('item-selected')[0][0]).toBe('item-1');
		expect(wp.emitted('close-menu')).toBeTruthy();
	});

	it('should logout', async () => {
		const activeLogout = jest.fn().mockResolvedValue();
		store.mockModule('authn', { activeLogout });

		await wp.find('[data-testid="logout-button"]').trigger('click');

		expect(activeLogout).toHaveBeenCalled();
	});

	it('should show a contract', () => {
		expect(wp.find('[data-testid="contract-button"]').exists()).toBeTruthy();
	});

	it('should open a modal and select a contract', async () => {
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
		const getAction = jest.fn().mockResolvedValue({ data: fixture });
		const setAction = jest.fn();
		const openAction = jest.fn().mockResolvedValue(fixture.contracts[1]);

		store.mockModule('loading', { start: jest.fn(), end: jest.fn() });
		store.mockModule('modal', { open: openAction });
		store.registerModule('contracts', {
			namespaced: true,
			state: { connectedContract },
			actions: { get: getAction, set: setAction },
		});

		wp.find('[data-testid="contract-button"] button').trigger('click');

		expect(getAction).toHaveBeenCalled();

		await flushPromises();

		expect(openAction).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				component: { default: expect.objectContaining({ name: 'm-contracts' }) },
			})
		);

		await flushPromises();

		expect(setAction).toHaveBeenCalled();
	});

	it('should not show the exit button on desktop', () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { title: 'Username', connectedContract, items },
			computed: { isDesktop: () => true },
		});

		expect(wp.find('[data-testid="logout-button"]').exists()).toBeFalsy();
	});
});
