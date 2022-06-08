import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-linea-caminos.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-linea-caminos.vue', () => {
	let wp;
	let store;
	let router;

	const url =
		'https://integracion.grupocaminos.es/uniscripts/mgrqispi.dll?APPNAME=eFIDES&PRGNAME=PostMessage';

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;
	});

	it('has a name equal to v-linea-caminos', () => {
		const ssoLogin = jest.fn().mockRejectedValue();
		const open = jest.fn().mockResolvedValue();

		store.mockModule('user', { ssoLogin });
		store.mockModule('modal', { open });

		wp = shallowMount(Component, { localVue, store, router });

		expect(wp.vm.$options.name).toBe('v-linea-caminos');
	});

	it('should open the iframe and set sso session on it', async () => {
		const fixture = { data: { sessionId: 'ab21zxc=', cookie: 'a1' } };
		const ssoLogin = jest.fn().mockResolvedValue(fixture);
		const open = jest.fn().mockResolvedValue();

		store.mockModule('user', { ssoLogin });
		store.mockModule('modal', { open });

		global.navigator.vendor = 'Google Inc.';

		wp = shallowMount(Component, { localVue, store, router });
		await flushPromises();

		const iframe = wp.findComponent({ ref: 'iframe' });

		expect(iframe.exists()).toBeTruthy();
		expect(iframe.attributes('src')).toBe(url);

		const postMessage = jest.fn();
		jest.spyOn(iframe.element, 'contentWindow', 'get').mockReturnValue({ postMessage });

		iframe.element.dispatchEvent(new Event('load'));

		expect(postMessage).toHaveBeenCalledWith(
			expect.objectContaining({ sessionID: 'ab21zxc=', cookie: 'a1' }),
			'*'
		);

		// el iframe aún no es visible
		expect(iframe.element).not.toHaveClass('--is-active');

		jest.useRealTimers();
		iframe.element.ownerDocument.defaultView.postMessage({ status: 'ready' }, '*');
		await new Promise((resolve) => setTimeout(resolve, 0));
		jest.useFakeTimers();

		// el iframe ahora es visible
		expect(iframe.element).toHaveClass('--is-active');

		wp.destroy();
	});

	it('should open a modal error when service sso fails', async () => {
		const ssoLogin = jest.fn().mockRejectedValue();
		const open = jest.fn().mockResolvedValue();

		store.mockModule('user', { ssoLogin });
		store.mockModule('modal', { open });

		global.navigator.vendor = 'Google Inc.';

		wp = shallowMount(Component, { localVue, store, router });
		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-something-wrong' })
		);
	});

	it('should open a new window and set sso session on it only in safari', async () => {
		const fixture = { data: { sessionId: 'ab21zxc=', cookie: 'a1' } };
		const ssoLogin = jest.fn().mockResolvedValue(fixture);
		const open = jest.fn().mockResolvedValue(true);

		store.mockModule('user', { ssoLogin });
		store.mockModule('modal', { open });

		global.navigator.vendor = 'Apple Computer, Inc.';

		const winOpen = jest.spyOn(window, 'open');

		wp = shallowMount(Component, { localVue, store, router });
		await flushPromises();

		expect(wp.findComponent({ ref: 'iframe' }).exists()).toBeFalsy();

		expect(winOpen).toHaveBeenCalledWith(url, expect.any(String));
		winOpen.mockClear();
	});

	it('should not open a new window and set sso session on it in safari if user dont accept', async () => {
		const fixture = { data: { sessionId: 'ab21zxc=', cookie: 'a1' } };
		const ssoLogin = jest.fn().mockResolvedValue(fixture);
		const open = jest.fn().mockResolvedValue(false);

		store.mockModule('user', { ssoLogin });
		store.mockModule('modal', { open });

		global.navigator.vendor = 'Apple Computer, Inc.';

		const winOpen = jest.spyOn(window, 'open');

		wp = shallowMount(Component, { localVue, store, router });
		await flushPromises();

		expect(wp.findComponent({ ref: 'iframe' }).exists()).toBeFalsy();

		expect(winOpen).not.toHaveBeenCalled();
		winOpen.mockClear();
	});

	it('should open a modal error on timeout', async () => {
		const fixture = { data: { sessionId: 'ab21zxc=', cookie: 'a1' } };
		const ssoLogin = jest.fn().mockResolvedValue(fixture);
		const open = jest.fn().mockResolvedValue(true);

		store.mockModule('user', { ssoLogin });
		store.mockModule('modal', { open });

		global.navigator.vendor = 'Google Inc.';

		wp = shallowMount(Component, { localVue, store, router });
		await flushPromises();

		const iframe = wp.findComponent({ ref: 'iframe' });

		expect(iframe.exists()).toBeTruthy();

		const postMessage = jest.fn();
		jest.spyOn(iframe.element, 'contentWindow', 'get').mockReturnValue({ postMessage });

		iframe.element.dispatchEvent(new Event('load'));

		jest.runAllTimers();

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-something-wrong' })
		);
	});
});
