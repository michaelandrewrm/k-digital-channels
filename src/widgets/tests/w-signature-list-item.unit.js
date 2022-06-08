import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-signature-list-item.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-signature-list-item.vue', () => {
	let wp;
	const fixture = {
		signatureId: 'signature-1',
		operationType: 'transfer',
		operationDescription: 'transferencia',
		creationDate: '2019-12-25',
		status: { name: 'PENDING' },
		data: {
			amount: 29.99,
			currency: 'EUR',
			origin: 1234,
			destination: 5678,
		},
	};

	it('has a name equal to w-signature-list-item', () => {
		wp = shallowMount(Component, { localVue, propsData: { status: 'pending', source: fixture } });

		expect(wp.vm.$options.name).toBe('w-signature-list-item');
	});

	it('should render correctly', async () => {
		wp = shallowMount(Component, { localVue, propsData: { status: 'pending', source: fixture } });

		expect(wp.text().replace(/\s+/g, ' ')).toBe('transferencia 29,99 € 25/12/2019');
	});
});
