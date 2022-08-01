import config from '@local-router';

export default [
	...config.routes,
	{
		path: '*',
		redirect: { name: 'login' },
	},
	{
		path: '/entry',
		name: 'entry',
	},
	{
		path: '/',
		name: 'login',
		components: {
			default: () =>
				import(/* webpackChunkName: "v-login", webpackPrefetch: true */ '@views/v-login'),
		},
	},
	{
		path: '/main/',
		name: 'main',
		props: { default: true },
		components: {
			default: () => import(/* webpackChunkName: "v-main" */ '@views/v-main'),
		},
		children: [
			{
				path: 'global',
				name: 'global',
				props: { primary: true },
				meta: { fullWidth: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
				},
			},
			{
				path: 'customer-service',
				name: 'customer-service',
				props: { primary: true },
				components: {
					primary: () =>
						import(/* webpackChunkName: "v-customer-service" */ '@views/v-customer-service'),
				},
			},
			{
				path: 'customer-chat',
				name: 'customer-chat',
				props: { primary: true, secondary: true },
				components: {
					primary: () =>
						import(/* webpackChunkName: "v-customer-service" */ '@views/v-customer-service'),
					secondary: () =>
						import(/* webpackChunkName: "v-customer-chat" */ '@views/v-customer-chat'),
				},
			},
			{
				path: 'customer-online',
				name: 'customer-online',
				props: { primary: true, secondary: true },
				components: {
					primary: () =>
						import(/* webpackChunkName: "v-customer-service" */ '@views/v-customer-service'),
					secondary: () =>
						import(/* webpackChunkName: "v-customer-online" */ '@views/v-customer-online'),
				},
			},
			{
				path: 'customer-offices',
				name: 'customer-offices',
				props: { primary: true, secondary: true },
				components: {
					primary: () =>
						import(/* webpackChunkName: "v-customer-service" */ '@views/v-customer-service'),
					secondary: () =>
						import(/* webpackChunkName: "v-customer-offices" */ '@views/v-customer-offices'),
				},
			},
			{
				path: 'sirvase',
				name: 'sirvase',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () =>
						import(/* webpackChunkName: "v-customer-service" */ '@views/v-customer-service'),
					secondary: () => import(/* webpackChunkName: "v-sirvase" */ '@views/v-sirvase'),
				},
			},
			{
				path: 'sirvase/welcome',
				name: 'sirvase-welcome',
				props: { primary: true, secondary: true },
				components: {
					primary: () =>
						import(/* webpackChunkName: "v-customer-service" */ '@views/v-customer-service'),
					secondary: () =>
						import(/* webpackChunkName: "v-sirvase-welcome" */ '@views/v-sirvase-welcome'),
				},
			},
			{
				path: 'sirvase-dashboard',
				name: 'sirvase-dashboard',
				props: { primary: true, secondary: true },
				components: {
					primary: () =>
						import(/* webpackChunkName: "v-customer-service" */ '@views/v-customer-service'),
					secondary: () =>
						import(/* webpackChunkName: "v-sirvase-dashboard" */ '@views/v-sirvase-dashboard'),
				},
			},
			{
				path: 'sirvase-detail/:requestId',
				name: 'sirvase-detail',
				props: { primary: true, secondary: true },
				components: {
					primary: () =>
						import(/* webpackChunkName: "v-customer-service" */ '@views/v-customer-service'),
					secondary: () =>
						import(/* webpackChunkName: "v-sirvase-detail" */ '@views/v-sirvase-detail'),
				},
			},
			{
				path: 'sirvase-create',
				name: 'sirvase-create',
				props: { primary: true, secondary: true },
				components: {
					primary: () =>
						import(/* webpackChunkName: "v-customer-service" */ '@views/v-customer-service'),
					secondary: () =>
						import(/* webpackChunkName: "v-sirvase-create" */ '@views/v-sirvase-create'),
				},
			},
			{
				path: 'feedback',
				name: 'feedback',
				props: { primary: true },
				meta: { fullPage: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-feedback" */ '@views/v-feedback'),
				},
			},
			{
				path: 'product/:familyId/:productId/movement/:movementId',
				name: 'movement',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () => import(/* webpackChunkName: "v-movement" */ '@views/v-movement'),
				},
			},
			{
				path: 'product/:familyId/:productId/withholdings',
				name: 'withholdings',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () => import(/* webpackChunkName: "v-withholdings" */ '@views/v-withholdings'),
				},
			},
			{
				path: 'product/:familyId/:productId',
				name: 'product',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () => import(/* webpackChunkName: "v-product" */ '@views/v-product'),
				},
			},
			{
				path: 'product/:familyId/:productId/imposition/:movementId',
				name: 'imposition',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () => import(/* webpackChunkName: "v-imposition" */ '@views/v-imposition'),
				},
			},
			{
				path: 'product/:familyId/:productId/asset/:assetId',
				name: 'asset',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () => import(/* webpackChunkName: "v-asset" */ '@views/v-asset'),
				},
			},
			{
				path: 'product/:familyId/:productId/investment-asset/:assetId',
				name: 'investment-asset',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-investment-asset" */ '@views/v-investment-asset'),
				},
			},
			{
				path: 'product/:familyId/:productId/composition/:type/:tab?',
				name: 'composition',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () => import(/* webpackChunkName: "v-composition" */ '@views/v-composition'),
				},
			},
			{
				path: 'product/:familyId/search-movements/:productId/',
				name: 'search-movements',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () => import(/* webpackChunkName: "v-movement" */ '@views/v-search-movements'),
				},
			},
			{
				path: 'product/:familyId/:productId/detail',
				name: 'product-detail',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-product-detail" */ '@views/v-product-detail'),
				},
			},
			{
				path: 'product/:familyId',
				name: 'product-group',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-product-group" */ '@views/v-product-group'),
				},
			},
			{
				path: 'product/:familyId/:productId/profiles',
				name: 'product-profiles',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-product-profiles" */ '@views/v-product-profiles'),
				},
			},
			{
				path: 'premium/:familyId',
				name: 'premium',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () => import(/* webpackChunkName: "v-premium" */ '@views/v-premium'),
				},
			},
			{
				path: 'amortization-table/:productId',
				name: 'amortization-table',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-amortization-table" */ '@views/v-amortization-table'),
				},
			},
			{
				path: 'product/:familyId/:productId/receipts-table',
				name: 'receipts-table',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-receipts-table" */ '@views/v-receipts-table'),
				},
			},
			{
				path: 'personal-area',
				name: 'personal-area',
				props: { primary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-personal-area" */ '@views/v-personal-area'),
				},
			},
			{
				path: 'personal-area/personal-details',
				name: 'personal-details',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-personal-area" */ '@views/v-personal-area'),
					secondary: () =>
						import(/* webpackChunkName: "v-personal-details" */ '@views/v-personal-details'),
				},
			},
			{
				path: 'change-password',
				name: 'change-password',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-personal-area" */ '@views/v-personal-area'),
					secondary: () =>
						import(/* webpackChunkName: "v-change-password" */ '@views/v-change-password'),
				},
			},
			{
				path: 'language',
				name: 'language',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-personal-area" */ '@views/v-personal-area'),
					secondary: () => import(/* webpackChunkName: "v-language" */ '@views/v-language'),
				},
			},
			{
				path: 'transfers',
				name: 'transfers',
				props: { primary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
				},
			},
			{
				path: 'transfer/:action/:type?/:transferId?',
				name: 'transfer',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () => import(/* webpackChunkName: "v-transfer" */ '@views/v-transfer'),
				},
			},
			{
				path: 'founds/:action',
				name: 'founds',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () => import(/* webpackChunkName: "v-add-founds" */ '@views/v-add-founds'),
				},
			},
			{
				path: 'my-transfers/:productId',
				name: 'my-transfers',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () => import(/* webpackChunkName: "v-my-transfers" */ '@views/v-my-transfers'),
				},
			},
			{
				path: 'transfer-detail/:type/:transferId',
				name: 'transfer-detail',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(/* webpackChunkName: "v-transfer-detail" */ '@views/v-transfer-detail'),
				},
			},
			{
				path: 'bizum',
				name: 'bizum',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () => import(/* webpackChunkName: "v-bizum" */ '@views/v-bizum'),
				},
			},
			{
				path: 'bizum/welcome',
				name: 'bizum-welcome',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(/* webpackChunkName: "v-bizum-welcome" */ '@views/v-bizum-welcome'),
				},
			},
			{
				path: 'bizum/register/:productId',
				name: 'bizum-register',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(/* webpackChunkName: "v-bizum-register" */ '@views/v-bizum-register'),
				},
			},
			{
				path: 'bizum/settings',
				name: 'bizum-settings',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(/* webpackChunkName: "v-bizum-settings" */ '@views/v-bizum-settings'),
				},
			},
			{
				path: 'bizum/dashboard/:type?',
				name: 'bizum-dashboard',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(/* webpackChunkName: "v-bizum-dashboard" */ '@views/v-bizum-dashboard'),
				},
			},
			{
				path: 'bizum/details',
				name: 'bizum-details',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(/* webpackChunkName: "v-bizum-details" */ '@views/v-bizum-details'),
				},
			},
			{
				path: 'bizum/help',
				name: 'bizum-help',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () => import(/* webpackChunkName: "v-bizum-help" */ '@views/v-bizum-help'),
				},
			},
			{
				path: 'bizum/selae',
				name: 'bizum-selae',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () => import(/* webpackChunkName: "v-bizum-selae" */ '@views/v-bizum-selae'),
				},
			},
			{
				path: 'bizum/selae-detail',
				name: 'bizum-selae-detail',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(/* webpackChunkName: "v-bizum-selae-detail" */ '@views/v-bizum-selae-detail'),
				},
			},
			{
				path: 'bizum/unregister',
				name: 'bizum-unregister',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(/* webpackChunkName: "v-bizum-unregister" */ '@views/v-bizum-unregister'),
				},
			},
			{
				path: 'bizum/movement/:movementId',
				name: 'bizum-movement',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(/* webpackChunkName: "v-bizum-movement" */ '@views/v-bizum-movement'),
				},
			},
			{
				path: 'bizum/transfer/:action/:movementId?',
				name: 'bizum-transfer',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(/* webpackChunkName: "v-bizum-transfer" */ '@views/v-bizum-transfer'),
				},
				children: [
					{
						path: 'contacts',
						name: 'bizum-contacts',
						props: true,
						component: () =>
							import(/* webpackChunkName: "v-bizum-contacts" */ '@views/v-bizum-contacts'),
					},
					{
						path: 'ongs',
						name: 'bizum-ongs',
						props: true,
						component: () => import(/* webpackChunkName: "v-bizum-ongs" */ '@views/v-bizum-ongs'),
					},
				],
			},
			{
				path: 'communications/:type?',
				name: 'communications',
				props: { primary: true, secondary: true },
				components: {
					primary: () =>
						import(/* webpackChunkName: "v-communications" */ '@views/v-communications'),
				},
			},
			{
				path: 'communications/:type/:messageId',
				name: 'communication-detail',
				props: { primary: true, secondary: true },
				components: {
					primary: () =>
						import(/* webpackChunkName: "v-communications" */ '@views/v-communications'),
					secondary: () =>
						import(
							/* webpackChunkName: "v-communication-detail" */ '@views/v-communication-detail'
						),
				},
			},
			{
				path: 'signatures/:type?',
				name: 'signatures',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () => import(/* webpackChunkName: "v-signatures" */ '@views/v-signatures'),
				},
			},
			{
				path: 'signatures/:type/:signatureId',
				name: 'signature-detail',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-signature-detail" */ '@views/v-signature-detail'),
				},
			},
			{
				path: 'correos-cash-dashboard',
				name: 'correos-cash-dashboard',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(
							/* webpackChunkName: "v-correos-cash-dashboard" */ '@views/v-correos-cash-dashboard'
						),
				},
			},
			{
				path: 'correos-cash-deposit',
				name: 'correos-cash-deposit',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(
							/* webpackChunkName: "v-correos-cash-deposit" */ '@views/v-correos-cash-deposit'
						),
				},
			},
			{
				path: 'correos-cash-detail/:depositId?/:qrId?',
				name: 'correos-cash-detail',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(/* webpackChunkName: "v-correos-cash-detail" */ '@views/v-correos-cash-detail'),
				},
			},
			{
				path: 'correos-cash/qr/:depositId/:qrId',
				name: 'correos-cash-qr',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-transfers" */ '@views/v-transfers'),
					secondary: () =>
						import(/* webpackChunkName: "v-correos-cash-qr" */ '@views/v-correos-cash-qr'),
				},
			},
			{
				path: 'profiles',
				name: 'profiles',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () => import(/* webpackChunkName: "v-profiles" */ '@views/v-profiles'),
				},
			},
			{
				path: 'profiles/dashboard',
				name: 'profiles-dashboard',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-profiles-dashboard" */ '@views/v-profiles-dashboard'),
				},
			},
			{
				path: 'profiles/welcome',
				name: 'profiles-welcome',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-profiles-welcome" */ '@views/v-profiles-welcome'),
				},
			},
			{
				path: 'profiles/create/:profileId?',
				name: 'profiles-create',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-profiles-create" */ '@views/v-profiles-create'),
				},
			},
			{
				path: 'ontime',
				name: 'ontime',
				props: { primary: true, secondary: true },
				meta: { transition: 'fade' },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () => import(/* webpackChunkName: "v-ontime" */ '@views/v-ontime'),
				},
			},
			{
				path: 'ontime/dashboard',
				name: 'ontime-dashboard',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-ontime-dashboard" */ '@views/v-ontime-dashboard'),
				},
			},
			{
				path: 'ontime/welcome',
				name: 'ontime-welcome',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-ontime-welcome" */ '@views/v-ontime-welcome'),
				},
			},
			{
				path: 'ontime/create',
				name: 'ontime-create',
				props: { primary: true, secondary: true },
				components: {
					primary: () => import(/* webpackChunkName: "v-global" */ '@views/v-global'),
					secondary: () =>
						import(/* webpackChunkName: "v-ontime-create" */ '@views/v-ontime-create'),
				},
			},
		],
	},
];
