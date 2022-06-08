export default [
	{
		path: '*',
		redirect: { name: 'login' },
	},
	{
		path: '/',
		name: 'login',
		components: {
			default: () =>
				import(
					/* webpackChunkName: "v-channels-login", webpackPrefetch: true */ '@views/v-channels-login'
				),
		},
	},
	{
		path: '/dashboard',
		name: 'dashboard',
		components: {
			default: () =>
				import(/* webpackChunkName: "v-dashboard", webpackPrefetch: true */ '@views/v-dashboard'),
		},
	},
];
