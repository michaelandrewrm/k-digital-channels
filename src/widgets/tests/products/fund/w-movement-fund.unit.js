import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/fund/w-movement-fund';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-fund.vue', () => {
	let wp;
	let router;

	beforeEach(() => {
		const { localRouter } = newInstance;

		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			router,
			propsData: {
				source: {
					id: 'abc123',
					amount: {
						amount: 123.45,
						currency: { id: 'EUR', code: '978' },
					},
					operationDate: new Date(),
					unityQuantity: 80.234,
					effectiveValue: {
						amount: 123.45,
						currency: { id: 'EUR', code: '978' },
					},
				},
			},
		});
	});

	it('has a name equal to w-movement-fund', () => {
		expect(wp.vm.$options.name).toBe('w-movement-fund');
	});
});
