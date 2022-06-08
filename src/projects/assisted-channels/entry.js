import Vue from 'vue';
import i18n from '@locales/setup';
import store from '@store';
import bugsnagClient from '@plugins/bugsnag';
import Modules from '@plugins/modules';
import { makeServer, makeServerForCypress } from '@plugins/server';
import router from './router';
import App from './app.vue';
import '@directives';

if (process.env.VUE_APP_ENDPOINT_MODE === 'mck') {
	makeServer();
}

Vue.config.productionTip = process.env.NODE_ENV === 'production';

Vue.use(Modules);

// If running inside Cypress...
if (window.Cypress) {
	// Ensure tests fail when Vue emits an error.
	Vue.config.errorHandler = window.Cypress.cy.onUncaughtException;

	makeServerForCypress();
}

const instance = new Vue({
	i18n,
	router,
	store,
	render: (h) => h(App),
	created() {
		this.$store.dispatch('bugsnag/install', bugsnagClient);
	},
}).$mount('#vuesoma');

window.__app__ = instance; // eslint-disable-line no-underscore-dangle
