import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/card/w-movement-detail-card.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-detail-card.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {
					id: '1234',
					operationDate: '2020-01-05',
					valueDate: '2020-01-06',
					type: { name: 'COMPRA' },
				},
			},
		});
	});

	it('has a name equal to w-movement-detail-card', () => {
		expect(wp.vm.$options.name).toBe('w-movement-detail-card');
	});
});
