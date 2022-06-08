import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@widgets/w-carousel.vue';
import 'hammer-simulator';

const newInstance = createPristineVue();
const { localVue } = newInstance;
const { Simulator } = window;

const panToTheLeft = (element, config = {}) =>
	new Promise((resolve) => {
		const options = { duration: 250, deltaX: -300, deltaY: 0, ...config };
		Simulator.gestures.pan(element, options, resolve);
	});

const panToTheRight = (element, config = {}) =>
	new Promise((resolve) => {
		const options = { duration: 250, deltaX: 300, deltaY: 0, ...config };
		Simulator.gestures.pan(element, options, resolve);
	});

describe('w-carousel.vue', () => {
	let store;

	beforeEach(() => {
		const { localStore } = newInstance;

		store = localStore;
	});

	it('has a name equal to w-carousel', () => {
		const wp = shallowMount(Component, { localVue, store });
		expect(wp.vm.$options.name).toBe('w-carousel');
	});

	it('should navigate on prev and next panes when navigable is true', async () => {
		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: {
				slides: [{ id: 1 }, { id: 2 }],
				navigable: true,
			},
		});

		expect(wp.find('[data-testid="prev-pane-button"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="next-pane-button"]').exists()).toBeTruthy();

		await wp.find('[data-testid="next-pane-button"]').trigger('click');

		expect(wp.find('[data-testid="prev-pane-button"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="next-pane-button"]').exists()).toBeFalsy();

		await wp.find('[data-testid="prev-pane-button"]').trigger('click');

		expect(wp.find('[data-testid="prev-pane-button"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="next-pane-button"]').exists()).toBeTruthy();
	});

	it('should navigate between panes when clicking on indicators', async () => {
		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { slides: [{ id: 1 }, { id: 2 }] },
		});

		const indicators = wp.findAll('[data-testid="indicators"] button');
		expect(indicators.at(0).attributes('aria-pressed')).toBeTruthy();
		expect(indicators.at(1).attributes('aria-pressed')).toBeFalsy();

		await indicators.at(1).trigger('click');

		expect(indicators.at(0).attributes('aria-pressed')).toBeFalsy();
		expect(indicators.at(1).attributes('aria-pressed')).toBeTruthy();
	});

	it('should select a pane when dragging to the left or right', async () => {
		expect.assertions(4);

		const wp = await shallowMount(Component, {
			localVue,
			store,
			propsData: { slides: [{ id: 1 }, { id: 2 }] },
		});
		await localVue.nextTick();

		const { element } = wp.findComponent({ ref: 'wc-touch-area' });
		const indicators = wp.findAll('[data-testid="indicators"] button');

		await panToTheLeft(element);
		expect(indicators.at(1).attributes('aria-pressed')).toBeTruthy();

		// should stop because is the last pane
		await panToTheLeft(element);
		expect(indicators.at(1).attributes('aria-pressed')).toBeTruthy();

		await panToTheRight(element);
		expect(indicators.at(0).attributes('aria-pressed')).toBeTruthy();

		// should stop because is the first pane
		await panToTheRight(element);
		expect(indicators.at(0).attributes('aria-pressed')).toBeTruthy();
	});

	it('should cancel the selection if not enough dragging', async () => {
		expect.assertions(1);

		const wp = await shallowMount(Component, {
			localVue,
			store,
			propsData: { slides: [{ id: 1 }, { id: 2 }] },
		});

		jest
			.spyOn(wp.findComponent({ ref: 'scroller' }).element, 'offsetWidth', 'get')
			.mockImplementation(() => 400);

		await localVue.nextTick();
		await wp.vm.$nextTick();

		const { element } = wp.findComponent({ ref: 'wc-touch-area' });
		const indicators = wp.findAll('[data-testid="indicators"] button');

		await panToTheLeft(element, { deltaX: -20 });
		expect(indicators.at(0).attributes('aria-pressed')).toBeTruthy();
	});

	it('should remove active references on destroy', async () => {
		const wp = await shallowMount(Component, {
			localVue,
			store,
			propsData: { slides: [{ id: 1 }, { id: 2 }] },
		});
		await localVue.nextTick();
		await wp.vm.$nextTick();
		await wp.destroy();

		expect(wp.vm.hammerInstance).toBeNull();
		expect(wp.vm.resizeObserver).toBeNull();
	});

	it('should be skipable', async () => {
		const wp = await shallowMount(Component, {
			localVue,
			store,
			propsData: {
				slides: [{ id: 1 }, { id: 2 }],
				skipable: true,
			},
		});
		await localVue.nextTick();

		expect(wp.find('[data-testid="skip-button"]').exists()).toBeTruthy();

		await wp.find('[data-testid="skip-button"]').trigger('click');

		expect(wp.emitted('skip-carousel')).toBeTruthy();
	});

	it('should change feedback on slides', async () => {
		store.registerModule('communications', {
			namespaced: true,
			actions: {
				setAnnouncementFeedback: jest.fn().mockResolvedValue(),
			},
		});

		const CSlide = {
			props: { data: { type: Object } },
			template: `<div>
				<button data-testid="unliked" v-if="data.feedback === 0" />
				<button data-testid="liked" v-if="data.feedback === 1" />
			</div>`,
		};

		const wp = await shallowMount(Component, {
			localVue,
			store,
			propsData: { slides: [{ id: 1 }, { id: 2 }], slideTemplate: 'c-slide' },
			stubs: { CSlide },
		});
		await localVue.nextTick();

		const slides = wp.findAll('[data-testid="slide"]');
		const firstSlide = slides.at(0);

		expect(firstSlide.find('[data-testid="liked"]').exists()).toBeFalsy();

		await firstSlide.vm.$emit('like');
		await flushPromises();

		expect(firstSlide.find('[data-testid="liked"]').exists()).toBeTruthy();

		await firstSlide.vm.$emit('unlike');
		await flushPromises();

		expect(firstSlide.find('[data-testid="liked"]').exists()).toBeFalsy();
		expect(firstSlide.find('[data-testid="unliked"]').exists()).toBeTruthy();

		await firstSlide.vm.$emit('unlike');
		await flushPromises();

		expect(firstSlide.find('[data-testid="liked"]').exists()).toBeFalsy();
		expect(firstSlide.find('[data-testid="unliked"]').exists()).toBeFalsy();
	});

	it('should not change feedback if service throws an error', async () => {
		store.registerModule('communications', {
			namespaced: true,
			actions: {
				setAnnouncementFeedback: jest.fn().mockRejectedValue(),
			},
		});

		const CSlide = {
			props: { data: { type: Object } },
			template: `<div>
				<button data-testid="unliked" v-if="data.feedback === 0" />
				<button data-testid="liked" v-if="data.feedback === 1" />
			</div>`,
		};

		const wp = await shallowMount(Component, {
			localVue,
			store,
			propsData: { slides: [{ id: 1, feedback: 1 }, { id: 2 }], slideTemplate: 'c-slide' },
			stubs: { CSlide },
		});
		await localVue.nextTick();

		const slides = wp.findAll('[data-testid="slide"]');
		const firstSlide = slides.at(0);

		expect(firstSlide.find('[data-testid="liked"]').exists()).toBeTruthy();

		await firstSlide.vm.$emit('unlike');
		await flushPromises();

		expect(firstSlide.find('[data-testid="liked"]').exists()).toBeTruthy();
	});

	it('should set an impression of a slide', async () => {
		const action = jest
			.fn()
			.mockResolvedValueOnce()
			.mockRejectedValueOnce()
			.mockResolvedValue();
		store.registerModule('communications', {
			namespaced: true,
			actions: { setAnnouncementImpression: action },
		});

		const wp = await shallowMount(Component, {
			localVue,
			store,
			propsData: {
				slides: [{ id: 1 }, { id: 2 }],
				enableFeedback: true,
			},
		});
		await localVue.nextTick();
		await flushPromises();

		expect(action).toHaveBeenLastCalledWith(expect.anything(), 1);

		const indicators = wp.findAll('[data-testid="indicators"] button');

		await indicators.at(1).trigger('click');

		expect(action).toHaveBeenLastCalledWith(expect.anything(), 2);

		await indicators.at(0).trigger('click');

		expect(action).toHaveBeenCalledTimes(2);
	});
});
