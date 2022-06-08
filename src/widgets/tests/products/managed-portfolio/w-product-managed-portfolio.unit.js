import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/managed-portfolio/w-product-managed-portfolio.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-managed-portfolio.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				product: {
					alias: 'Cartera Gestionada GESTIFONSA',
					balance: { amount: 2550, currency: { id: 'EUR' } },
				},
			},
		});
	});

	it('has a name equal to w-product-managed-portfolio', () => {
		expect(wp.vm.$options.name).toBe('w-product-managed-portfolio');
	});
});
