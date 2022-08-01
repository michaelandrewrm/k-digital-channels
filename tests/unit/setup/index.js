import window from '@tests/setup/__mocks__/window';
import document from '@tests/setup/__mocks__/document';
import * as clipboard from '@tests/setup/__mocks__/clipboard-polyfill';
import Vue from 'vue';
import Intl from 'intl';
import 'intl/locale-data/jsonp/ca';
import 'intl/locale-data/jsonp/es';

import { createLocalVue, config } from '@vue/test-utils';
import projectLocale from '@local-locales/es.json';
import skylineLocale from '@locales/es.json';
import assistedLocale from '@assisted/locales/es.json';
import dateLocale from '@locales/setup/dateTimeFormats';
import numberFormats from '@locales/setup/numberFormats';
import i18nExtended from '@plugins/i18nExtended';
import ProductNumber from '@plugins/productNumber';

import Vuex from 'vuex';
import VueRouter from 'vue-router';
import ModulesPlugin from '@plugins/modules';
import assistedModules from '@assisted/store';
import skylineModules from '@store/modules';
import routes from '@local-router/routes';
import a11yHide from '@/directives/a11y-hide';
import a11yTel from '@/directives/a11y-tel';

// Create a local instance of vue.
Vue.config.productionTip = false;

const createPristineVue = () => {
	const localVue = createLocalVue();

	localVue.use(Vuex);
	localVue.use(VueRouter);
	localVue.use(ModulesPlugin);
	localVue.use(i18nExtended);
	localVue.use(ProductNumber);

	localVue.directive('a11y-hide', a11yHide);
	localVue.directive('a11y-tel', a11yTel);

	const modules = {
		...skylineModules,
		...assistedModules,
	};
	return {
		get shallowStore() {
			const store = new Vuex.Store({ strict: false });

			store.mockedActions = {};

			store.mockModule = function(name, actions) {
				if (this.hasModule(name)) {
					this.unregisterModule(name);
				}

				this.registerModule(name, { namespaced: true, actions });

				Object.entries(actions).forEach(([key, value]) => {
					Object.assign(store.mockedActions, { [`${name}/${key}`]: value });
				});
			};

			store.mockCommit = function(property) {
				return function(internalStore, value) {
					Object.assign(internalStore.state, { [property]: value });
				};
			};

			return store;
		},

		get localStore() {
			const store = new Vuex.Store({ strict: false });
			// ? Registramos los módulos de manera dinámica para
			// ? poder desregistrarlos desde los tests.
			Object.entries(modules).forEach(([key, mod]) => {
				store.registerModule(key, mod);
			});

			return store;
		},

		get shallowRouter() {
			return new VueRouter({ mode: 'abstract' });
		},

		get localRouter() {
			return new VueRouter({ mode: 'abstract', routes });
		},

		localVue,
	};
};

// Globals to be used across the tests:
global.window = window;
global.document = document;
global.createPristineVue = createPristineVue;
global.clipboard = clipboard;

config.stubs = { 'c-icon': true };

const locale = {
	...projectLocale,
	...skylineLocale,
	...assistedLocale,
};

const paramReplacer = (obj, text = '') => {
	let result = text;

	if (text.includes('@:')) {
		result = result.replace(/(?<=[@:])\w+/g, (match) => locale[match]);
		result = result.replace(/[^\w]*/, '');
	}

	Object.keys(obj).forEach((key) => {
		result = result.replace(`{${key}}`, obj[key] || '');
	});

	return result;
};

config.mocks.$t = (msg, param = {}) => paramReplacer(param, locale[msg]);
config.mocks.$tc = (msg, x = 1, param = {}) => {
	const text = locale[msg].split(' | ');
	const result = x > 1 ? text[text.length - 1] : text[0];
	return paramReplacer(param, result);
};
config.mocks.$n = (number, id) => {
	const currencyId = id?.currency ?? 'EUR';
	const isEUR = currencyId === 'EUR';
	const countryCode = isEUR ? 'ca-ES' : 'en-US';

	return new Intl.NumberFormat(
		countryCode,
		typeof id === 'string' ? numberFormats.es[id] : id || {}
	).format(number);
};
config.mocks.$d = (date, type) => {
	const options = dateLocale.es[type] || {};
	return new Intl.DateTimeFormat('es', options).format(date);
};
