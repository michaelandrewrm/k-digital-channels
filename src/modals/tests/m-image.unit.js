import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-image.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-image.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it("has a name equal 'm-image'", () => {
		expect(wp.vm.$options.name).toBe('m-image');
	});

	it("emit an event 'close' when user clicks the button close", async () => {
		const button = wp.find('[data-testid="modal-close-button"]');

		expect(wp.emitted().close).toBeFalsy();
		await button.trigger('click');
		expect(wp.emitted().close).toBeTruthy();
	});
});
