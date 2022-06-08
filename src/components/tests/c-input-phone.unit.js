import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-input-phone';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-input-phone.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it('has a name equal to c-input-phone', () => {
		expect(wp.vm.$options.name).toBe('c-input-phone');
	});

	it('marks as invalid an invalid field', async () => {
		await wp.setProps({ valid: false });
		expect(wp.find('input').attributes('aria-invalid')).toBeTruthy();
	});
});
