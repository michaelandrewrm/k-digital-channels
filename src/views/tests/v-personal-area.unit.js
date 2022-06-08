import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-personal-area.vue';
import CToggle from '@tests/stubs/generic-checkbox.stub';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-personal-area.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { localRouter, shallowStore } = newInstance;

		store = shallowStore;
		router = localRouter;

		const getPushNotificationState = jest.fn().mockResolvedValue(true);
		store.mockModule('userNotifications', { getPushNotificationState });

		const setTheme = jest.fn().mockImplementation(store.mockCommit('theme'));
		store.registerModule('session', {
			namespaced: true,
			state() {
				return {
					theme: 'light',
					lastLogin: new Date(),
					userName: 'Roberto',
				};
			},
			actions: { setTheme },
		});

		wp = shallowMount(Component, { localVue, store, router, stubs: { CToggle } });
	});

	it('has a name equal to v-personal-area', () => {
		expect(wp.vm.$options.name).toBe('v-personal-area');
	});

	it('should detect the theme from session', async () => {
		await router.push({ name: 'personal-area' });

		expect(wp.find('[data-test-id="toggle-theme-radio"]').element.checked).toBeFalsy();

		await wp.find('[data-test-id="toggle-theme"]').trigger('click');
		expect(wp.find('[data-test-id="toggle-theme-radio"]').element.checked).toBeTruthy();

		await wp.find('[data-test-id="toggle-theme"]').trigger('click');
		expect(wp.find('[data-test-id="toggle-theme-radio"]').element.checked).toBeFalsy();
	});

	it('should open modal after click on logout', async () => {
		const activeLogout = jest.fn().mockResolvedValue();
		store.mockModule('authn', { activeLogout });

		await wp.find('[data-test-id="logout-button"]').trigger('click');
		expect(activeLogout).toHaveBeenCalled();
	});

	it('should open details after click on view more even with a opened secondary view', async () => {
		const push = jest.spyOn(router, 'push');

		await wp.find('[data-testid="user-card"]').vm.$emit('expand');
		await localVue.nextTick();

		expect(wp.vm.$route.name).toBe('personal-details');
		expect(push).toHaveBeenNthCalledWith(1, {
			name: 'personal-details',
		});

		await wp.find('[data-testid="user-card"]').vm.$emit('expand');
		expect(push).not.toHaveBeenCalledTimes(2);

		await wp.find('[data-testid="language"]').trigger('click');
		expect(wp.vm.$route.name).toBe('language');

		await wp.find('[data-testid="user-card"]').vm.$emit('expand');
		await localVue.nextTick();

		expect(wp.vm.$route.name).toBe('personal-details');
	});

	it('should not navigate to the current route', async () => {
		await router.push({ name: 'personal-area' });
		const languageButton = wp.find('[data-testid="language"]');

		await languageButton.trigger('click');

		expect(router.currentRoute.name).toBe('language');

		await languageButton.trigger('click');

		expect(router.currentRoute.name).toBe('language');
	});

	it('should call router back after error on navigate', async () => {
		await router.push({ name: 'personal-area' });
		const push = jest.spyOn(router, 'push').mockRejectedValue();
		const historyBack = jest.spyOn(window.history, 'back');

		await wp.find('[data-testid="language"]').trigger('click');

		expect(push).toHaveBeenCalled();
		expect(historyBack).toHaveBeenCalled();

		expect(router.currentRoute.name).toBe('personal-area');
	});

	it('should disable push notifications', async () => {
		const open = jest.fn().mockResolvedValue(true);
		const getPushNotificationState = jest.fn().mockResolvedValue(true);
		const setPushNotificationState = jest.fn().mockResolvedValue();
		store.mockModule('userNotifications', { getPushNotificationState, setPushNotificationState });
		store.mockModule('modal', { open });

		await wp.find('[data-test-id="toggle-push-radio"]').trigger('click');
		await flushPromises();

		expect(wp.find('[data-test-id="toggle-push-radio"]').exists()).toBeFalsy();
		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-confirm-push-notification' })
		);
		expect(setPushNotificationState).toHaveBeenCalledWith(expect.anything(), false);
	});

	it('should try disabling push notifications but if service fails, reset toggle', async () => {
		const open = jest.fn().mockResolvedValue(true);
		const getPushNotificationState = jest.fn().mockResolvedValue(true);
		const setPushNotificationState = jest.fn().mockRejectedValue();
		store.mockModule('userNotifications', { getPushNotificationState, setPushNotificationState });
		store.mockModule('modal', { open });

		await wp.find('[data-test-id="toggle-push-radio"]').trigger('click');
		await flushPromises();

		expect(wp.find('[data-test-id="toggle-push-radio"]').exists()).toBeTruthy();
		expect(setPushNotificationState).toHaveBeenCalledWith(expect.anything(), false);
	});

	it('should try disabling push notifications but if user regrets, reset toggle', async () => {
		const open = jest.fn().mockResolvedValue(false); // user don't confirm
		const getPushNotificationState = jest.fn().mockResolvedValue(true);
		const setPushNotificationState = jest.fn().mockResolvedValue();
		store.mockModule('userNotifications', { getPushNotificationState, setPushNotificationState });
		store.mockModule('modal', { open });

		await wp.find('[data-test-id="toggle-push-radio"]').setChecked();
		await flushPromises();

		expect(wp.find('[data-test-id="toggle-push-radio"]').exists()).toBeTruthy();
		expect(setPushNotificationState).not.toHaveBeenCalled();
	});
});
