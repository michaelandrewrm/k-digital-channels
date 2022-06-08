import SessionCache from '@modules/session/session-cache';

describe('session-cache', () => {
	let cache;

	beforeEach(() => {
		cache = new SessionCache('test');
	});

	it('sets a cache item', () => {
		expect(cache.get('yellow')).toBeFalsy();
		expect(cache.has('yellow')).toBeFalsy();

		cache.set('yellow', true);

		expect(cache.get('yellow')).toBeTruthy();
		expect(cache.has('yellow')).toBeTruthy();
	});

	it('clears a cache item', () => {
		cache.set('yellow', true);
		cache.set('blue', true);

		expect(cache.has('yellow')).toBeTruthy();
		expect(cache.has('blue')).toBeTruthy();

		cache.clear('yellow');

		expect(cache.has('yellow')).toBeFalsy();
		expect(cache.has('blue')).toBeTruthy();
	});

	it('clears a session cache', () => {
		cache.set('yellow', true);
		cache.set('blue', true);

		expect(cache.has('yellow')).toBeTruthy();
		expect(cache.has('blue')).toBeTruthy();

		cache.clear();

		expect(cache.has('yellow')).toBeFalsy();
		expect(cache.has('blue')).toBeFalsy();
	});

	it('clears a session cache from static class', () => {
		const cacheTwo = new SessionCache('prueba2');

		cache.set('yellow', true);
		cache.set('blue', true);

		cacheTwo.set('red', true);
		cacheTwo.set('pink', true);

		expect(cache.has('yellow')).toBeTruthy();
		expect(cache.has('blue')).toBeTruthy();
		expect(cacheTwo.has('red')).toBeTruthy();
		expect(cacheTwo.has('pink')).toBeTruthy();

		SessionCache.clear('test');

		expect(cache.has('yellow')).toBeFalsy();
		expect(cache.has('blue')).toBeFalsy();
		expect(cacheTwo.has('red')).toBeTruthy();
		expect(cacheTwo.has('pink')).toBeTruthy();
	});

	it('clears a all cache from static class', () => {
		const cacheTwo = new SessionCache('prueba2');

		cache.set('yellow', true);
		cache.set('blue', true);

		cacheTwo.set('red', true);
		cacheTwo.set('pink', true);

		expect(cache.has('yellow')).toBeTruthy();
		expect(cache.has('blue')).toBeTruthy();
		expect(cacheTwo.has('red')).toBeTruthy();
		expect(cacheTwo.has('pink')).toBeTruthy();

		SessionCache.clear();

		expect(cache.has('yellow')).toBeFalsy();
		expect(cache.has('blue')).toBeFalsy();
		expect(cacheTwo.has('red')).toBeFalsy();
		expect(cacheTwo.has('pink')).toBeFalsy();
	});

	it('distinguish cache paths', () => {
		const cacheOne = new SessionCache('my-cache/test-1');
		cacheOne.set('yellow/pink', true);
		cacheOne.set('yellow/blue', true);

		const cacheTwo = new SessionCache('my-cache/test-2');
		cacheTwo.set('yellow/red', true);
		cacheTwo.set('yellow/green', true);

		cacheOne.clear('yellow');

		expect(cacheOne.has('yellow/pink')).toBeFalsy();
		expect(cacheOne.has('yellow/blue')).toBeFalsy();
		expect(cacheTwo.has('yellow/red')).toBeTruthy();
		expect(cacheTwo.has('yellow/green')).toBeTruthy();

		SessionCache.clear('my-cache');

		expect(cacheTwo.has('yellow/red')).toBeFalsy();
		expect(cacheTwo.has('yellow/green')).toBeFalsy();
	});
});
