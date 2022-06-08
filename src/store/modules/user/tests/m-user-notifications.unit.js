import userNotifications from '@modules/user/m-user-notifications';

const newInstance = createPristineVue();

describe('m-user-notifications', () => {
	let store;
	const request = jest.fn().mockResolvedValue({ data: { push: true } });

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('service', { request });
		store.registerModule('userNotifications', { ...userNotifications });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should get a push notification state', async () => {
		await store.dispatch('userNotifications/getPushNotificationState');

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/notifications/push' } },
			})
		);
	});

	it('should set a push notification state', async () => {
		await store.dispatch('userNotifications/setPushNotificationState', false);

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'POST', url: '/notifications/push' } },
				payload: { activated: false },
			})
		);
	});
});
