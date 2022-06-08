import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-transfer-date-picker';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-transfer-date-picker.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue, stubs: { CIconButton: CButton } });
	});

	it('has a name equal to c-transfer-date-picker', () => {
		expect(wp.vm.$options.name).toBe('c-transfer-date-picker');
	});

	it('should show the selected date on DD/MM/YYYY format', async () => {
		const input = wp.findComponent({ ref: 'input' });
		await input.trigger('click');

		const { vm: calendar } = wp.find('[data-testid="calendar"]');
		const event = { day: 9, month: 9, year: 2020 };
		calendar.$emit('selected-date', event);
		calendar.$emit('close');

		await localVue.nextTick();

		expect(input.element).toHaveValue('09/09/2020');
		expect(wp.emitted()['update:value'][0][0]).toBe('2020-09-09');
	});

	it('should reset the date and selected date', async () => {
		const input = wp.findComponent({ ref: 'input' });
		await input.trigger('click');

		const { vm: calendar } = wp.find('[data-testid="calendar"]');
		const event = { day: 9, month: 9, year: 2020 };
		calendar.$emit('update:value', '2020-09-09');
		calendar.$emit('selected-date', event);
		calendar.$emit('close');

		await localVue.nextTick();

		expect(input.element).toHaveValue('09/09/2020');

		const button = wp.find('[data-testid="clear"]');
		expect(button.exists()).toBeTruthy();
		await button.trigger('click');

		expect(button.exists()).toBeFalsy();
		expect(input.element.value).toBeFalsy();
		expect(wp.emitted()['update:value'][0][1]).toBeFalsy();
	});

	it('should reset the date and selected date after receive a falsy value', async () => {
		const input = wp.findComponent({ ref: 'input' });
		await input.trigger('click');

		const { vm: calendar } = wp.find('[data-testid="calendar"]');
		const event = { day: 9, month: 9, year: 2020 };
		calendar.$emit('update:value', '2020-09-09');
		calendar.$emit('selected-date', event);
		calendar.$emit('close');

		await localVue.nextTick();

		expect(input.element).toHaveValue('09/09/2020');

		await wp.setProps({ value: null });

		expect(input.element.value).toBeFalsy();
	});

	it('should show the date from model', async () => {
		await wp.setProps({ value: '09/09/2020' });
		const input = wp.findComponent({ ref: 'input' });

		expect(input.element).toHaveValue('09/09/2020');
	});

	it('should accept an ISO date', async () => {
		await wp.setProps({ value: '2020-12-31' });
		const input = wp.findComponent({ ref: 'input' });

		expect(input.element).toHaveValue('31/12/2020');
	});

	it('should close the datepicker if user clicks outside of it', async () => {
		wp = shallowMount(Component, {
			localVue,
			attachTo: document.body,
			stubs: { CIconButton: CButton },
		});

		const input = wp.findComponent({ ref: 'input' });

		// open
		await input.trigger('click');
		expect(wp.find('[data-testid="calendar"]').exists()).toBeTruthy();

		// close
		await input.trigger('click');
		expect(wp.find('[data-testid="calendar"]').exists()).toBeFalsy();

		// open
		await input.trigger('click');
		expect(wp.find('[data-testid="calendar"]').exists()).toBeTruthy();

		// still open
		await wp.find('[data-testid="calendar"]').trigger('click');
		expect(wp.find('[data-testid="calendar"]').exists()).toBeTruthy();

		// close
		document.dispatchEvent(new Event('click'));
		await localVue.nextTick();
		expect(wp.find('[data-testid="calendar"]').exists()).toBeFalsy();
	});
});
