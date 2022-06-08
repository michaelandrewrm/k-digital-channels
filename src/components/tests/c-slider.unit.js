import { mount, shallowMount } from '@vue/test-utils';
import Component from '@components/c-slider';
import 'hammer-simulator';

const newInstance = createPristineVue();
const { localVue } = newInstance;
const { Simulator } = window;

Element.prototype.getBoundingClientRect = jest.fn(() => {
	return {
		width: 120,
		height: 120,
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	};
});

describe('c-slider.vue', () => {
	let wp;

	beforeEach(() => {
		wp = mount(Component, {
			localVue,
			sync: false,
			slots: {
				default: ['<header class="pane"></header>', '<footer class="pane"></footer>'],
			},
		});
	});

	it('has a name equal to c-slider', () => {
		expect(wp.vm.$options.name).toBe('c-slider');
	});

	it('should navigate on prev and next panes', async () => {
		expect(wp.vm.currentPane).toBe(0);

		wp.vm.next();
		await localVue.nextTick();

		expect(wp.vm.currentPane).toBe(1);

		wp.vm.prev();
		await localVue.nextTick();

		expect(wp.vm.currentPane).toBe(0);
	});

	it('should navigate between panes when clicking on indicators', async () => {
		const indicators = wp.findAll('[data-testid="indicators"] button');

		expect(indicators.at(0).attributes('aria-pressed')).toBeTruthy();
		expect(indicators.at(1).attributes('aria-pressed')).toBeFalsy();
		expect(wp.vm.currentPane).toBe(0);

		indicators.at(1).trigger('click');
		await localVue.nextTick();

		expect(indicators.at(0).attributes('aria-pressed')).toBeFalsy();
		expect(indicators.at(1).attributes('aria-pressed')).toBeTruthy();
		expect(wp.vm.currentPane).toBe(1);
	});

	it('should select the pane setted from prop', async () => {
		wp.setProps({ selected: 1 });
		await localVue.nextTick();

		expect(wp.vm.currentPane).toBe(1);
	});

	it('should select the second pane when user clicks on it', async () => {
		wp.findAll('[data-testid="slider-pane"]')
			.at(1)
			.trigger('click');

		await localVue.nextTick();

		expect(wp.vm.currentPane).toBe(1);

		wp.findAll('header.pane')
			.at(0)
			.trigger('click');

		await localVue.nextTick();

		expect(wp.vm.currentPane).toBe(1);

		wp.findAll('[data-testid="slider-pane"]')
			.at(0)
			.trigger('click');

		await localVue.nextTick();

		expect(wp.vm.currentPane).toBe(0);
	});

	it('should select the second pane when dragging the first one to the left', async (done) => {
		expect.assertions(1);

		const { element } = wp.findComponent({ ref: 'wc-touch-area' });
		const toTheLeft = { duration: 250, deltaX: -300, deltaY: 0 };

		Simulator.gestures.pan(element, toTheLeft, () => {
			expect(wp.vm.currentPane).toBe(1);
			done();
		});
	});

	it('should stop on the last pane when trying to swipe left', async (done) => {
		expect.assertions(1);

		wp.setProps({ selected: 1 });
		await localVue.nextTick();

		const { element } = wp.findComponent({ ref: 'wc-touch-area' });
		const toTheLeft = { duration: 250, deltaX: -300, deltaY: 0 };

		Simulator.gestures.pan(element, toTheLeft, () => {
			expect(wp.vm.currentPane).toBe(1);
			done();
		});
	});

	it('should select the first pane when dragging the second one to the right', async (done) => {
		expect.assertions(1);

		wp.setProps({ selected: 1 });
		await localVue.nextTick();

		const { element } = wp.findComponent({ ref: 'wc-touch-area' });
		const toTheRight = { duration: 250, deltaX: 300, deltaY: 0 };

		Simulator.gestures.pan(element, toTheRight, () => {
			expect(wp.vm.currentPane).toBe(0);
			done();
		});
	});

	it('should cancel the selection if not enough dragging', async (done) => {
		expect.assertions(1);

		const { element } = wp.findComponent({ ref: 'wc-touch-area' });
		const toTheLeft = { duration: 250, deltaX: -20, deltaY: 0 };

		Simulator.gestures.swipe(element, toTheLeft, () => {
			expect(wp.vm.currentPane).toBe(0);
			done();
		});
	});

	it('should select the second pane when swiping the first one to the left', async (done) => {
		expect.assertions(1);

		const { element } = wp.findComponent({ ref: 'wc-touch-area' });
		const toTheLeft = { duration: 100, deltaX: -30, deltaY: 0 };

		Simulator.gestures.swipe(element, toTheLeft, () => {
			expect(wp.vm.currentPane).toBe(1);
			done();
		});
	});

	it('should select the first pane when swiping the second one to the right', async (done) => {
		expect.assertions(1);

		wp.setProps({ selected: 1 });
		await localVue.nextTick();

		const { element } = wp.findComponent({ ref: 'wc-touch-area' });
		const toTheRight = { duration: 100, deltaX: 30, deltaY: 0 };

		Simulator.gestures.swipe(element, toTheRight, () => {
			expect(wp.vm.currentPane).toBe(0);
			done();
		});
	});

	it('should animate the navigation bullets on slider with more than 5 items', async () => {
		wp = shallowMount(Component, {
			localVue,
			sync: false,
			slots: {
				default: [
					'<div class="pane"></div>',
					'<div class="pane"></div>',
					'<div class="pane"></div>',
					'<div class="pane"></div>',
					'<div class="pane"></div>',
				],
			},
		});

		let bulletsWrapper = wp.findComponent({ ref: 'bulletsWrapper' }).element;
		let bullets = bulletsWrapper.querySelectorAll('.c-slider__indicator button');
		const pane = 0;

		expect(bullets[pane]).not.toHaveAttribute('hidden', 'medium', 'small');
		expect(bullets[pane + 1]).not.toHaveAttribute('hidden', 'medium', 'small');
		expect(bullets[pane + 2]).not.toHaveAttribute('hidden', 'medium', 'small');
		expect(bullets[pane + 3]).not.toHaveAttribute('hidden', 'medium', 'small');

		wp = shallowMount(Component, {
			localVue,
			sync: false,
			slots: {
				default: [
					'<div class="pane"></div>',
					'<div class="pane"></div>',
					'<div class="pane"></div>',
					'<div class="pane"></div>',
					'<div class="pane"></div>',
					'<div class="pane"></div>',
				],
			},
		});

		expect(wp.vm.translateX).toBe(0);
		expect(bulletsWrapper.style.transform).toBeFalsy();

		await wp.setProps({ selected: 1 });

		bulletsWrapper = wp.findComponent({ ref: 'bulletsWrapper' }).element;
		bullets = bulletsWrapper.querySelectorAll('.c-slider__indicator button');

		expect(bullets[pane]).not.toHaveAttribute('hidden', 'medium', 'small');
		expect(bullets[pane + 1]).not.toHaveAttribute('hidden', 'medium', 'small');
		expect(bullets[pane + 2]).not.toHaveAttribute('hidden', 'medium', 'small');
		expect(bullets[pane + 3]).toHaveAttribute('medium');
		expect(bullets[pane + 4]).toHaveAttribute('small');
		expect(bullets[pane + 5]).toHaveAttribute('hidden');

		const width = wp.vm.bulletsWrapperWidth;
		const bulletWidth = width / bullets.length;
		const translateX = width / 2 - bulletWidth / 2 - bulletWidth;

		expect(wp.vm.translateX).toBe(translateX);
		expect(bulletsWrapper.style.transform).toBe(`translateX(${translateX}px)`);
	});
});
