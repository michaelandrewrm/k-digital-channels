import authn from '@skyline/store/modules/authn/m-authn';

const { env } = window.VUE_APP_CONFIG;
const PROD_MODE = env === 'prd';

export default {
	app: {
		namespaced: true,

		state: {
			companyId: 'BC',
			onboardingUrl:
				'https://onboarding-caminos.grupocaminos.es/?utm_source=bco&utm_medium=haztecliente&utm_campaign=cuenta_transparente_bco&utm_term=CCWN4B',
			telephone: '+34 913 109 550',
			whatsapp: '+34 628 500 200',
			email: 'cat@bancocaminos.es',
			cookiesDetail: 'https://www.bancocaminos.es/politica-de-cookies',
			measurementId: 'G-DG08H76NXM',
			legalIdentity:
				'Banco Caminos, S.A. Reg. Mercantil Madrid, T.23454, F.173, S.8, H.M-81730, inscripción 95, Código B.E. 0234, N.I.F: A28520666',
			liveagent: PROD_MODE
				? {
						deployment: 'c.la3-c2-fra',
						deploymentId: '57209000000kc42',
						orgId: '00D09000007T9DK',
						chatURL: 'https://d.la3-c2-fra.salesforceliveagent.com/chat',
						buttonId: '57309000000kckm',
				  }
				: {
						deployment: 'c.la2-c1cs-fra',
						deploymentId: '5729E000000CbNM',
						orgId: '00D9E0000004n9D',
						chatURL: 'https://d.la2-c1cs-fra.salesforceliveagent.com/chat',
						buttonId: '5739E0000008QB8',
				  },
		},
	},
	authn,
};
