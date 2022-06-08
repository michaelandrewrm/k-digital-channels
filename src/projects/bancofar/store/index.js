import authn from '@skyline/store/modules/authn/m-authn';

const { env } = window.VUE_APP_CONFIG;
const PROD_MODE = env === 'prd';

export default {
	app: {
		namespaced: true,

		state: {
			companyId: 'BF',
			onboardingUrl: 'https://www.onboardingbancofar.com',
			telephone: '+34 900 101 817',
			whatsapp: '+34 682 101 050',
			email: 'cat@bancofar.es',
			cookiesDetail: 'https://www.bancofar.es/politica-de-cookies',
			measurementId: 'G-5EMS09R07M',
			legalIdentity:
				'BANCOFAR, S.A. Reg. Mercantil Madrid, T.10876, F.1, S.8, H.M-171685, inscripción 1 y 2, Código B.E. 0125, N.I.F: A45002599',
			liveagent: PROD_MODE
				? {
						deployment: 'c.la3-c2-fra',
						deploymentId: '57209000000kc41',
						orgId: '00D09000007T9DK',
						chatURL: 'https://d.la3-c2-fra.salesforceliveagent.com/chat',
						buttonId: '57309000000kcko',
				  }
				: {
						deployment: 'c.la2-c1cs-fra',
						deploymentId: '5729E000000CbNL',
						orgId: '00D9E0000004n9D',
						chatURL: 'https://d.la2-c1cs-fra.salesforceliveagent.com/chat',
						buttonId: '5739E0000008QBA',
				  },
		},
	},
	authn,
};
