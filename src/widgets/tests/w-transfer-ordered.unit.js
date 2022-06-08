import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-ordered.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-ordered.vue', () => {
	let wp;
	const fixture = {
		id: 'transfer-1',
		reason: 'Pago curso',
		beneficiary: { description: 'Anastasio' },
		orderer: { fromAccount: { id: 'account-1' } },
		amount: { currency: { id: 'EUR' }, amount: 420.25 },
		date: '2020-01-01',
		status: { id: 'PAID' },
	};

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: { source: fixture, type: 'ordered' },
		});
	});

	it('has a name equal to w-transfer-ordered', () => {
		expect(wp.vm.$options.name).toBe('w-transfer-ordered');
	});

	it('renders correctly', () => {
		expect(wp.text().replace(/\s+/g, ' ')).toBe(
			'Transferencia realizada 420,25 € 1/1/2020 Realizada Pago curso'
		);
	});
});
