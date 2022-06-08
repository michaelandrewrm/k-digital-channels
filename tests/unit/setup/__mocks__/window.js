import crypto from './crypto';

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

Object.defineProperty(window, 'requestAnimationFrame', {
	writable: true,
	value: (cb) => cb(),
});

Object.defineProperty(window, 'getComputedStyle', {
	value: jest.fn(() => ({
		getPropertyValue: jest.fn(),
	})),
});

Object.defineProperty(window, 'crypto', {
	value: crypto,
});

Object.defineProperty(window, 'VUE_APP_CONFIG', {
	value: {
		endpoint: '',
		env: '',
		version: '',
		videoIdUrl: '',
	},
});

Object.defineProperty(window, 'IntersectionObserver', {
	value: jest.fn((callback) => {
		let observing = false;

		return {
			disconnect: jest.fn().mockImplementation(() => {
				observing = false;
			}),
			observe: jest.fn().mockImplementation(() => {
				observing = true;
			}),
			takeRecords: jest.fn(),
			unobserve: jest.fn().mockImplementation(() => {
				observing = false;
			}),

			trigger: ({ target, intersect = true }) => {
				if (target && observing) {
					callback([
						{
							target,
							isIntersecting: intersect,
						},
					]);
				}
			},
		};
	}),
});

Object.defineProperty(window, 'ResizeObserver', {
	value: jest.fn((callback) => {
		return {
			disconnect: jest.fn(),
			observe: jest.fn().mockImplementation(callback),
			unobserve: jest.fn(),
		};
	}),
});

Object.defineProperty(window, 'open', {
	value: jest.fn(() => {
		return {
			listeners: [],
			closed: false,
			close: jest.fn(),
			blur: jest.fn(),
			focus: jest.fn(),
			opener: null,
			postMessage: jest.fn(),
			location: { replace: jest.fn() },
		};
	}),
});

Object.defineProperties(window.navigator, {
	vendor: ((value) => ({
		get() {
			return value;
		},
		set(v) {
			// eslint-disable-next-line no-param-reassign
			value = v;
		},
	}))(window.navigator.vendor),

	userAgent: ((value) => ({
		get() {
			return value;
		},
		set(v) {
			// eslint-disable-next-line no-param-reassign
			value = v;
		},
	}))(window.navigator.userAgent),

	share: ((value) => ({
		get() {
			return value;
		},
		set(v) {
			// eslint-disable-next-line no-param-reassign
			value = v;
		},
	}))(window.navigator.share),
});

Object.defineProperty(window, 'MessageChannel', {
	value: jest.fn(() => {
		let port1Callback;
		let port2Callback;

		return {
			port1: {
				postMessage: jest.fn().mockImplementation((data) => {
					port2Callback?.({ data });
				}),
				get onmessage() {
					return port1Callback;
				},
				set onmessage(cb) {
					port1Callback = cb;
				},
				close: jest.fn(),
			},
			port2: {
				postMessage: jest.fn().mockImplementation((data) => {
					port1Callback?.({ data });
				}),
				get onmessage() {
					return port2Callback;
				},
				set onmessage(cb) {
					port2Callback = cb;
				},
				close: jest.fn(),
			},
		};
	}),
});

window.MessagePort = require('worker_threads').MessagePort;

Object.defineProperties(window.URL, {
	createObjectURL: {
		value: jest.fn().mockImplementation(() => 'http://0'),
	},
	revokeObjectURL: {
		value: jest.fn(),
	},
});

export default window;
