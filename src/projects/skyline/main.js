import Vue from 'vue';
import i18n from '@locales/setup';
import store from '@store';
import Modules from '@plugins/modules';
import ProductNumber from '@plugins/productNumber';
import { makeServer, makeServerForCypress } from '@plugins/server';
import router from './router';
import App from './app.vue';
import '@directives';

Vue.config.productionTip = process.env.NODE_ENV === 'production';

Vue.use(Modules);
Vue.use(ProductNumber);

// If running inside Cypress...
if (window.Cypress) {
	// Ensure tests fail when Vue emits an error.
	Vue.config.errorHandler = window.Cypress.cy.onUncaughtException;

	makeServerForCypress();
} else if (process.env.VUE_APP_ENDPOINT_MODE === 'mck') {
	makeServer();
}

const instance = new Vue({
	i18n,
	router,
	store,
	render: (h) => h(App),
	beforeCreate() {
		if (window?.name === 'skyline') {
			this.$store.dispatch('authn/setIsEmbedded');
		}
	},
	created() {
		window.addEventListener('message', ({ data, source, origin, ports }) => {
			if (data?.name === 'bridge-store-dispatch') {
				return this.$store
					.dispatch(data.action, data.payload)
					.then((response) => {
						const message = {
							name: 'bridge-store-response',
							request: { action: data.action, payload: data.payload },
							response: JSON.parse(JSON.stringify(response)),
						};

						return message;
					})
					.catch((error) => {
						const message = {
							name: 'bridge-store-error',
							request: { action: data.action, payload: data.payload },
							response: error,
						};

						return message;
					})
					.then((message) => {
						ports?.[0]?.postMessage(message);
						window.postMessage(message, '*');
					});
			}

			if (data?.name === 'bridge-network-request') {
				return this.$store
					.dispatch('service/request', data.payload)
					.then(({ data: response }) => {
						const message = {
							name: 'bridge-network-response',
							request: data.payload,
							response: JSON.parse(JSON.stringify(response)),
						};

						return message;
					})
					.catch(({ response }) => {
						const message = {
							name: 'bridge-network-error',
							request: data.payload,
							response: JSON.parse(JSON.stringify(response)),
						};

						return message;
					})
					.then((message) => {
						ports?.[0]?.postMessage(message);
						window.postMessage(message, '*');
					});
			}

			if (data?.name === 'create-session') {
				return this.$store.dispatch('authn/createUserSession', { data, source, origin });
			}

			if (data?.name === 'new-update') {
				const userUUID = this.$store.state.secure.uuid;

				if (window.parent) {
					window.parent.postMessage({ name: 'reload', userUUID }, '*');
				}
			}

			if (data?.name === 'request-access') {
				return this.$store.dispatch('authn/authorizeAccess', { data, source, origin }).then(() => {
					window.dispatchEvent(new Event('ready-for-action'));
					return this.$router.push({ name: 'home' });
				});
			}

			if (data?.name === 'get-notification-mode') {
				return this.$store.dispatch('user/getNotificationMode', { data, source, origin });
			}

			if (data?.name === 'change-notification-mode') {
				return this.$store.dispatch('user/changeNotificationMode', { data, source, origin });
			}

			if (data?.name === 'request-option') {
				return this.$store.dispatch('user/requestOption', { data, source, origin });
			}

			if (data?.name === 'sirvase-request') {
				const params = data.payload;
				return this.$store.dispatch('user/getSirvaseRequests', {
					data,
					source,
					origin,
					...params,
				});
			}
		});

		if (window.parent) {
			window.parent.postMessage({ name: 'vuesoma-is-ready' }, '*');
		}

		window.postMessage({ name: 'vuesoma-is-ready' }, '*');
	},
}).$mount('#vuesoma');

window.__app__ = instance; // eslint-disable-line no-underscore-dangle
