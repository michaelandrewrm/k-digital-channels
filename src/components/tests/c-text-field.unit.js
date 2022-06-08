import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-text-field';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-text-field.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue, attachTo: document.body });
	});

	it('has a name equal to c-text-field', () => {
		expect(wp.vm.$options.name).toBe('c-text-field');
	});

	it('should add the focus class', async () => {
		await wp.vm.focus();
		expect(wp.attributes('class')).toContain('mdc-text-field--focused');
	});

	it('should add the outlined class', async () => {
		await wp.setProps({ outlined: true });
		expect(wp.attributes('class')).toContain('mdc-text-field--outlined');
	});

	it('should get disabled', async () => {
		await wp.setProps({ disabled: true });
		expect(wp.attributes('class')).toContain('mdc-text-field--disabled');
		expect(wp.findComponent({ ref: 'textfield' }).attributes('disabled')).toBe('');
	});

	it('should add the invalid class', async () => {
		await wp.setProps({ valid: false });
		expect(wp.attributes('class')).toContain('mdc-text-field--invalid');
	});

	it('should set a value', async () => {
		await wp.setProps({ value: 'text' });
		expect(wp.findComponent({ ref: 'textfield' }).element.value).toBe('text');
		expect(wp.vm.mdcTextField.value).toBe('text');
	});
});
