import { shallowMount } from '@vue/test-utils';
import Component from '@layouts/l-view-modal.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('l-view-modal.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it("has a name equal 'l-view-modal'", () => {
		expect(wp.vm.$options.name).toBe('l-view-modal');
	});

	it("emit an event 'close' when user clicks the button close", async () => {
		const button = wp.find('[data-testid="modal-close-button"]');

		expect(wp.emitted().close).toBeFalsy();
		await button.trigger('click');
		expect(wp.emitted().close).toBeTruthy();
	});
});
