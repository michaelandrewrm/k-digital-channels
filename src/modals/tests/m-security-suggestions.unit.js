import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-security-suggestions.vue';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-security-suggestions.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue, stubs: { LModal } });
	});

	it('has a name equal to m-security-suggestions', () => {
		expect(wp.vm.$options.name).toBe('m-security-suggestions');
	});
});
