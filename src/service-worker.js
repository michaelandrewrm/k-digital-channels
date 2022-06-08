/* eslint-disable */
/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 */

import { setCacheNameDetails } from 'workbox-core/setCacheNameDetails.mjs';
import { registerRoute } from 'workbox-routing/registerRoute.mjs';
import { CacheFirst } from 'workbox-strategies/CacheFirst.mjs';
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute.mjs';

setCacheNameDetails({ prefix: 'vuesoma' });

self.addEventListener('message', ({ data }) => {
	if (data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

self.addEventListener('activate', function() {
	self.clients.claim();
});

self.addEventListener('install', async function() {
	const cache = await caches.open('vuesoma-version');
	const version = new URL(self.location).searchParams.get('version');

	await cache.put(new Request('version'), new Response(version));
});

precacheAndRoute(['_offline.html']);

registerRoute(
	({ event }) => event.request.mode === 'navigate',
	({ url }) => fetch(url.href).catch(() => caches.match('/_offline.html'))
);

self.__precacheManifest = [].concat(self.__precacheManifest || []);

self.__precacheManifest.forEach((url) => registerRoute(url, new CacheFirst()));
