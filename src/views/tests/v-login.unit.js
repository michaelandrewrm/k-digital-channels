import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-login.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-login.vue', () => {
	let wp;
	let store;
	let router;

	const actions = {};

	const getAnnouncements = jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);
	const open = jest.fn().mockResolvedValue(true);
	const setNewsId = jest.fn().mockResolvedValue(true);
	const loginAnonymous = jest.fn().mockResolvedValue();

	beforeEach(() => {
		const { shallowStore, shallowRouter } = newInstance;

		store = shallowStore;
		router = shallowRouter;

		store.mockModule('communications', { getAnnouncements });
		store.mockModule('modal', { open });
		store.mockModule('session', { setNewsId });
		store.registerModule('authn', {
			namespaced: true,
			state: { isEmbedded: false },
			actions: { loginAnonymous },
		});

		Object.assign(actions, { getAnnouncements, open, setNewsId });

		wp = shallowMount(Component, { localVue, store, router });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-login', () => {
		expect(wp.vm.$options.name).toBe('v-login');
	});

	it('should show slides if there are slides to show', async () => {
		await flushPromises();
		expect(wp.vm.slides.length).toBe(2);
	});

	it('should show the news before the view on small devices', async () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			computed: {
				isDesktop: () => false,
			},
		});

		await flushPromises();

		expect(wp.findComponent({ ref: 'widgetLogin' }).attributes('style')).toBe('display: none;');
		expect(wp.findComponent({ ref: 'widgetCarousel' }).exists()).toBeTruthy();

		const focus = jest.fn();
		wp.vm.$refs.widgetLogin.focus = focus;

		wp.vm.skipCarousel();
		await flushPromises();
		await wp.vm.$nextTick();

		expect(wp.findComponent({ ref: 'widgetLogin' }).attributes('style')).toBe('');
		expect(wp.findComponent({ ref: 'widgetCarousel' }).exists()).toBeFalsy();
		expect(focus).toHaveBeenCalled();
	});

	it('should show the news next to the view on big devices', async () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			computed: {
				isDesktop: () => true,
			},
		});

		await flushPromises();

		expect(wp.findComponent({ ref: 'widgetLogin' }).exists()).toBeTruthy();
		expect(wp.findComponent({ ref: 'widgetLogin' }).attributes('style')).toBe();
		expect(wp.findComponent({ ref: 'widgetCarousel' }).exists()).toBeTruthy();
	});

	it('should show the cookie modal on first access', async () => {
		window.dataLayer = [];
		document.cookieReset();

		wp = shallowMount(Component, { localVue, store, router });
		await flushPromises();

		expect(store.mockedActions['modal/open']).toHaveBeenCalledTimes(1);
	});

	it('should request for an anonymous login and open a password recovery modal', async () => {
		await wp.findComponent({ ref: 'widgetLogin' }).vm.$emit('open-password-recovery');
		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-password-recovery' })
		);
	});
});
