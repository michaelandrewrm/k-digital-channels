import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-correos-cash-deposit';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-correos-cash-deposit.vue', () => {
	let wp;
	const fixture = {
		id: '1',
		operationDate: '2021-09-24',
		beneficiary: {
			productNumber: 'ES3102340098375445122708',
			name: 'Voldemort',
		},
		totalAmount: 123.45,
		details: [{ operationId: '1' }],
		detailsCount: 1,
	};

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: { source: fixture },
		});
	});

	it('has a name equal to w-correos-cash-deposit', () => {
		expect(wp.vm.$options.name).toBe('w-correos-cash-deposit');
	});

	it('should render correctly', () => {
		expect(wp.text().replace(/\s+/g, ' ')).toBe('**** **** **** **** **** 2708 24/9/2021 123,45 €');
	});
});
