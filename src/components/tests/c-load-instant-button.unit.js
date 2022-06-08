import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-load-instant-button';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-load-instant-button.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	afterEach(() => {
		wp.destroy();
	});

	it("has a name equal 'c-load-instant-button'", () => {
		expect(wp.vm.$options.name).toBe('c-load-instant-button');
	});

	/**
	 * Con triggerClickOnVisibility debería emitir el evento click
	 * cuando el componente se encuentre visible en el viewport y
	 * al hacer click en él
	 */
	it('should trigger click on visible', async () => {
		await wp.setProps({ triggerClickOnVisibility: true });

		wp.vm.observer.trigger({ target: wp.element, intersect: true });

		expect(wp.emitted('click')).toBeTruthy();

		await wp.trigger('click');

		expect(wp.emitted('click').length).toBe(2);

		wp.vm.observer.trigger({ target: wp.element, intersect: false });

		expect(wp.emitted('click').length).toBe(2);

		wp.vm.observer.trigger({ target: wp.element, intersect: true });

		expect(wp.emitted('click').length).toBe(3);
	});

	/**
	 * Sin triggerClickOnVisibility debería emitir el evento click
	 * solo al hacer click en él.
	 */
	it('should not trigger click on visible but only on click', async () => {
		await wp.setProps({ triggerClickOnVisibility: false });

		wp.vm.observer.trigger({ target: wp.element, intersect: true });

		expect(wp.emitted('click')).toBeFalsy();

		await wp.trigger('click');

		expect(wp.emitted('click').length).toBe(1);

		wp.vm.observer.trigger({ target: wp.element, intersect: false });

		expect(wp.emitted('click').length).toBe(1);

		wp.vm.observer.trigger({ target: wp.element, intersect: true });

		expect(wp.emitted('click').length).toBe(1);
	});
});
