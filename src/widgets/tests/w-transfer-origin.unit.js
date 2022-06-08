import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-origin.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-origin.vue', () => {
	it('has a name equal to w-transfer-origin', () => {
		const wp = shallowMount(Component, { localVue, propsData: { value: {} } });
		expect(wp.vm.$options.name).toBe('w-transfer-origin');
	});

	it('emit the submit event', () => {
		jest.useFakeTimers();

		const wp = shallowMount(Component, { localVue, propsData: { value: {} } });

		expect(wp.emitted()['update:value']).toBeTruthy();
		expect(wp.emitted()['update:value'][0][0]).toMatchObject({ origin: null });

		wp.vm.select({ alias: 'Cuenta transparente' });

		jest.runAllTimers();

		expect(wp.emitted()['update:value']).toBeTruthy();
		expect(wp.emitted()['update:value'][1][0]).toMatchObject({
			origin: { alias: 'Cuenta transparente' },
		});
	});
});
