import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-destination.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-destination.vue', () => {
	it('has a name equal to w-transfer-destination', () => {
		const wp = shallowMount(Component, { localVue, propsData: { value: {} } });
		expect(wp.vm.$options.name).toBe('w-transfer-destination');
	});

	it('emit the submit event', () => {
		jest.useFakeTimers();

		const wp = shallowMount(Component, { localVue, propsData: { value: {} } });

		expect(wp.emitted()['update:value']).toBeTruthy();
		expect(wp.emitted()['update:value'][0][0]).toMatchObject({ destination: null });

		wp.vm.select({
			alias: 'Cuenta destino',
			id: '1234',
			productNumber: { format: 'IBAN', value: 'ES7921000813610123456789' },
		});

		jest.runAllTimers();

		expect(wp.emitted()['update:value']).toBeTruthy();
		expect(wp.emitted()['update:value'][1][0]).toMatchObject({
			destination: {
				account: { type: 'IBAN', id: 'ES7921000813610123456789' },
				transferMode: 'INTERNAL',
				view: { name: 'Cuenta destino', id: '6789' },
			},
		});
	});
});
