import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-select-company.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-select-company.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			computed: { isDesktop: () => true, currentCompany: () => '' },
			stubs: { LModal, CButton },
		});
	});

	it('has a name equal to m-select-company', () => {
		expect(wp.vm.$options.name).toBe('m-select-company');
	});

	it('should select a company and emit a close event', async () => {
		await wp
			.findAll('[data-testid="company-button"]')
			.at(0)
			.trigger('click');

		expect(wp.vm.value).toBeTruthy();
		expect(wp.emitted('close')).toBeTruthy();
	});
});
