import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-transfer-input-amount';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-transfer-input-amount.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
		});
	});

	it('has a name equal to c-transfer-input-amount', () => {
		expect(wp.vm.$options.name).toBe('c-transfer-input-amount');
	});

	it('marks as invalid an invalid field', async () => {
		await wp.setProps({ valid: false });
		expect(wp.find('input').attributes('aria-invalid')).toBeTruthy();
	});

	it('focus the input', async () => {
		wp = shallowMount(Component, {
			localVue,
			attachTo: document.body,
			sync: false,
			propsData: { id: 'test' },
		});

		const input = wp.findComponent({ ref: 'input' }).element;

		expect(wp.element.ownerDocument.activeElement).not.toBe(input);
		wp.vm.focus();
		expect(wp.element.ownerDocument.activeElement).toBe(input);

		wp.destroy();
	});

	it('should format the input number', async () => {
		wp = shallowMount(Component, {
			localVue,
			attachTo: document.body,
			sync: false,
			propsData: { id: 'test', value: '1234.25' },
		});

		const input = wp.findComponent({ ref: 'input' });

		expect(input.element.value).toBe('1.234,25');

		wp.vm.focus();
		await localVue.nextTick();
		expect(input.element.value).toBe('1234,25');

		await input.setValue('2000,50');
		input.element.blur();
		await localVue.nextTick();
		expect(input.element.value).toBe('2.000,50');

		wp.destroy();
	});
});
