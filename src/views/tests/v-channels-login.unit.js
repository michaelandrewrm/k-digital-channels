import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-channels-login.vue';
import CButton from '@tests/stubs/c-button.stub';
import CTextField from '@tests/stubs/c-text-field.stub';
import flushPromises from 'flush-promises';
import Vuex from 'vuex';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-channels-login.vue', () => {
	let wp;
	let store;
	let router;

	const setUserSession = jest.fn().mockResolvedValue();
	const rememberUserSession = jest.fn().mockResolvedValue();
	const removeUserSession = jest.fn().mockResolvedValue();
	const login = jest.fn().mockImplementation((storeContext, { username, password }) => {
		if (username === '007' && password === '123456') {
			return Promise.resolve({
				username: 'Eduardo',
				lastLogin: new Date().toISOString(),
				rememberToken: '1234',
			});
		}

		const reasons = {
			BAD_CREDENTIALS: 1 << 0,
			BAD_PASSWORD: 1 << 1,
			BAD_USER: 1 << 2,
		};

		const error = { ...reasons, status: reasons.BAD_PASSWORD | reasons.BAD_CREDENTIALS };

		return Promise.reject(error);
	});

	beforeEach(() => {
		const { localRouter, shallowStore } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('session', {
			setUserSession,
			rememberUserSession,
			removeUserSession,
		});

		store.mockModule('agent', { login });

		store.mockModule('loading', {
			start: jest.fn(),
			end: jest.fn(),
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { CButton, CTextField },
		});
	});

	it('has a name equal to v-channels-login', () => {
		expect(wp.vm.$options.name).toBe('v-channels-login');
	});

	it('converts the username to uppercase', async () => {
		const input = wp.findComponent({ ref: 'usernameInput' });

		await input.setValue('abc123');

		expect(input.element.value).toBe('ABC123');
	});

	it('does not validate an empty username', async () => {
		const inputUser = wp.findComponent({ ref: 'usernameInput' });

		await inputUser.setValue('abc123');
		await wp.find('form').trigger('submit');

		expect(wp.find('[data-testid="password-validation"]').exists()).toBeTruthy();
	});

	it('does not validate an empty password', async () => {
		const inputPass = wp.findComponent({ ref: 'passwordInput' });

		await inputPass.setValue('abc123');
		await wp.find('form').trigger('submit');

		expect(wp.find('[data-testid="username-validation"]').exists()).toBeTruthy();
	});

	it('logins successfully', async () => {
		router.addRoute({ name: 'dashboard', path: 'dashboard' });

		const inputUser = wp.findComponent({ ref: 'usernameInput' });
		const inputPass = wp.findComponent({ ref: 'passwordInput' });

		await inputUser.setValue('007');
		await inputPass.setValue('123456');
		await wp.find('form').trigger('submit');

		await flushPromises();

		expect(login).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				username: '007',
				password: '123456',
			})
		);

		expect(setUserSession).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				userName: 'Eduardo',
				lastLogin: expect.any(String),
			})
		);

		expect(router.history.current.name).toBe('dashboard');
	});

	it('shows error on bad credentials', async () => {
		const inputUser = wp.findComponent({ ref: 'usernameInput' });
		const inputPass = wp.findComponent({ ref: 'passwordInput' });

		await inputUser.setValue('007');
		await inputPass.setValue('111111');
		await wp.find('form').trigger('submit');

		await flushPromises();

		expect(login).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				username: '007',
				password: '111111',
			})
		);

		expect(wp.find('[data-testid="username"]').element.value).toBeTruthy();
		expect(wp.find('[data-testid="password"]').element.value).toBeFalsy();
		expect(wp.find('[data-testid="user-validation"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="password-validation"]').exists()).toBeTruthy();
	});
});
