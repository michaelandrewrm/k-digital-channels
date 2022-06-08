let client = null;

export default {
	namespaced: true,

	actions: {
		install({ rootState }, instance) {
			client = instance;
			/* istanbul ignore else */
			if (rootState.device.id) {
				client.setUser(rootState.device.id);
			}

			client.addMetadata('app', {
				companyId: rootState?.app?.companyId,
				isEmbedded: rootState?.authn?.isEmbedded,
				isHybrid: navigator.userAgent.includes('Skybrid'),
			});
		},

		log(store, { title, type, ...data }) {
			/* istanbul ignore else */
			if (client) {
				client.leaveBreadcrumb(title, data, type);
			}
		},

		/* istanbul ignore next */
		notify(store, e) {
			if (client) {
				client.notify(e);
			}
		},

		/* istanbul ignore next */
		setUser(store, id) {
			if (client) {
				client.user = { id };
			}
		},
	},
};
