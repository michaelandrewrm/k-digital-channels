import routes from '@/projects/skyline/router/routes';

const home = window?.VUE_APP_CONFIG?.home || 'global';

export default [
	...routes,
	{
		path: '/home',
		name: 'home',
		redirect: { name: home },
	},
	{
		path: '/linea-caminos',
		name: 'legacy-web',
		redirect: { name: 'linea-caminos' },
	},
	{
		parent: 'main',
		path: '/linea-caminos',
		name: 'linea-caminos',
		props: { primary: true },
		meta: { fullWidth: true, transition: 'fade' },
		components: {
			primary: () => import(/* webpackChunkName: "v-linea-caminos" */ '@views/v-linea-caminos'),
		},
	},
	{
		path: '/sso-rsi-form/:userId/:tokenSSO/:usuarioAgente?',
		props: { default: true },
		name: 'public-sso-rsi-form',
		components: {
			default: () => import(/* webpackChunkName: "v-sso-rsi-form" */ '@views/v-sso-rsi-form'),
		},
	},
	{
		parent: 'main',
		path: '/sso-lighthouse/:operative/:productId',
		name: 'sso-lighthouse',
		props: { primary: true },
		meta: { fullWidth: true, transition: 'fade' },
		components: {
			primary: () => import(/* webpackChunkName: "v-sso-lighthouse" */ '@views/v-sso-lighthouse'),
		},
	},
	{
		parent: 'main',
		path: '/sso-rsi',
		name: 'sso-rsi',
		props: { primary: true },
		meta: { fullWidth: true, transition: 'fade' },
		components: {
			primary: () => import(/* webpackChunkName: "v-sso-rsi" */ '@views/v-sso-rsi'),
		},
	},
	{
		parent: 'main',
		path: '/bolsa-caminos',
		name: 'bolsa-caminos',
		props: { primary: true },
		meta: { fullWidth: true, transition: 'fade' },
		components: {
			primary: () => import(/* webpackChunkName: "v-bolsa-caminos" */ '@views/v-bolsa-caminos'),
		},
	},
	{
		parent: 'main',
		path: '/tax-info',
		name: 'tax-info',
		props: { primary: { action: 'InformacionFiscal' } },
		meta: { fullWidth: true, transition: 'fade' },
		components: {
			primary: () => import(/* webpackChunkName: "v-linea-caminos" */ '@views/v-linea-caminos'),
		},
	},
];
