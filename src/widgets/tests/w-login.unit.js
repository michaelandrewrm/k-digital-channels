import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-login.vue';
import flushPromises from 'flush-promises';
import CTextField from '@tests/stubs/c-text-field.stub';
import CButton from '@tests/stubs/c-button.stub';

jest.mock('@modules/secure/cypher', () => ({
	cypherSha256: jest.fn((fingerprint) => fingerprint),
}));

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-login.vue', () => {
	let wp;
	let store;
	let router;

	const login = jest.fn().mockResolvedValue();
	const loginAnonymous = jest.fn().mockResolvedValue();
	const setUserSession = jest.fn().mockResolvedValue();
	const rememberUserSession = jest.fn().mockResolvedValue();
	const removeUserSession = jest.fn().mockResolvedValue();
	const open = jest.fn().mockResolvedValue(true);
	const fetch = jest.fn().mockResolvedValue();

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('products', { fetch });
		store.mockModule('modal', { open });
		store.mockModule('authn', { login, loginAnonymous });
		store.registerModule('app', {
			namespaced: true,
			state: { onboardingUrl: 'localhost/onboarding', companyId: 'BC' },
		});

		wp = shallowMount(Component, { localVue, store, stubs: { CTextField, CButton } });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to w-login', () => {
		expect(wp.vm.$options.name).toBe('w-login');
	});

	it('should convert the username to uppercase', async () => {
		await wp.find('[data-testid="username"]').setValue('user1');
		expect(wp.find('[data-testid="username"]').element.value).toBe('USER1');
	});

	it('should show an error on invalid username', async () => {
		await wp.find('[data-testid="username"]').setValue('user1');
		await wp.find('[data-testid="username"]').setValue('');

		expect(
			wp
				.find('[data-testid="username-validation"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Este campo es obligatorio');
	});

	it('should show an error on invalid password', async () => {
		await wp.find('[data-testid="password"]').setValue('123456');
		await wp.find('[data-testid="password"]').setValue('');

		expect(
			wp
				.find('[data-testid="password-validation"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Este campo es obligatorio');
	});

	it('should not submit the form with an empty username', async () => {
		await wp.find('[data-testid="password"]').setValue('123456');
		await wp.find('[data-testid="logInButton"]').trigger('click');

		expect(login).not.toHaveBeenCalled();
	});

	it('should not submit the form with an empty password', async () => {
		await wp.find('[data-testid="username"]').setValue('user1');
		await wp.find('[data-testid="logInButton"]').trigger('click');

		expect(login).not.toHaveBeenCalled();
	});

	it('allows to stop remembering a user and resets the form', async () => {
		store.unregisterModule('session');
		store.registerModule('session', {
			namespaced: true,
			actions: { removeUserSession },
			state: { rememberToken: 'token1', userName: 'user1' },
		});

		wp = shallowMount(Component, { localVue, store, stubs: { CTextField, CButton } });

		expect(wp.find('[data-testid="username"]').exists()).toBeFalsy();
		await wp.find('[data-testid="password"]').setValue('123456');

		expect(wp.find('[data-testid="username-validation"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="password-validation"]').exists()).toBeFalsy();

		await wp.find('[data-testid="remove-remembered-user-button"]').trigger('click');
		await flushPromises();
		await localVue.nextTick();

		expect(removeUserSession).toHaveBeenCalled();
		expect(wp.find('[data-testid="username-validation"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="password-validation"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="password"]').element.value).toBeFalsy();
	});

	it('should login', async () => {
		const userData = { username: 'user1', lastLogin: 'today', rememberToken: 'token1' };
		const loginAction = jest.fn().mockResolvedValue(userData);

		store.mockModule('authn', { login: loginAction });
		store.mockModule('session', { setUserSession, rememberUserSession });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CTextField, CButton } });

		await wp.find('[data-testid="username"]').setValue('user1');
		await wp.find('[data-testid="password"]').setValue('123456');
		await wp.find('form').trigger('submit');
		await flushPromises();

		expect(loginAction).toHaveBeenCalled();
		expect(setUserSession).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ userName: 'user1', lastLogin: 'today' })
		);
		expect(rememberUserSession).not.toHaveBeenCalled();
	});

	it('should open a modal after click on remember user', async () => {
		const userData = { username: 'user1', lastLogin: 'today', rememberToken: 'token1' };
		const loginAction = jest.fn().mockResolvedValue(userData);

		store.mockModule('authn', { login: loginAction });
		store.mockModule('session', { setUserSession, rememberUserSession });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CTextField, CButton } });

		await wp.find('[data-testid="username"]').setValue('user1');
		await wp.find('[data-testid="password"]').setValue('123456');

		await wp.find('[data-testid="remember-user"]').trigger('click');
		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-enable-remember-user' })
		);

		await wp.find('form').trigger('submit');
		await flushPromises();

		expect(loginAction).toHaveBeenCalled();

		expect(setUserSession).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ userName: 'user1', lastLogin: 'today' })
		);

		expect(rememberUserSession).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ lastLogin: 'today', rememberToken: 'token1', userName: 'user1' })
		);
	});

	it('should emit an open password recovery event', async () => {
		await wp.find('[data-testid="recover-password-button"]').trigger('click');
		await flushPromises();

		expect(wp.emitted('open-password-recovery')).toBeTruthy();
	});

	it('should open a modal after click on security suggestions', async () => {
		await wp.find('[data-testid="security-suggestions-button"]').trigger('click');
		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-security-suggestions' })
		);
	});

	it('should show an invalid username or password on bad credentials', async () => {
		const reasons = { BAD_CREDENTIALS: 1 << 0, BAD_PASSWORD: 1 << 1, BAD_USER: 1 << 2 };
		const responseKO = { ...reasons, status: reasons.BAD_PASSWORD | reasons.BAD_CREDENTIALS };

		const loginAction = jest.fn().mockRejectedValue(responseKO);

		store.mockModule('authn', { login: loginAction });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CTextField, CButton } });

		await wp.find('[data-testid="username"]').setValue('user1');
		await wp.find('[data-testid="password"]').setValue('123456');
		await wp.find('form').trigger('submit');
		await flushPromises();

		expect(wp.find('[data-testid="username"]').element.value).toBeTruthy();
		expect(wp.find('[data-testid="password"]').element.value).toBeFalsy();
		expect(wp.find('[data-testid="user-validation"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="password-validation"]').exists()).toBeTruthy();
	});

	it('should not show any error on invalid token', async () => {
		const reasons = { BAD_CREDENTIALS: 1 << 0, BAD_PASSWORD: 1 << 1, BAD_USER: 1 << 2 };
		const responseKO = { ...reasons, status: reasons.BAD_USER };

		const loginAction = jest.fn().mockRejectedValue(responseKO);

		store.mockModule('authn', { login: loginAction });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CTextField, CButton } });

		await wp.find('[data-testid="username"]').setValue('user1');
		await wp.find('[data-testid="password"]').setValue('123456');
		await wp.find('form').trigger('submit');
		await flushPromises();

		expect(wp.find('[data-testid="username"]').element.value).toBeFalsy();
		expect(wp.find('[data-testid="password"]').element.value).toBeFalsy();
		expect(wp.find('[data-testid="user-validation"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="password-validation"]').exists()).toBeFalsy();
	});

	it('should not show any error after stop remembering an username', async () => {
		const reasons = { BAD_CREDENTIALS: 1 << 0, BAD_PASSWORD: 1 << 1, BAD_USER: 1 << 2 };
		const responseKO = { ...reasons, status: reasons.BAD_PASSWORD | reasons.BAD_CREDENTIALS };

		const loginAction = jest.fn().mockRejectedValue(responseKO);

		store.mockModule('authn', { login: loginAction });
		store.unregisterModule('session');
		store.registerModule('session', {
			namespaced: true,
			state: { rememberToken: 'token1', userName: 'user1' },
			actions: { removeUserSession },
		});

		wp = shallowMount(Component, { localVue, store, router, stubs: { CTextField, CButton } });

		await wp.find('[data-testid="password"]').setValue('123456');
		await wp.find('form').trigger('submit');
		await flushPromises();

		expect(setUserSession).not.toHaveBeenCalled();
		expect(rememberUserSession).not.toHaveBeenCalled();
		expect(fetch).not.toHaveBeenCalled();

		await wp.find('[data-testid="remove-remembered-user-button"]').trigger('click');
		await flushPromises();
		await localVue.nextTick();

		expect(wp.find('[data-testid="password"]').element.value).toBeFalsy();
		expect(wp.find('[data-testid="user-validation"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="password-validation"]').exists()).toBeFalsy();
	});

	it('should open a modal after no internet connection', async () => {
		await wp.find('[data-testid="username"]').setValue('user1');
		await wp.find('[data-testid="password"]').setValue('123456');
		await wp.find('form').trigger('submit');
		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-no-internet' })
		);
	});

	it('should redirect to global position on success', async () => {
		const loginOK = { username: 'user1', lastLogin: 'today', rememberToken: 'token1' };
		const productsOK = [{ id: 'product-1' }, { id: 'product-2' }];

		const fetchAction = jest.fn().mockResolvedValue(productsOK);
		const loginAction = jest.fn().mockResolvedValue(loginOK);

		store.mockModule('products', { fetch: fetchAction });
		store.mockModule('authn', { login: loginAction });

		router.replace({ name: 'login' });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CTextField, CButton } });

		await wp.find('[data-testid="username"]').setValue('user1');
		await wp.find('[data-testid="password"]').setValue('123456');
		await wp.find('form').trigger('submit');
		await flushPromises();

		expect(router.currentRoute.name).toBe('global');
	});

	it('should redirect to the last visited page', async () => {
		const loginOK = { username: 'user1', lastLogin: 'today', rememberToken: 'token1' };
		const productsOK = [{ id: 'product-1' }, { id: 'product-2' }];

		const fetchAction = jest.fn().mockResolvedValue(productsOK);
		const loginAction = jest.fn().mockResolvedValue(loginOK);

		store.mockModule('products', { fetch: fetchAction });
		store.mockModule('authn', { login: loginAction });

		router.replace({ name: 'login' });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CTextField, CButton } });

		await wp.find('[data-testid="username"]').setValue('user1');
		await wp.find('[data-testid="password"]').setValue('123456');
		await wp.find('form').trigger('submit');
		await flushPromises();

		expect(router.currentRoute.name).toBe('global');

		router.replace({ name: 'login', query: { redirect: { name: 'transfers' } } });

		await wp.setData({ isLoading: false });
		await wp.find('form').trigger('submit');
		await flushPromises();

		expect(router.currentRoute.name).toBe('transfers');
	});

	it('should not redirect to the last visited page on diff user', async () => {
		const loginOK = { username: 'user1', lastLogin: 'today', rememberToken: 'token1' };
		const productsOK1 = [{ id: 'product-1' }, { id: 'product-2' }];
		const productsOK2 = [{ id: 'product-3' }, { id: 'product-4' }];

		const loginAction = jest.fn().mockResolvedValue(loginOK);
		const fetchAction = jest
			.fn()
			.mockResolvedValueOnce(productsOK1)
			.mockResolvedValueOnce(productsOK2);

		store.mockModule('products', { fetch: fetchAction });
		store.mockModule('authn', { login: loginAction });

		router.replace({ name: 'login' });

		wp = shallowMount(Component, { localVue, store, router, stubs: { CTextField, CButton } });

		await wp.find('[data-testid="username"]').setValue('user1');
		await wp.find('[data-testid="password"]').setValue('123456');
		await wp.find('form').trigger('submit');
		await flushPromises();

		expect(router.currentRoute.name).toBe('global');

		router.replace({ name: 'login', query: { redirect: { name: 'transfers' } } });

		await wp.setData({ isLoading: false });
		await wp.find('form').trigger('submit');
		await flushPromises();

		expect(router.currentRoute.name).toBe('global');
	});
});
