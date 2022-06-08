import { shallowMount } from '@vue/test-utils';
import Component from '@layouts/l-action-sheet.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('l-action-sheet.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		wp = shallowMount(Component, { localVue, store });
	});

	it("has a name equal 'l-action-sheet'", () => {
		expect(wp.vm.$options.name).toBe('l-action-sheet');
	});

	it("emit an event 'close' when user clicks the button close", async () => {
		const callback = jest.fn();
		const button = wp.find('[data-testid="modal-close-button"]');

		wp.vm.$el.addEventListener('close', callback);

		expect(callback).not.toBeCalled();
		await button.trigger('click');
		expect(callback).toBeCalled();
	});
});
