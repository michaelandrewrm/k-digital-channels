import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/credit/w-movement-detail-credit.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-detail-credit.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {
					id: 'movement-1',
					operationDate: '2020-01-05',
					valueDate: '2020-01-06',
					type: { name: '' },
				},
			},
		});
	});

	it('has a name equal to w-movement-detail-credit', () => {
		expect(wp.vm.$options.name).toBe('w-movement-detail-credit');
	});
});
