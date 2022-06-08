/* eslint-disable no-underscore-dangle */

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import i18nExtended from '@plugins/i18nExtended';
import numberFormats from '@locales/setup/numberFormats';
import dateTimeFormats from '@locales/setup/dateTimeFormats';

Vue.use(VueI18n);
Vue.use(i18nExtended);

export const fallbackLocale = 'es';

// Hack to separate thounsands from the third character instead of the fourth.
// Example:
// $n(1234, 'EUR') in spanish is 1234 €
// $n(1234, 'EUR') in catalan is 1.234 €
// So, numbers in Catalan will be preferred in spanish.

const patch = function patch(fn) {
	return function patchedFn(value, locale, key, options) {
		if (key) {
			return fn.call(this, value, locale, key, options);
		}
		return fn.call(this, value, locale === 'es' ? 'ca' : locale, key, options);
	};
};

VueI18n.prototype._n = patch(VueI18n.prototype._n);
VueI18n.prototype._ntp = patch(VueI18n.prototype._ntp);

const i18n = new VueI18n({
	fallbackLocale,
	preserveDirectiveContent: true,
	numberFormats,
	dateTimeFormats,
});

export const loadedLanguages = new Set();

const setI18nLanguage = (lang) => {
	i18n.locale = lang;
	document.querySelector('html').setAttribute('lang', lang);
	return lang;
};

export const importLocale = (lang) => {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve) => {
		// if lang is currently setted
		if (i18n.locale === lang) {
			return resolve(lang);
		}

		// if lang is not setted but loaded
		if (loadedLanguages.has(lang)) {
			setI18nLanguage(lang);
			return resolve(lang);
		}

		// load lang
		const msgs = await import(
			/* webpackChunkName: 'locale-[request]' */
			`@locales/${lang}`
		);

		try {
			// try loading project lang
			const localLocale = await import(
				/* webpackChunkName: 'local-locale-[request]' */
				`@local-locales/${lang}`
			);

			Object.assign(msgs.default, localLocale.default);
		} catch (err) {
			/* eslint-disable-line */
		}

		i18n.setLocaleMessage(lang, msgs.default);
		loadedLanguages.add(lang);

		setI18nLanguage(lang);
		return resolve(lang);
	});
};

export default i18n;
