import { shallowMount } from '@vue/test-utils';
import Component from '@layouts/l-transfer-sheet.vue';

jest.mock('seamless-scroll-polyfill');

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('l-transfer-sheet.vue', () => {
	it('has a name equal to l-transfer-sheet', () => {
		const wp = shallowMount(Component, { localVue });
		expect(wp.vm.$options.name).toBe('l-transfer-sheet');
	});

	it('should focus the header', async () => {
		jest.useFakeTimers();
		const WTransferDestination = {
			template: `
				<l-transfer-sheet>
					<h2 tabindex="-1">Destination Account</h2>
				</l-transfer-sheet>
			`,
		};
		const wp = shallowMount(WTransferDestination, {
			localVue,
			attachTo: document.body,
			stubs: {
				'l-transfer-sheet': Component,
			},
			sync: false,
		});

		await wp.vm.$nextTick();

		const h2 = wp.find('h2').element;
		expect(wp.element.ownerDocument.activeElement).toBe(h2);
	});

	it('should set isFocused only on focusin/focusout events from inputs and text type targets', async () => {
		jest.useFakeTimers();
		const WTransferAmount = {
			template: `
				<l-transfer-sheet class="w-transfer-amount">
					<h2 tabindex="-1">Destination Account</h2>
					<input />
					<textarea />
				</l-transfer-sheet>
			`,
			components: { LTransferSheet: Component },
		};
		const wp = shallowMount(WTransferAmount, {
			localVue,
			attachTo: document.body,
			stubs: {
				'l-transfer-sheet': Component,
			},
			sync: false,
		});

		await wp.vm.$nextTick();

		const { __vue__: cmp } = wp.find('.w-transfer-amount').vm.$el;

		const input = wp.find('input');
		const textarea = wp.find('textarea');

		input.trigger('focusin');
		jest.runAllTimers();
		expect(cmp.isFocused).toBeTruthy();

		input.trigger('focusout');
		jest.runAllTimers();
		expect(cmp.isFocused).toBeFalsy();

		await textarea.trigger('focusin');
		expect(cmp.isFocused).toBeFalsy();
	});
});
