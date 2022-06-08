import Vue from 'vue';
import VueRouter from 'vue-router';
import { importLocale } from '@locales/setup';
import store from '@store';
import serviceWorkerFlow from '@/serviceWorkerFlow';
import routes from '@local-router/routes';

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

router.beforeEach(async (to, from, next) => {
	const publicPages = ['login'];
	const authRequired = !publicPages.includes(to.name);
	const { loggedIn } = store.state.agent;
	const { lang } = store.state.session;

	if (lang) {
		await importLocale(lang);
	}

	if (authRequired && !loggedIn) {
		return next({
			name: 'login',
			query: { redirect: to.fullPath },
		});
	}
	next();
});

let ran = false;

router.afterEach(() => {
	if (ran) {
		return;
	}
	ran = true;
	serviceWorkerFlow();
});

export default router;
