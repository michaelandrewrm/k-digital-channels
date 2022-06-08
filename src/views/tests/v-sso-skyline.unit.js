import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-sso-skyline';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-sso-skyline.vue', () => {
	let wp;
	let store;
	const fixture = {
		id: 'user-1',
		name: 'name-1',
		url: 'http://',
		isVisible: false,
		isOptionOpen: false,
		isLoading: false,
		isNotificationByEmail: false,
	};

	const open = jest.fn().mockResolvedValue();

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('modal', { open });
		store.mockModule('notification', { open });

		wp = shallowMount(Component, {
			localVue,
			store,
			attachTo: document.body,
			propsData: { session: fixture },
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to v-sso-skyline', () => {
		expect(wp.vm.$options.name).toBe('v-sso-skyline');
	});
});
