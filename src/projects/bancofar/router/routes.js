import routes from '@/projects/skyline/router/routes';

export default [
	...routes,
	{
		path: '/home',
		name: 'home',
		redirect: { name: 'sso-rsi' },
	},
	{
		path: '/sso-rsi',
		name: 'legacy-web',
		redirect: { name: 'sso-rsi' },
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
		path: '/sso-lighthouse/:operative/:productId',
		name: 'sso-lighthouse',
		props: { primary: true },
		meta: { fullWidth: true, transition: 'fade' },
		components: {
			primary: () => import(/* webpackChunkName: "v-sso-lighthouse" */ '@views/v-sso-lighthouse'),
		},
	},
];
