import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/equities-asset/w-detail-equities-asset';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-detail-equities-asset.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				detail: {
					id: 'abc123',
					market: '',
					unityQuantity: 123.45,
					lastTotalValue: {
						amount: 123.45,
						currency: { id: 'EUR', code: '978' },
					},
					lastValueDate: new Date(),
					balance: {
						amount: 123.45,
						currency: { id: 'EUR', code: '978' },
					},
					blockedTitles: 12.345,
				},
			},
		});
	});

	it('has a name equal to w-detail-equities-asset', () => {
		expect(wp.vm.$options.name).toBe('w-detail-equities-asset');
	});
});
