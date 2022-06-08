import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/equities/w-detail-equities.vue';
import { typesByTitle } from '@modules/products/product-types';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-detail-equities.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				detail: {
					productType: { id: typesByTitle.equities },
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

	it('has a name equal to w-detail-equities', () => {
		expect(wp.vm.$options.name).toBe('w-detail-equities');
	});
});
