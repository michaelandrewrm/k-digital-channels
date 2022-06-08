import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import component from '@views/v-product-profiles';
import accounts from '@tests/fixtures/products/accounts';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-product-profiles.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = [
		{
			id: 'profile-1',
			name: 'profile',
			isDefault: false,
		},
		{
			id: 'profile-2',
			name: 'profile',
			isDefault: false,
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

	const CProfileProductItem = {
		template: `
			<div @click="selectItem">
				<input
					v-bind="$attrs"
					v-on="$listeners"
					type="checkbox"
					v-model="localValue"
				/>
			</div>
		`,
		model: { prop: 'value', event: 'update:value' },
		props: ['value'],
		computed: {
			localValue: {
				get() {
					return this.value;
				},
				set() {
					this.$emit('update:value', !this.value);
				},
			},
		},
		methods: {
			selectItem() {
				this.localValue = !this.localValue;
				this.$emit('select-item');
			},
		},
	};

	const open = jest.fn().mockResolvedValue();
	const get = jest.fn().mockResolvedValue({ ...accounts[0], profiles: [fixture[0]] });
	const setLastRequestTimestamp = jest.fn().mockResolvedValue();
	const deleteCache = jest.fn().mockResolvedValue();

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;
		store = shallowStore;
		router = localRouter;

		store.mockModule('session', { deleteCache });
		store.mockModule('notification', { open });
		store.mockModule('products', { get });
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfiles: null, profiles: [], isWelcome: false },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { WActions } });
	});

	it('has a name equal to v-product-profiles', () => {
		expect(wp.vm.$options.name).toBe('v-product-profiles');
	});

	it('should show an error when no profiles', () => {
		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
	});

	it('should show a create profile button when no profiles', async () => {
		await wp.find('[data-testid="create-profile"]').trigger('click');
		expect(router.currentRoute.name).toBe('profiles-create');
	});

	it('should navigate to create profile page', async () => {
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfiles: null, profiles: fixture, isWelcome: false },
		});

		wp = shallowMount(component, { localVue, store, router, stubs: { WActions } });

		await flushPromises();
		await wp.find('[data-testid="create-profile"]').trigger('click');
		expect(router.currentRoute.name).toBe('profiles-create');
	});

	it('should request a profile modify', async () => {
		const modifyAction = jest.fn().mockResolvedValue();
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfiles: null, profiles: fixture, isWelcome: false },
			actions: { modify: modifyAction, setLastRequestTimestamp },
		});

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { productId: 'account-1' },
			stubs: { WActions, CProfileProductItem },
		});

		await flushPromises();
		await wp.find('#profile-1').trigger('click');
		await wp.find('#profile-2').trigger('click');
		await wp.find('[data-testid="update-profile"]').trigger('click');
		await flushPromises();

		expect(modifyAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				id: 'profile-1',
				name: 'profile',
				isDefault: false,
				productIds: { 'account-1': 'delete' },
			})
		);
		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'Perfil profile actualizado.',
			})
		);
		expect(modifyAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				id: 'profile-2',
				name: 'profile',
				isDefault: false,
				productIds: { 'account-1': 'add' },
			})
		);
		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'Perfil profile actualizado.',
			})
		);
		expect(deleteCache).toHaveBeenCalled();
		expect(setLastRequestTimestamp).toHaveBeenCalled();
	});

	it('should show an error after request a profiles modify', async () => {
		const openAction = jest.fn().mockResolvedValue();
		const modifyAction = jest.fn().mockRejectedValue();
		store.mockModule('notification', { open: openAction });
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfiles: null, profiles: fixture, isWelcome: false },
			actions: { modify: modifyAction, setLastRequestTimestamp },
		});

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { productId: 'account-1' },
			stubs: { WActions, CProfileProductItem },
		});

		await flushPromises();
		await wp.find('#profile-1').trigger('click');
		await wp.find('[data-testid="update-profile"]').trigger('click');
		await flushPromises();

		expect(modifyAction).toHaveBeenCalled();
		expect(openAction).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				text: 'Algo no ha ido bien al actualizar el perfil profile.',
			})
		);
	});

	it('should navigate to global position when no profiles after modify', async () => {
		const push = jest.spyOn(router, 'push');
		const modifyAction = jest.fn().mockResolvedValue();
		const getAction = jest
			.fn()
			.mockImplementation(() => Promise.reject())
			.mockResolvedValue({ ...accounts[0], profiles: [{ id: 'profile-1' }] });
		store.unregisterModule('profiles');
		store.registerModule('profiles', {
			namespaced: true,
			state: { defaultProfiles: null, profiles: fixture, isWelcome: false },
			actions: { modify: modifyAction, setLastRequestTimestamp },
		});
		store.mockModule('products', { get: getAction });

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { productId: 'account-1' },
			stubs: { WActions, CProfileProductItem },
		});

		await flushPromises();
		await wp.find('#profile-1').trigger('click');

		try {
			await wp.find('[data-testid="update-profile"]').trigger('click');
			await flushPromises();
		} catch (error) {
			expect(push).toHaveBeenCalledWith({ name: 'global' });
		}
	});
});
