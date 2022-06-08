import { shallowMount } from '@vue/test-utils';
import Component from '@layouts/l-page.vue';
import 'hammer-simulator';

const newInstance = createPristineVue();
const { localVue } = newInstance;
const { Simulator } = window;

const panDown = (element, config = {}) =>
	new Promise((resolve) => {
		const options = { duration: 250, deltaX: 0, deltaY: -300, ...config };
		Simulator.gestures.pan(element, options, resolve);
	});

const panUp = (element, config = {}) =>
	new Promise((resolve) => {
		const options = { duration: 250, deltaX: 0, deltaY: 300, ...config };
		Simulator.gestures.pan(element, options, resolve);
	});

describe('l-page.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it('has a name equal to l-page', () => {
		expect(wp.vm.$options.name).toBe('l-page');
	});

	it('should focus the header', async () => {
		const sampleView = {
			template: `
				<l-page>
					<h1 data-testid="title" slot="header" tabindex="-1">Personal Area</h1>
					<div data-testid="widget" slot="widget">Widget</div>
					<div data-testid="static-header" slot="main-static-header">Main Header</div>
					<div data-testid="fixed-header" slot="main-fixed-header">Main Fixed Header</div>
					<div data-testid="content">Content</div>
					<div data-testid="footer" slot="footer">Footer</div>
					<div data-testid="buttons" slot="buttons">Buttons</div>
				</l-page>
			`,
		};
		wp = shallowMount(sampleView, {
			localVue,
			attachTo: document.body,
			stubs: { LPage: Component },
		});

		await localVue.nextTick();

		const h1 = wp.find('h1').element;
		expect(wp.element.ownerDocument.activeElement).toBe(h1);

		expect(wp.find('[data-testid=title]').exists()).toBeTruthy();
		expect(wp.find('[data-testid=widget]').exists()).toBeTruthy();
		expect(wp.find('[data-testid=static-header]').exists()).toBeTruthy();
		expect(wp.find('[data-testid=fixed-header]').exists()).toBeTruthy();
		expect(wp.find('[data-testid=content]').exists()).toBeTruthy();
		expect(wp.find('[data-testid=footer]').exists()).toBeTruthy();
		expect(wp.find('[data-testid=buttons]').exists()).toBeTruthy();
	});

	it('should lift the sheet on scroll', async () => {
		const liftCardboard = jest.fn();
		const dropCardboard = jest.fn();

		const CSheet = {
			template: '<div><slot /></div>',
			methods: { liftCardboard, dropCardboard },
		};

		const sampleView = {
			template: `
				<l-page>
					<div data-testid="widget" slot="widget" v-if="enableWidget">Widget</div>
					<div data-testid="content">Content</div>
					<div data-testid="buttons" slot="buttons">Buttons</div>
				</l-page>
			`,
			props: { enableWidget: { type: Boolean } },
		};
		wp = shallowMount(sampleView, {
			localVue,
			attachTo: document.body,
			stubs: { LPage: Component, CSheet },
			propsData: { enableWidget: true },
		});
		await localVue.nextTick();

		await wp.find('[data-testid="layout-body"]').trigger('wheel', { deltaY: 10 });

		expect(liftCardboard).toHaveBeenCalled();

		await wp.find('[data-testid="layout-body"]').trigger('wheel', { deltaY: -10 });

		expect(dropCardboard).toHaveBeenCalled();

		await wp.setProps({ enableWidget: false });

		await wp.find('[data-testid="layout-body"]').trigger('wheel', { deltaY: 10 });
		expect(liftCardboard).toHaveBeenCalledTimes(1);
	});

	it('should lift and drop the cardboard on pan', async () => {
		const liftCardboard = jest.fn().mockImplementation(function() {
			this.$emit('beforeLift');
			this.$emit('lift');
		});
		const dropCardboard = jest.fn().mockImplementation(function() {
			this.$emit('beforeDrop');
			this.$emit('drop');
		});

		const CSheet = {
			template: '<div><slot /></div>',
			methods: { liftCardboard, dropCardboard },
		};

		const COverflowContainer = {
			template: '<div v-bind="$attrs" v-on="$listeners" data-testid="scrolling"><slot /></div>',
		};

		const sampleView = {
			template: `
				<l-page>
					<div data-testid="widget" slot="widget">Widget</div>
					<div data-testid="content">Content</div>
					<div data-testid="buttons" slot="buttons">Buttons</div>
				</l-page>
			`,
		};
		wp = await shallowMount(sampleView, {
			localVue,
			attachTo: document.body,
			stubs: { LPage: Component, CSheet, COverflowContainer },
		});
		await localVue.nextTick();

		expect(liftCardboard).not.toHaveBeenCalled();
		await panDown(wp.find('[data-testid="layout-body"]').element);
		expect(liftCardboard).toHaveBeenCalled();

		liftCardboard.mockClear();

		expect(liftCardboard).not.toHaveBeenCalled();
		await wp.find('[data-testid="scrolling"]').vm.$emit('hide-top');
		await wp.find('[data-testid="scrolling"]').vm.$emit('visible-bottom');
		expect(liftCardboard).toHaveBeenCalled();

		liftCardboard.mockClear();

		expect(liftCardboard).not.toHaveBeenCalled();
		await panDown(wp.find('[data-testid="layout-body"]').element);
		expect(liftCardboard).not.toHaveBeenCalled();

		liftCardboard.mockClear();

		expect(dropCardboard).not.toHaveBeenCalled();
		await wp.find('[data-testid="scrolling"]').vm.$emit('visible-top');
		expect(dropCardboard).toHaveBeenCalled();

		dropCardboard.mockClear();

		await panDown(wp.find('[data-testid="layout-body"]').element);
		expect(dropCardboard).not.toHaveBeenCalled();

		await wp.find('[data-testid="scrolling"]').vm.$emit('hide-bottom');
		await panUp(wp.find('[data-testid="layout-body"]').element);
		expect(dropCardboard).toHaveBeenCalled();
	});
});
