import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-fund-profitability.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-fund-profitability.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue, stubs: { LModal, CButton } });
	});

	it('has a name equal to m-fund-profitability', () => {
		expect(wp.vm.$options.name).toBe('m-fund-profitability');
	});

	it('should emit a close event', async () => {
		expect(wp.emitted().close).toBeFalsy();
		await wp.find('[data-testid="accept"]').trigger('click');
		expect(wp.emitted().close).toBeTruthy();
	});
});
