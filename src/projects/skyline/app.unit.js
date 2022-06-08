import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from './app.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('app.vue', () => {
	let wp;
	let store;
	let router;
	let state;
	let actions;

	beforeEach(() => {
		const { shallowStore, shallowRouter } = newInstance;

		store = shallowStore;
		router = shallowRouter;

		state = {
			authn: { loggedIn: false },
			session: { theme: 'light', lang: 'es' },
			app: { legalIdentity: 'abc' },
			loading: { status: false },
			service: { lastRequestTimestamp: 0 },
			device: { isPWA: false },
		};

		actions = {
			authn: {
				passiveLogout: jest.fn().mockResolvedValue(),
				refresh: jest.fn().mockResolvedValue(),
				logout: jest.fn().mockResolvedValue(),
			},
		};

		const SET = (vuexState, data) => {
			// eslint-disable-next-line no-param-reassign
			vuexState[data.key] = data.value;
		};

		Object.keys(state).forEach((moduleName) => {
			store.registerModule(moduleName, {
				namespaced: true,
				state: state[moduleName],
				mutations: { SET },
			});
		});

		store.unregisterModule('authn');
		store.registerModule('authn', {
			namespaced: true,
			state: state.authn,
			mutations: { SET },
			actions: { ...actions.authn },
		});

		store.mockModule('bugsnag', { log: jest.fn().mockResolvedValue() });

		router.addRoute({ name: 'login', path: '/login' });

		wp = shallowMount(Component, { localVue, store, router });

		jest.useFakeTimers('modern');
	});

	it('has a name equal to app', () => {
		expect(wp.vm.$options.name).toBe('app');
	});

	/**
	 * Si es una PWA debería preventdefaultear el evento contextmenu
	 */
	it('should add a contextmenu event listener when is a pwa', async () => {
		const ev = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
		document.body.dispatchEvent(ev);
		expect(ev.defaultPrevented).toBeFalsy();

		await store.commit('device/SET', { key: 'isPWA', value: true });

		const ev2 = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
		document.body.dispatchEvent(ev2);
		expect(ev2.defaultPrevented).toBeTruthy();
	});

	/**
	 * A los 9 minutos de inactividad debería mostrar una modal de
	 * prevención de cierre de sesión. Al aceptar la modal, debería
	 * renovar la sesión.
	 */
	it('show a expiration session modal after 9 minutes of network inactivity', async () => {
		const oneMinuteInMs = 60000 + 1;
		let now = new Date('2022-01-01').getTime();
		global.Date.now = jest.spyOn(Date, 'now').mockImplementation(() => now);

		const open = jest.fn().mockResolvedValue(true);
		store.mockModule('modal', { open });

		await store.commit('service/SET', { key: 'lastRequestTimestamp', value: now });
		await store.commit('authn/SET', { key: 'loggedIn', value: true });

		now += oneMinuteInMs;
		await jest.advanceTimersByTime(oneMinuteInMs);
		await flushPromises();

		expect(open).not.toHaveBeenCalled();

		now += oneMinuteInMs * 8;
		await jest.advanceTimersByTime(oneMinuteInMs * 8);
		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-confirm' }),
				props: expect.objectContaining({ title: 'Sesión a punto de expirar' }),
			})
		);
		expect(actions.authn.refresh).toHaveBeenCalled();

		global.Date.now.mockRestore();
	});

	/**
	 * A los 9 minutos de inactividad debería mostrar una modal de
	 * prevención de cierre de sesión. Al cancelar la modal, debería
	 * cerrar la sesión.
	 */
	it('close modal of 9 minutes of network inactivity and refresh sesion', async () => {
		const oneMinuteInMs = 60000 + 1;
		let now = new Date('2022-01-01').getTime();
		global.Date.now = jest.spyOn(Date, 'now').mockImplementation(() => now);

		const open = jest.fn().mockResolvedValue(null);
		store.mockModule('modal', { open });

		await store.commit('service/SET', { key: 'lastRequestTimestamp', value: now });
		await store.commit('authn/SET', { key: 'loggedIn', value: true });

		now += oneMinuteInMs;
		await jest.advanceTimersByTime(oneMinuteInMs);
		await flushPromises();

		expect(open).not.toHaveBeenCalled();

		now += oneMinuteInMs * 8;
		await jest.advanceTimersByTime(oneMinuteInMs * 8);
		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-confirm' }),
				props: expect.objectContaining({ title: 'Sesión a punto de expirar' }),
			})
		);
		expect(actions.authn.refresh).toHaveBeenCalled();

		global.Date.now.mockRestore();
	});

	/**
	 * A los 9 minutos de inactividad debería mostrar una modal de
	 * prevención de cierre de sesión. Al cerrar la modal, debería
	 * renovar la sesión.
	 */
	it('cancel modal 9 minutes of network inactivity and close sesion', async () => {
		const oneMinuteInMs = 60000 + 1;
		let now = new Date('2022-01-01').getTime();
		global.Date.now = jest.spyOn(Date, 'now').mockImplementation(() => now);

		const open = jest.fn().mockResolvedValue(false);
		store.mockModule('modal', { open });

		await store.commit('service/SET', { key: 'lastRequestTimestamp', value: now });
		await store.commit('authn/SET', { key: 'loggedIn', value: true });

		now += oneMinuteInMs;
		await jest.advanceTimersByTime(oneMinuteInMs);
		await flushPromises();

		expect(open).not.toHaveBeenCalled();

		now += oneMinuteInMs * 8;
		await jest.advanceTimersByTime(oneMinuteInMs * 8);
		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-confirm' }),
				props: expect.objectContaining({ title: 'Sesión a punto de expirar' }),
			})
		);
		expect(actions.authn.refresh).not.toHaveBeenCalled();
		expect(actions.authn.logout).toHaveBeenCalled();

		global.Date.now.mockRestore();
	});

	it('close the current session after 10 minutes of network inactivity', async () => {
		const oneMinuteInMs = 60000 + 1;
		let now = new Date('2022-01-01').getTime();
		global.Date.now = jest.spyOn(Date, 'now').mockImplementation(() => now);

		const open = jest.fn().mockResolvedValue(true);
		store.mockModule('modal', { open });

		await store.commit('service/SET', { key: 'lastRequestTimestamp', value: now });
		await store.commit('authn/SET', { key: 'loggedIn', value: true });

		now += oneMinuteInMs * 10;
		await jest.advanceTimersByTime(oneMinuteInMs * 10);
		await flushPromises();

		expect(actions.authn.passiveLogout).toHaveBeenCalled();

		global.Date.now.mockRestore();
	});

	it('redirect to login if user lost session', async () => {
		const oneMinuteInMs = 60000 + 1;
		let now = new Date('2022-01-01').getTime();
		global.Date.now = jest.spyOn(Date, 'now').mockImplementation(() => now);

		const open = jest.fn().mockResolvedValue(true);
		store.mockModule('modal', { open });

		expect(router.currentRoute.name).not.toBe('login');

		await store.commit('authn/SET', { key: 'loggedIn', value: true });
		await flushPromises();
		await store.commit('authn/SET', { key: 'loggedIn', value: false });
		await flushPromises();
		now += oneMinuteInMs * 10;
		await jest.advanceTimersByTime(oneMinuteInMs * 10);
		await flushPromises();

		expect(router.currentRoute.name).toBe('login');
		expect(actions.authn.passiveLogout).not.toHaveBeenCalled();
		global.Date.now.mockRestore();
	});
});
