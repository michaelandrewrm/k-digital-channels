import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/credit/w-detail-credit.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-detail-credit.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			sync: false,
			propsData: {
				detail: {
					id: '123ABC',
					alias: 'Póliza Garantía Interés Fijo',
					name: 'Póliza Garantía Interés Fijo',
					connectedAccount: {
						format: { id: 'IBAN', name: 'IBAN' },
						value: 'ES6968867819113534431785',
					},
					productNumber: {
						format: { id: 'IBAN', name: 'IBAN' },
						value: 'ES3102340098375445120327',
					},
					startingAmount: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
					limitAmount: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
					outstandingAmount: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
					postedAmount: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
					interest: {
						method: {
							id: '01',
							name: 'FIJO',
						},
						creditorInterest: 1.0,
						debtorInterest: 6.0,
					},
					startDate: '2020-12-11',
					expiryDate: '2021-12-11',
					reviewDate: '2020-06-11',
					interveners: [
						{
							id: '',
							name: '',
							relationType: {
								id: '01',
								name: 'holder',
							},
						},
					],
					productType: { id: '10', name: 'Crédito' },
					productSubtype: { id: '23', name: 'Póliza Garantía Interés Fijo' },
					status: { id: '01', name: 'Vigente' },
					signature: {
						id: '1',
						name: 'Solidario sin condiciones',
						conditions: {
							limit: {
								amount: -123.45,
								currency: { code: '978', id: 'EUR' },
							},
						},
					},
				},
			},
		});
	});

	it('has a name equal to w-detail-credit', () => {
		expect(wp.vm.$options.name).toBe('w-detail-credit');
	});

	it('renders correctly', () => {
		expect(wp.element).toMatchSnapshot();
	});
});
