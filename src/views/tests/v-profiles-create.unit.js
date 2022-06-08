import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import component from '@views/v-profiles-create';
import accounts from '@tests/fixtures/products/accounts';
import categorizeProducts from '@modules/products/product-sort';
import CTextField from '@tests/stubs/c-text-field.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-profiles-create.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = [
		{
			id: 'profile-1',
			name: 'profile',
			isDefault: true,
		},
	];

	const WActions = {
		template: `
			<div>
				<button
					v-for="option in options"
					:key="option.id"
					:data-testid="option.id"
					@click="option.action()"
				>{{ option.title }}</button>
			</div>
		`,
		props: ['options'],
	};

	const fetch = jest.fn().mockResolvedValue(categorizeProducts(accounts));
	const get = jest.fn().mockResolvedValue({ profiles: fixture, defaultProfiles: null });
	const getProfile = jest.fn().mockResolvedValue(fixture[0]);
	const create = jest.fn().mockResolvedValue();
	const update = jest.fn().mockResolvedValue();
	const setLastRequestTimestamp = jest.fn().mockResolvedValue();
	const deleteCache = jest.fn().mockResolvedValue();
	const setWelcome = jest.fn();

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore, localRouter } = newInstance;
		store = shallowStore;
		router = localRouter;

		store.mockModule('session', { deleteCache });
		store.mockModule('products', { fetch });
		store.mockModule('profiles', {
			get,
			getProfile,
			create,
			update,
			setLastRequestTimestamp,
			setWelcome,
		});

		wp = shallowMount(component, { localVue, store, router });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-profiles-create', () => {
		expect(wp.vm.$options.name).toBe('v-profiles-create');
	});

	it('should show an error on invalid profile name', async () => {
		wp = shallowMount(component, {
			localVue,
			store,
			router,
			stubs: { 'c-transfer-field': CTextField },
		});

		await flushPromises();
		await wp.find('[data-testid="profile-name"]').setValue('@');

		expect(wp.find('[for="v-profiles-create__profile-name"]').text()).toBe(
			"El campo contiene caracteres no permitidos. Sólo letras, números y los caracteres / - ¿ ? : ( ) . , ' + son admitidos."
		);
	});

	it('should show required error on profile name', async () => {
		wp = shallowMount(component, {
			localVue,
			store,
			router,
			stubs: { 'c-transfer-field': CTextField },
		});

		await flushPromises();
		await wp.find('[data-testid="profile-name"]').setValue('profile');
		await wp.find('[data-testid="profile-name"]').setValue('');

		expect(wp.find('[for="v-profiles-create__profile-name"]').text()).toBe(
			'Este campo es obligatorio.'
		);
	});

	it('should return after request a profile create with error', async () => {
		wp = shallowMount(component, {
			localVue,
			store,
			router,
			stubs: { 'c-transfer-field': CTextField, WActions },
		});

		await flushPromises();
		await wp.find('[data-testid="profile-name"]').setValue('profile@');
		await wp.find('[data-testid="create-profile"]').trigger('click');

		expect(create).not.toHaveBeenCalled();
	});

	it('should request a profile create without error', async () => {
		wp = shallowMount(component, {
			localVue,
			store,
			router,
			stubs: { 'c-transfer-field': CTextField, WActions },
		});

		await flushPromises();
		await wp.find('[data-testid="profile-name"]').setValue('profile');
		await wp.find('[data-testid="create-profile"]').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		expect(deleteCache).toHaveBeenCalled();
		expect(setLastRequestTimestamp).toHaveBeenCalled();
		expect(create).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				name: 'profile',
				isDefault: false,
				productIds: [],
			})
		);

		expect(wp.findComponent({ name: 'c-operation-success' }).exists()).toBeTruthy();
		expect(wp.findComponent({ name: 'c-operation-error' }).exists()).toBeFalsy();
	});

	it('should show an error after request a profile create', async () => {
		const createAction = jest.fn().mockRejectedValue();
		store.mockModule('profiles', { create: createAction, setWelcome });

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			stubs: { 'c-transfer-field': CTextField, WActions },
		});

		await flushPromises();
		await wp.find('[data-testid="profile-name"]').setValue('profile');
		await wp.find('[data-testid="create-profile"]').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		expect(createAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				name: 'profile',
				isDefault: false,
				productIds: [],
			})
		);

		expect(wp.findComponent({ name: 'c-operation-success' }).exists()).toBeFalsy();
		expect(wp.findComponent({ name: 'c-operation-error' }).exists()).toBeTruthy();
	});

	it('should request a profile update without error', async () => {
		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { profileId: 'profile-1' },
			stubs: { 'c-transfer-field': CTextField, WActions },
		});

		await flushPromises();
		await wp.find('[data-testid="profile-name"]').setValue('new profile');
		await wp.find('[data-testid="update-profile"]').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		expect(update).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				id: 'profile-1',
				name: 'new profile',
				isDefault: true,
				productIds: [],
			})
		);
		expect(deleteCache).toHaveBeenCalled();
		expect(setLastRequestTimestamp).toHaveBeenCalled();
		expect(wp.findComponent({ name: 'c-operation-success' }).exists()).toBeTruthy();
		expect(wp.findComponent({ name: 'c-operation-error' }).exists()).toBeFalsy();
	});

	it('should show an error after request a profile update', async () => {
		const updateAction = jest.fn().mockRejectedValue();
		store.mockModule('profiles', { getProfile, update: updateAction, setWelcome });

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { profileId: 'profile-1' },
			stubs: { 'c-transfer-field': CTextField, WActions },
		});

		await flushPromises();
		await wp.find('[data-testid="profile-name"]').setValue('new profile');
		await wp.find('[data-testid="update-profile"]').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		expect(updateAction).toHaveBeenCalled();

		expect(wp.findComponent({ name: 'c-operation-success' }).exists()).toBeFalsy();
		expect(wp.findComponent({ name: 'c-operation-error' }).exists()).toBeTruthy();
	});

	it('should request a profile delete without error', async () => {
		const openAction = jest.fn().mockResolvedValue(true);
		const deleteAction = jest.fn().mockResolvedValue();
		store.mockModule('modal', { open: openAction });
		store.mockModule('profiles', {
			getProfile,
			delete: deleteAction,
			setLastRequestTimestamp,
			setWelcome,
		});

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { profileId: 'profile-1' },
			stubs: { 'c-transfer-field': CTextField, WActions },
		});

		await flushPromises();
		await wp.find('[data-testid="delete-profile"]').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		expect(deleteAction).toHaveBeenCalledWith(expect.any(Object), 'profile-1');
		expect(deleteCache).toHaveBeenCalled();
		expect(setLastRequestTimestamp).toHaveBeenCalled();
		expect(wp.findComponent({ name: 'c-operation-success' }).exists()).toBeTruthy();
		expect(wp.findComponent({ name: 'c-operation-error' }).exists()).toBeFalsy();
	});

	it('should show an error after request a profile delete', async () => {
		const openAction = jest.fn().mockResolvedValue(true);
		const deleteAction = jest.fn().mockRejectedValue();
		store.mockModule('modal', { open: openAction });
		store.mockModule('profiles', { getProfile, delete: deleteAction, setWelcome });

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { profileId: 'profile-1' },
			stubs: { 'c-transfer-field': CTextField, WActions },
		});

		await flushPromises();
		await wp.find('[data-testid="delete-profile"]').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		expect(deleteAction).toHaveBeenCalled();

		expect(wp.findComponent({ name: 'c-operation-success' }).exists()).toBeFalsy();
		expect(wp.findComponent({ name: 'c-operation-error' }).exists()).toBeTruthy();
	});

	it('should return after setting a profile as default with error', async () => {
		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { profileId: 'profile-1' },
			stubs: { 'c-transfer-field': CTextField, WActions },
		});

		await flushPromises();
		await wp.find('[data-testid="profile-name"]').setValue('profile@');
		await wp.find('[data-testid="set-profile"]').trigger('click');

		expect(update).not.toHaveBeenCalled();
	});

	it('should set a profile as default', async () => {
		const openAction = jest.fn().mockResolvedValue();
		const modifyAction = jest.fn().mockResolvedValue();
		store.mockModule('profiles', {
			getProfile,
			modify: modifyAction,
			setLastRequestTimestamp,
			setWelcome,
		});
		store.mockModule('notification', { open: openAction });

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { profileId: 'profile-1' },
			stubs: { 'c-transfer-field': CTextField, WActions },
		});

		await flushPromises();
		await wp.find('[data-testid="set-profile"]').trigger('click');
		await flushPromises();

		expect(modifyAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ id: 'profile-1', isDefault: true })
		);
		expect(deleteCache).toHaveBeenCalled();
		expect(setLastRequestTimestamp).toHaveBeenCalled();
		expect(openAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'profile se ha seleccionado como perfil por defecto.',
			})
		);
	});

	it('should show an error after setting a profile as default', async () => {
		const openAction = jest.fn().mockResolvedValue();
		const modifyAction = jest.fn().mockRejectedValue();
		store.mockModule('profiles', { getProfile, modify: modifyAction, setWelcome });
		store.mockModule('notification', { open: openAction });

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { profileId: 'profile-1' },
			stubs: { 'c-transfer-field': CTextField, WActions },
		});

		await flushPromises();
		await wp.find('[data-testid="set-profile"]').trigger('click');
		await flushPromises();

		expect(modifyAction).toHaveBeenCalled();
		expect(openAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'Algo no ha ido bien, por favor, inténtalo de nuevo mas tarde.',
			})
		);
	});
});
