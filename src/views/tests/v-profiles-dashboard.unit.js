import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import component from '@views/v-profiles-dashboard';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-profiles-dashboard.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = [
		{
			id: 'profile-1',
			name: 'profile-a',
			isDefault: true,
		},
		{
			id: 'profile-2',
			name: 'profile-b',
			isDefault: false,
		},
	];

	const CProfileItem = {
		template: `
			<div :data-testid="profile.id" v-bind="$attrs">
				<button data-testid="icon" @click="$emit('select-item')"></button>
				<button data-testid="set" @click="$emit('set-item')"></button>
				<button data-testid="delete" @click="$emit('delete-item')"></button>
				<button data-testid="edit" @click="$emit('edit-item')"></button>
			</div>
		`,
		props: ['profile'],
	};

	const setLastRequestTimestamp = jest.fn().mockResolvedValue();
	const deleteCache = jest.fn().mockResolvedValue();

	beforeEach(async () => {
		const { shallowStore, localRouter } = newInstance;
		store = shallowStore;
		router = localRouter;

		store.mockModule('session', { deleteCache });
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: null, profiles: [], isWelcome: false },
			actions: { setLastRequestTimestamp },
		});

		await router.replace('/');

		wp = shallowMount(component, { localVue, store, router, stubs: { CButton } });
	});

	it('has a name equal to v-profiles-dashboard', () => {
		expect(wp.vm.$options.name).toBe('v-profiles-dashboard');
	});

	it('should show an error when no profiles', () => {
		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
	});

	it('should navigate to create profile page', async () => {
		await wp.find('[data-testid="submit"]').trigger('click');
		expect(router.currentRoute.name).toBe('profiles-create');
	});

	it('should request a profile select', async () => {
		const modify = jest.fn().mockResolvedValue();
		const open = jest.fn().mockResolvedValue();

		store.mockModule('notification', { open });
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: null, profiles: fixture, isWelcome: false },
			actions: { modify, setLastRequestTimestamp },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { CButton, CProfileItem } });

		await wp.find('[data-testid="profile-1"] [data-testid="icon"]').trigger('click');
		expect(modify).not.toHaveBeenCalled();

		await wp.find('[data-testid="profile-2"] [data-testid="icon"]').trigger('click');
		await flushPromises();

		expect(modify).toHaveBeenCalled();
		expect(deleteCache).toHaveBeenCalled();
		expect(setLastRequestTimestamp).toHaveBeenCalled();
		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'profile-b se ha seleccionado como perfil por defecto.',
			})
		);
	});

	it('should show an error after select a profile item', async () => {
		const modify = jest.fn().mockRejectedValue();
		const open = jest.fn().mockResolvedValue();

		store.mockModule('notification', { open });
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: null, profiles: fixture, isWelcome: false },
			actions: { modify },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { CButton, CProfileItem } });

		await wp.find('[data-testid="profile-2"] [data-testid="icon"]').trigger('click');
		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'Algo no ha ido bien, por favor, inténtalo de nuevo mas tarde.',
			})
		);
	});

	it('should request a profile delete after confirmation', async () => {
		const openModal = jest.fn().mockResolvedValue(true);
		const openNotification = jest.fn().mockResolvedValue();
		const deleteAction = jest.fn().mockResolvedValue();

		store.mockModule('modal', { open: openModal });
		store.mockModule('notification', { open: openNotification });
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: null, profiles: fixture, isWelcome: false },
			actions: { delete: deleteAction, setLastRequestTimestamp },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { CButton, CProfileItem } });

		await wp.find('[data-testid="profile-1"] [data-testid="delete"]').trigger('click');
		await flushPromises();

		expect(deleteAction).toHaveBeenCalled();
		expect(deleteCache).toHaveBeenCalled();
		expect(setLastRequestTimestamp).toHaveBeenCalled();
		expect(openNotification).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'profile-a se ha eliminado con éxito.',
			})
		);
	});

	it('should show an error after profile delete', async () => {
		const openModal = jest.fn().mockResolvedValue(true);
		const openNotification = jest.fn().mockResolvedValue();
		const deleteAction = jest.fn().mockRejectedValue();

		store.mockModule('modal', { open: openModal });
		store.mockModule('notification', { open: openNotification });
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: null, profiles: fixture, isWelcome: false },
			actions: { delete: deleteAction },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { CButton, CProfileItem } });

		await wp.find('[data-testid="profile-1"] [data-testid="delete"]').trigger('click');
		await flushPromises();

		expect(deleteAction).toHaveBeenCalled();
		expect(openNotification).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'Algo no ha ido bien, por favor, inténtalo de nuevo mas tarde.',
			})
		);
	});

	it('should request for a profile reset', async () => {
		const modify = jest.fn().mockResolvedValue();
		const open = jest.fn().mockResolvedValue();

		store.mockModule('notification', { open });
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: fixture[0], profiles: fixture, isWelcome: false },
			actions: { modify, setLastRequestTimestamp },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { CButton, CProfileItem } });

		await wp.find('[data-testid="profile-reset"] [data-testid="icon"]').trigger('click');
		await flushPromises();

		expect(modify).toHaveBeenCalled();
		expect(deleteCache).toHaveBeenCalled();
		expect(setLastRequestTimestamp).toHaveBeenCalled();
		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'Posición Global sin perfiles.',
			})
		);
	});

	it('should show an error after request for a profile reset', async () => {
		const open = jest.fn().mockResolvedValue();
		const modify = jest.fn().mockRejectedValue();

		store.mockModule('notification', { open });
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: fixture[0], profiles: fixture, isWelcome: false },
			actions: { modify },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { CButton, CProfileItem } });

		await wp.find('[data-testid="profile-reset"] [data-testid="icon"]').trigger('click');
		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'Algo no ha ido bien, por favor, inténtalo de nuevo mas tarde.',
			})
		);
	});

	it('should navigate to create profile page after click on edit profile', async () => {
		const push = jest.spyOn(router, 'push');

		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: null, profiles: fixture, isWelcome: false },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { CButton, CProfileItem } });

		await wp.find('[data-testid="profile-1"] [data-testid="edit"]').trigger('click');

		expect(push).toHaveBeenCalledWith({
			name: 'profiles-create',
			params: { profileId: 'profile-1' },
		});
	});

	it('should request for a profile set and go back when is not desktop', async () => {
		const back = jest.spyOn(router, 'back');
		const setDefaultProfile = jest.fn().mockResolvedValue();
		const open = jest.fn().mockResolvedValue();

		store.mockModule('notification', { open });
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfile: fixture[0], profiles: fixture, isWelcome: false },
			actions: { setDefaultProfile },
		});

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			computed: {
				...component.computed,
				isDesktop: () => false,
			},
			stubs: { CButton, CProfileItem },
		});

		await wp.find('[data-testid="profile-2"] [data-testid="set"]').trigger('click');
		await flushPromises();

		expect(setDefaultProfile).toHaveBeenCalled();
		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'Perfil profile-b seleccionado.',
			})
		);
		expect(back).toHaveBeenCalled();
	});
});
