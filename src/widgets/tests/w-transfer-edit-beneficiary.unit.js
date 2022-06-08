import { shallowMount } from '@vue/test-utils';
import CButton from '@tests/stubs/c-button.stub';
import CTextField from '@tests/stubs/c-text-field.stub';
import Component from '@widgets/w-transfer-edit-beneficiary.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-edit-beneficiary.vue', () => {
	let wp;

	const value = {
		destination: {
			name: 'BENEFICIARY',
		},
	};

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: { value },
			stubs: {
				CButton,
				'c-transfer-field': CTextField,
			},
		});
	});

	it('has a name equal to w-transfer-edit-beneficiary', () => {
		expect(wp.vm.$options.name).toBe('w-transfer-edit-beneficiary');
	});

	it('should submit when button clicked', async () => {
		const closeButton = wp.find('[data-testid="close-button"]');

		const invalidMsg = wp.find('[data-testid="beneficiary-validation"]');

		expect(invalidMsg.exists()).toBeFalsy();

		await closeButton.trigger('click');

		await wp.vm.$nextTick();

		expect(wp.emitted('update:value')).toBeTruthy();
	});

	it('button should be disabled and message shows when beneficiary invalid', async () => {
		const inputField = wp.find('[data-testid="beneficiary"]');

		inputField.setValue('');

		await wp.vm.$nextTick();

		const closeButton = wp.find('[data-testid="close-button"]');

		expect(closeButton.attributes().disabled).toBeDefined();

		const invalidMsg = wp.find('[data-testid="beneficiary-validation"]');

		expect(invalidMsg.exists()).toBeTruthy();
	});
});
