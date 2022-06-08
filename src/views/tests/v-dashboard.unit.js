import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-dashboard';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-dashboard.vue', () => {
	let wp;
	let store;
	const activeLogout = jest.fn().mockResolvedValue(true);
	const setCompany = jest.fn().mockResolvedValue();
	const open = jest.fn().mockResolvedValue();
	const start = jest.fn();
	const end = jest.fn();
	const request = jest.fn().mockResolvedValue();
	const fixture = { id: 'user-1', name: 'name-1', companyId: 'BC', isLoading: false };
	const secureSession = { uuid: 'uuid-1' };

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('agent', {
			namespaced: true,
			state: { currentCompany: 'BC' },
			actions: { activeLogout, setCompany },
		});
		store.registerModule('secure', { namespaced: true, state: { secureSession } });
		store.mockModule('modal', { open });
		store.mockModule('notification', { open });
		store.mockModule('loading', { start, end });
		store.mockModule('service', { request });

		wp = shallowMount(Component, { localVue, store });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-dashboard', () => {
		expect(wp.vm.$options.name).toBe('v-dashboard');
	});

	it('should open a search bar', async () => {
		await wp.find('[data-testid="search-bar"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-search' }),
				props: { currentCompany: 'BC' },
			})
		);
	});

	it('should open the session options', async () => {
		const openAction = jest.fn().mockResolvedValue(fixture);
		store.mockModule('modal', { open: openAction });
		wp = shallowMount(Component, { localVue, store });

		await wp.find('[data-testid="search-bar"]').trigger('click');
		await flushPromises();

		await wp.find('[data-testid="more-btn"]').trigger('click');
		expect(wp.find('[data-testid="user-options"]').exists()).toBeTruthy();

		await wp.find('[data-testid="more-btn"]').trigger('click');
		expect(wp.find('[data-testid="user-options"]').exists()).toBeFalsy();
	});

	it('should logout', async () => {
		await wp.find('[data-testid="logout-button"]').trigger('click');
		expect(activeLogout).toHaveBeenCalled();
	});

	it('should change the company', async () => {
		const openAction = jest.fn().mockResolvedValue('BF');
		store.mockModule('modal', { open: openAction });
		wp = shallowMount(Component, { localVue, store });

		expect(wp.find('[data-testid="company-button"]').text()).toBe('Caminos');
		await wp.find('[data-testid="company-button"]').trigger('click');
		await flushPromises();

		expect(openAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-select-company' })
		);

		expect(setCompany).toHaveBeenCalledWith(expect.any(Object), 'BF');
	});

	it('should not open a search bar during session loading', async () => {
		const openAction = jest.fn().mockResolvedValue({ ...fixture, isLoading: true });
		store.mockModule('modal', { open: openAction });
		wp = shallowMount(Component, { localVue, store });

		await wp.find('[data-testid="search-bar"]').trigger('click');
		await flushPromises();

		await wp.find('[data-testid="search-bar"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'No se ha podido realizar la acción, una sesión se está cargando.',
			})
		);
	});

	it('should not open a change company modal during session loading', async () => {
		const openAction = jest.fn().mockResolvedValue({ ...fixture, isLoading: true });
		store.mockModule('modal', { open: openAction });
		wp = shallowMount(Component, { localVue, store });

		await wp.find('[data-testid="search-bar"]').trigger('click');
		await flushPromises();

		await wp.find('[data-testid="company-button"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'No se ha podido realizar la acción, una sesión se está cargando.',
			})
		);
	});

	it('should close a session', async () => {
		const openAction = jest.fn().mockResolvedValue(fixture);
		store.mockModule('modal', { open: openAction });
		wp = shallowMount(Component, { localVue, store });

		await wp.find('[data-testid="search-bar"]').trigger('click');
		await flushPromises();

		await wp.find('[data-testid="more-btn"]').trigger('click');
		await wp.find('[data-testid="close-session"]').trigger('click');
		await wp.vm.$nextTick();

		expect(wp.find('[data-testid="tab-session"]').exists()).toBeFalsy();
	});
});
