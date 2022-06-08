import { shallowMount } from '@vue/test-utils';
import fundAssets from '@tests/fixtures/products/fund-assets';
import Component from '@widgets/products/fund-asset/w-asset-fund-asset';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-asset-fund-asset', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { localStore, localRouter } = newInstance;

		store = localStore;
		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			sync: false,
			propsData: {
				source: fundAssets[0],
				productId: 'fund-1',
				productFamily: 'fund',
			},
		});
	});

	it('has a name equal to w-asset-fund-asset', () => {
		expect(wp.vm.$options.name).toBe('w-asset-fund-asset');
	});

	it('opens profitability modal after click on info icon', async () => {
		const infoIcon = wp.find('[data-testid="info-icon"]');
		await infoIcon.trigger('click');

		expect(store.getters['modal/lastOpened']).not.toBeUndefined();
		expect(store.getters['modal/lastOpened'].component.options.name).toEqual(
			'm-fund-profitability'
		);
	});

	it('should not show the effective value when its amount is equal to zero', async () => {
		expect(wp.find('[data-testid="effective-value"]').exists()).toBeTruthy();

		await wp.setProps({
			source: {
				...fundAssets[0],
				effectiveValue: { amount: 0 },
			},
			productId: 'fund-1',
			productFamily: 'managed-product',
		});

		expect(wp.vm.familyId).toBe('managed-product');
		expect(wp.find('[data-testid="effective-value"]').exists()).toBeFalsy();
	});
});
