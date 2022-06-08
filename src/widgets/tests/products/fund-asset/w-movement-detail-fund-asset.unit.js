import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/fund-asset/w-movement-detail-fund-asset';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-detail-fund-asset.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {
					effectiveValue: {
						amount: 123.45,
						currency: { id: 'EUR', code: '978' },
					},
					id: 'abc123',
					operationDate: new Date(),
					liquidationValue: {
						amount: 123.45,
						currency: { id: 'EUR', code: '978' },
					},
				},
			},
		});
	});

	it('has a name equal to w-movement-detail-fund-asset', () => {
		expect(wp.vm.$options.name).toBe('w-movement-detail-fund-asset');
	});
});
