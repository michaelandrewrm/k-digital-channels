import { register } from '@/registerServiceWorker';

export default () => {
	if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_ENDPOINT_MODE !== 'mck') {
		const { log } = console;
		/**
		 * Change service worker settings on vue.config.js
		 */
		register(`${process.env.BASE_URL}service-worker.js?version=${window.VUE_APP_CONFIG.version}`, {
			/**
			 * App is being served from cache by a service worker.
			 * For more details, visit https://goo.gl/AFskqB
			 */
			ready() {
				log('SERVICE WORKER IS READY');
			},

			/**
			 * Service worker has been registered.
			 * @param {Object} registration Service Worker registration
			 */
			registered() {
				log('SERVICE WORKER REGISTERED');
			},

			/**
			 * Content has been cached for offline use.
			 * @param {Object} registration Service Worker registration
			 */
			cached() {
				log('FILES ON SERVICE WORKER ARE CACHED');
			},

			/**
			 * New content is downloading.
			 * @param {Object} registration Service Worker registration
			 */
			updatefound() {
				log('SERVICE WORKER FOUND AN UPDATE');

				window.postMessage({ name: 'new-update' }, '*');
			},

			/**
			 * New content is available; please refresh.
			 * @param {Object} registration Service Worker registration
			 */
			updated(registration) {
				if (registration.waiting) {
					registration.waiting.postMessage({ type: 'SKIP_WAITING' });
				}

				log('SERVICE WORKER UPDATED');
			},

			controllerchange() {
				log('CONTROLLER CHANGE');

				window.location.reload();
			},

			/**
			 * No internet connection found. App is running in offline mode.
			 */
			offline() {
				log('OFFLINE');
			},

			/**
			 * Error during service worker registration.
			 * @param {Object} error
			 */
			error(err) {
				log('SERVICE WORKER ERROR', err);
			},
		});
	}
};
