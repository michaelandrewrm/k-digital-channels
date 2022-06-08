import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-text-field-helper-text';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-text-field-helper-text.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
			sync: false,
		});
	});

	it('has a name equal to c-text-field-helper-text', () => {
		expect(shallowWrapper.vm.$options.name).toBe('c-text-field-helper-text');
	});

	it('should add --persistent class name', async () => {
		const {
			vm: {
				mdcTextFieldHelperText: {
					foundation_: { adapter_: adapter },
				},
			},
		} = shallowWrapper;
		await shallowWrapper.setProps({
			persistent: true,
		});

		expect(adapter.hasClass('mdc-text-field-helper-text--persistent')).toBeTruthy();
	});

	it('should add --validation-msg class name', async () => {
		const {
			vm: {
				mdcTextFieldHelperText: {
					foundation_: { adapter_: adapter },
				},
			},
		} = shallowWrapper;
		await shallowWrapper.setProps({
			validationMsg: true,
		});

		expect(adapter.hasClass('mdc-text-field-helper-text--validation-msg')).toBeTruthy();
	});
});
