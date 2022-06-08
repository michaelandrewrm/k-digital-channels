import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-notification-bell';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-notification-bell.vue', () => {
	let wp;
	let setAppBadge;
	let clearAppBadge;

	beforeAll(() => {
		setAppBadge = navigator.setAppBadge;
		clearAppBadge = navigator.clearAppBadge;
	});

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
		navigator.setAppBadge = jest.fn();
		navigator.clearAppBadge = jest.fn();
	});

	afterAll(() => {
		navigator.setAppBadge = setAppBadge;
		navigator.clearAppBadge = clearAppBadge;
	});

	it("has a name equal 'c-notification-bell'", () => {
		expect(wp.vm.$options.name).toBe('c-notification-bell');
	});

	it('triggers a badge notification', async () => {
		wp.setProps({ badge: 20 });
		await localVue.nextTick();

		expect(navigator.setAppBadge).toHaveBeenCalled();

		wp.setProps({ badge: 0 });
		await localVue.nextTick();

		expect(navigator.clearAppBadge).toHaveBeenCalled();
	});
});
