import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/pending-movements/w-product-pending-movements.vue';
import { typesByTitle } from '@modules/products/product-types';
import { subtypesByTitle } from '@modules/products/product-subtypes';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-pending-movements.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				product: {
					productType: { id: typesByTitle['pending-movements'] },
					productSubtype: { id: subtypesByTitle['pending-movements'] },
					alias: 'Gestifonsa',
					balance: { currency: { id: 'EUR' }, amount: 100531.4 },
					postedBalance: { currency: { id: 'EUR' }, amount: 2000.4 },
				},
				active: true,
			},
		});
	});

	it('has a name equal to w-product-pending-movements', () => {
		expect(wp.vm.$options.name).toBe('w-product-pending-movements');
	});
});
