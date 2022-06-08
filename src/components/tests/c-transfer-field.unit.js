import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-transfer-field';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-transfer-field.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
		});
	});

	it('has a name equal to c-transfer-field', () => {
		expect(shallowWrapper.vm.$options.name).toBe('c-transfer-field');
	});

	it('marks as invalid an invalid field', async () => {
		await shallowWrapper.setProps({ valid: false });
		expect(shallowWrapper.find('input').attributes('aria-invalid')).toBeTruthy();
	});

	it('focus the input', async () => {
		shallowWrapper = shallowMount(Component, {
			localVue,
			attachTo: document.body,
			sync: false,
			propsData: { id: 'test' },
		});

		const input = shallowWrapper.findComponent({ ref: 'input' }).element;

		expect(shallowWrapper.element.ownerDocument.activeElement).not.toBe(input);
		shallowWrapper.vm.focus();
		expect(shallowWrapper.element.ownerDocument.activeElement).toBe(input);

		shallowWrapper.destroy();
	});
});
