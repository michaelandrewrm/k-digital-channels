import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/equities-asset/w-asset-equities-asset';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-asset-equities-asset.vue', () => {
	let wp;
	let router;
	const fixture = {
		id: 'equity-asset-1',
		name: 'equity-asset',
		totalValue: { amount: 123.45, currency: { id: 'EUR' } },
		unityQuantity: 123.456,
	};

	beforeEach(() => {
		const { localRouter } = newInstance;

		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			router,
			propsData: {
				productId: 'product-id',
				source: fixture,
				productFamily: 'managed-equities-asset',
			},
		});
	});

	it('has a name equal to w-asset-equities-asset', () => {
		expect(wp.vm.$options.name).toBe('w-asset-equities-asset');
	});

	it('should navigate to product detail', async () => {
		const push = jest.spyOn(router, 'push');

		await wp.trigger('click');

		expect(push).toHaveBeenCalledWith({
			name: 'product-detail',
			params: {
				familyId: 'managed-equities-asset',
				productId: 'product-id/assets/equity-asset-1',
				productType: 'equities-asset',
			},
		});
	});
});
