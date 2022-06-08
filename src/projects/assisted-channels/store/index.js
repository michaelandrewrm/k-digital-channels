import agent from './modules/agent/m-agent';

export default {
	app: {
		namespaced: true,

		state: {
			telephone: '+34 913 10 95 50',
			email: 'cat@bancocaminos.es',
		},
	},

	agent,
};
