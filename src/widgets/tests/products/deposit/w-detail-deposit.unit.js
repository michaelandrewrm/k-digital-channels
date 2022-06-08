import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/deposit/w-detail-deposit.vue';
import { typesByTitle } from '@modules/products/product-types';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-detail-deposit.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
			sync: false,
			propsData: {
				detail: {
					productType: { id: typesByTitle.deposit },
					productNumber: {
						value: '',
						format: { id: '' },
					},
					interveners: [],
					expirationDate: '2021-12-31',
					cvv: '178',
					pin: '1234',
				},
			},
		});
	});

	it('has a name equal to w-detail-deposit', () => {
		expect(shallowWrapper.vm.$options.name).toBe('w-detail-deposit');
	});
});
