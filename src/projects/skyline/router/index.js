import Vue from 'vue';
import VueRouter from 'vue-router';
import { importLocale } from '@locales/setup';
import store from '@store';
import serviceWorkerFlow from '@/serviceWorkerFlow';
import localRoutes from '@local-router/routes';
import MChunkError from '@modals/m-chunk-error';
import MNoInternet from '@modals/m-no-internet';
import scrollBehavior from './scroll-behavior';

Vue.use(VueRouter);

/**
 * Agrega la opción `parent` en las rutas, para poder definir
 * un padre desde la ruta sin necesidad de meterlo como children
 * en la ruta padre.
 */
const routes = localRoutes
	.map((route, index, original) => {
		if (route.parent) {
			const parent = original.find(({ name }) => name === route.parent);

			if (parent) {
				parent.children.push(route);
			}

			return null;
		}

		return route;
	})
	.filter(Boolean);

const isHybrid = navigator.userAgent.includes('Skybrid');

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	scrollBehavior,
	routes,
});

router.onError(async (error) => {
	if (error.name === 'ChunkLoadError') {
		if (error.type === 'missing') {
			await store.dispatch('modal/open', MChunkError);
		} else if (error.type === 'error') {
			await store.dispatch('authn/logout');
			await store.dispatch('modal/open', MNoInternet);
		}
	}
});

router.beforeEach(async (to, from, next) => {
	/**
	 * There are two ways to set a route as "public":
	 * 1. add the name on publicPages constants
	 * 2. define the name with the prefix "public-"
	 */
	const { params, query } = to;
	const publicPages = ['login'];
	const authRequired = !(publicPages.includes(to.name) || to.name.startsWith('public-'));
	const { dispatch, state } = store;
	const { loggedIn } = state.authn;
	const { lang } = state.session;
	const isDev = process.env.NODE_ENV === 'development';
	const redirect = { name: 'login', query: { redirect: to.fullPath }, replace: true };

	if (lang) {
		await importLocale(lang);
	}

	if (store.hasModule('modal') && Object.keys(state.modal.queue).length && !params?.action) {
		await dispatch('modal/closeAll');
		return next(false);
	}

	// En modo híbrido, acceder a la posición global debería cerrar el webview.
	if (isHybrid && (to.name === 'global' || to.name === 'sso-rsi')) {
		window.postMessage({ name: 'bridge-exit-app', to: 'global' }, '*');
		return next(false);
	}

	if (loggedIn && query.entryPoint) {
		window.postMessage({ name: 'bridge-exit-app' }, '*');
	}

	if (authRequired && !loggedIn) {
		if (query.entryPoint) {
			return next();
		}

		if (query.session && !from.name) {
			// Redirigimos al login y lo marcamos como punto de entrada.
			// En el hook afterEach volveremos a hacer la redirección a la
			// página requerida originalmente. Se hace esta redirección para
			// que al volver haciendo click en el botón atrás si caemos en
			// el login con entryPoint a verdadero y además tenemos sesión,
			// significa que el usuario quiere salir del webview.
			return next({ name: 'entry', query: { redirect: to.fullPath, entryPoint: true } });
		}

		/* istanbul ignore next */
		if (query.session && from.name) {
			return store
				.dispatch('authn/loginFromToken', { session: query.session })
				.then(() => store.dispatch('user/getPersonalDetails'))
				.then(({ data: { name } }) => store.dispatch('session/setUserSession', { userName: name }))
				.then(() => {
					if (query.externalotp) {
						return store.dispatch('otp/disableModal');
					}
				})
				.then(() => {
					next();
					window.dispatchEvent(new Event('ready-for-action'));
				})
				.catch((err) => {
					const { error } = console;
					error(err);
					window.dispatchEvent(new Event('bridge-login-error'));
					next(redirect);
				});
		}

		/* istanbul ignore next */
		if (isDev) {
			// * Autologin: use only on mocked servers
			const session = sessionStorage.getItem('secure');
			if (session) {
				const { rememberToken, password } = JSON.parse(session);
				if (rememberToken && password) {
					return store
						.dispatch('authn/login', {
							rememberToken,
							password,
						})
						.then(async ({ username: userName, lastLogin }) => {
							await store.dispatch('session/setUserSession', {
								userName,
								lastLogin,
							});
							next();
							window.dispatchEvent(new Event('ready-for-action'));
						})
						.catch(() => {
							next(redirect);
						});
				}
			}
		}

		return next(redirect);
	}
	next();
});

let ran = false;

router.afterEach(() => {
	if (ran) {
		return;
	}
	ran = true;
	if (router.currentRoute?.query?.entryPoint) {
		const to = router.resolve(router.currentRoute.query.redirect).route;
		// Crea una segunda entrada en el historial
		router.push({ name: to.name, params: to.params, query: to.query });
	}
	serviceWorkerFlow();
});

export default router;
