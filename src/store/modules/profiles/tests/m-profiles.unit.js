import profiles from '@modules/profiles/m-profiles';

const newInstance = createPristineVue();

describe('m-profiles', () => {
	let store;
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

	const request = jest.fn().mockResolvedValue({ data: { profiles: fixture } });

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('service', { request });
		store.registerModule('profiles', profiles);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should get a profile list and set a default profile', async () => {
		await store.dispatch('profiles/get');

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/profiles' } },
			})
		);

		expect(store.state.profiles.defaultProfile).toMatchObject(fixture[0]);
		expect(store.state.profiles.profiles).toHaveLength(2);
	});

	it('should request a profile create', async () => {
		const data = {
			name: 'profile-a',
			isDefault: false,
			productIds: ['product-1'],
		};

		await store.dispatch('profiles/create', data);

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/profiles', method: 'POST' } },
				payload: data,
			})
		);

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/profiles', method: 'GET' } },
			})
		);
	});

	it('should request a profile update', async () => {
		const id = 'profile-1';
		const data = {
			name: 'profile-a',
			isDefault: true,
			productIds: ['product-1'],
		};

		await store.dispatch('profiles/update', { id, ...data });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/profiles/profile-1', method: 'PUT' } },
				payload: data,
			})
		);
	});

	it('should request a profile modify', async () => {
		const id = 'profile-1';
		const productIds = { 'product-1': 'delete' };
		const data = { name: 'profile-a', isDefault: true };

		await store.dispatch('profiles/modify', { id, ...data, productIds });

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { url: '/profiles/profile-1', method: 'PATCH' } },
				payload: { ...data, ...productIds },
			})
		);
	});

	it('should request a profile delete', async () => {
		const id = 'profile-1';
		await store.dispatch('profiles/delete', id);

		expect(request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'DELETE', url: '/profiles/profile-1' } },
			})
		);
	});

	it('should set is welcome', async () => {
		expect(store.state.profiles.isWelcome).toBeFalsy();

		await store.dispatch('profiles/setWelcome');

		expect(store.state.profiles.isWelcome).toBeTruthy();
	});

	it('should get a profile from the state', async () => {
		await store.dispatch('profiles/get');
		const profile = await store.dispatch('profiles/getProfile', 'profile-1');

		expect(profile).toMatchObject(fixture[0]);
		expect(request).not.toHaveBeenCalledTimes(2);
	});

	it('should get a profile from a new response', async () => {
		const profile = await store.dispatch('profiles/getProfile', 'profile-1');

		expect(profile).toMatchObject(fixture[0]);
		expect(request).toHaveBeenCalledTimes(1);
	});
});
