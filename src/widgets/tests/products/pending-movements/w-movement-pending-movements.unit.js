import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/pending-movements/w-movement-pending-movements.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-pending-movements.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
			propsData: {
				source: {
					id: 1234,
					reason: 'Traspaso en curso',
					amount: { currency: { id: 'EUR' }, amount: 2000.4 },
					operationDate: '2020-01-02T00:00:00.000Z',
					originFund: {
						id: 'LU0336683767',
						name: 'DPAM L BOND GOVER SUST HGED F',
					},
					destinationFund: {
						id: 'DE8',
						name: 'DPAM INV REAL EST EUR DV-W',
					},
				},
			},
		});
	});

	it('has a name equal to w-movement-pending-movements', () => {
		expect(shallowWrapper.vm.$options.name).toBe('w-movement-pending-movements');
	});

	it('renders correctly', () => {
		expect(shallowWrapper.element).toMatchSnapshot();
	});
});
