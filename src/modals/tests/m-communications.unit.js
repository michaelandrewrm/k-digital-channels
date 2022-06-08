import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-communications';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const LModal = {
	template: `
		<div class="l-modal" @keydown.capture="keyHandler">
			<slot name="header" />
			<slot />
			<slot name="buttons" />
		</div>
	`,
};

describe('m-communications.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue, stubs: { LModal } });
	});

	it('has a name equal to m-communications', () => {
		expect(wp.vm.$options.name).toBe('m-communications');
	});
});
