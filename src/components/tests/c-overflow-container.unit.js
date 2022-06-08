import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-overflow-container';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-overflow-container.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
			sync: false,
		});
	});

	it("has a name equal 'c-overflow-container'", () => {
		expect(shallowWrapper.vm.$options.name).toBe('c-overflow-container');
	});

	it('shows the top shadow on scrolling down', () => {
		const { sentinelTop } = shallowWrapper.vm.$refs;

		// simulate scroll down: sentinel is not intersected
		shallowWrapper.vm.observer.trigger({
			target: sentinelTop,
			intersect: false,
		});

		expect(shallowWrapper.emitted()['hide-top']).toBeTruthy();
		expect(shallowWrapper.find('.shadow-top.--show').exists()).toBeTruthy();

		// simulate scroll up: sentinel is instersected
		shallowWrapper.vm.observer.trigger({
			target: sentinelTop,
			intersect: true,
		});

		expect(shallowWrapper.emitted()['visible-top']).toBeTruthy();
		expect(shallowWrapper.find('.shadow-top.--show').exists()).toBeFalsy();
	});

	it('free memory unloading observer', () => {
		expect(shallowWrapper.vm.observer).toBeTruthy();

		shallowWrapper.destroy();

		expect(shallowWrapper.vm.observer).toBeFalsy();
	});

	it('turns off intersectionObserver when not observing props are setted', async () => {
		shallowWrapper.setProps({ observeTop: false, observeBottom: false });

		await localVue.nextTick();

		expect(shallowWrapper.vm.observer.unobserve).toHaveBeenCalled();
	});
});
