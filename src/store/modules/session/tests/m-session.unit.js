import session from '@modules/session/m-session';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';

describe('m-session', () => {
	let store;

	beforeEach(async () => {
		const localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store({
			modules: {
				session,
			},
			strict: false,
		});
	});

	it("stores the user's theme", async () => {
		expect(session.state().theme).toBe('light');
		expect(store.state.session.theme).toBe('light');
		await store.dispatch('session/setTheme', 'dark');
		expect(store.state.session.theme).toBe('dark');
		expect(session.state().theme).toBe('dark');
	});

	it("stores the user's language", async () => {
		expect(session.state().lang).toBe('es');
		expect(store.state.session.lang).toBe('es');
		await store.dispatch('session/changeLanguage', 'en');
		expect(store.state.session.lang).toBe('en');
		expect(session.state().lang).toBe('en');
	});

	it('marks the user as greeted', async () => {
		expect(store.state.session.userGreeted).toBeFalsy();
		await store.dispatch('session/markUserGreeted');
		expect(store.state.session.userGreeted).toBeTruthy();
	});

	it('store the user session', async () => {
		expect(session.state().userName).toBeFalsy();
		expect(store.state.session.userName).toBeFalsy();

		await store.dispatch('session/setUserSession', { userName: 'Robert' });

		expect(session.state().userName).toBeFalsy();
		expect(store.state.session.userName).toBe('Robert');

		await store.dispatch('session/rememberUserSession', { userName: 'Robert' });

		expect(session.state().userName).toBe('Robert');
	});

	it('should remove user session', () => {
		store.dispatch('session/rememberUserSession', {
			userName: 'Harry',
			lastLogin: '2021-05-04',
			rememberToken: 'token',
		});

		expect(store.state.session.userName).toBe('Harry');
		expect(store.state.session.lastLogin).toBe('2021-05-04');
		expect(store.state.session.rememberToken).toBe('token');

		store.dispatch('session/removeUserSession');

		expect(store.state.session.userName).toBeFalsy();
		expect(store.state.session.lastLogin).toBeFalsy();
		expect(store.state.session.rememberToken).toBeFalsy();
	});

	it('should skip the news', () => {
		const version = 'abc-123';
		store.dispatch('session/setNewsId', version);
		expect(store.state.session.newsId).toBe(version);
		expect(localStorage.getItem('newsSession')).toBe(version);
	});

	it('should request a session delete', async () => {
		const service = {
			namespaced: true,
			actions: { request: jest.fn() },
		};

		store = new Vuex.Store({
			modules: { session, service },
			strict: false,
		});

		await store.dispatch('session/deleteSession');

		expect(service.actions.request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'DELETE', url: '/session' } },
			})
		);
	});

	it('should request cache delete', async () => {
		const service = {
			namespaced: true,
			actions: { request: jest.fn() },
		};

		store = new Vuex.Store({
			modules: { session, service },
			strict: false,
		});

		await store.dispatch('session/deleteCache');

		expect(service.actions.request).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				service: { request: { method: 'DELETE', url: '/cache' } },
			})
		);
	});
});
