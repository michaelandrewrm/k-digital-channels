import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/fund-asset/w-product-fund-asset';
import fundAssets from '@tests/fixtures/products/fund-assets';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-fund-asset.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = {
		...fundAssets[0],
		productFamily: 'managed-product',
		productSubtype: { id: 'm-13' },
	};

	const CAcrylicSheet = {
		template: `
			<div class="c-acrylic-sheet">
				<div class="c-acrylic-sheet__grid">
					<div class="c-acrylic-sheet__col1">
						<span class="c-acrylic-sheet__icon">
							<slot name="icon" />
						</span>
					</div>
					<div class="c-acrylic-sheet__col2">
						<slot />
						<button
							v-if="actionable"
							class="c-acrylic-sheet__button"
							data-testid="more-info-button"
							@click="$emit('expand')"
						>
							<span aria-hidden="true">&#8942;</span>
						</button>
					</div>
				</div>
				<slot name="footer" />
			</div>
		`,
		props: ['actionable'],
	};

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { product: fixture, active: true },
			stubs: { CAcrylicSheet },
		});
	});

	it('has a name equal to w-product-fund-asset', () => {
		expect(wp.vm.$options.name).toBe('w-product-fund-asset');
	});

	it('should emit an expand event after click on more info button', () => {
		wp.find('[data-testid="more-info-button"]').trigger('click');

		expect(wp.findComponent({ name: 'c-acrylic-sheet' }).emitted('expand')).toBeTruthy();
	});

	it('opens profitability modal after click on info icon', async () => {
		const open = jest.fn().mockResolvedValue();
		store.mockModule('modal', { open });
		await wp.find('[data-testid="info-icon"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-fund-profitability' })
		);
	});

	it('should go to product details', async () => {
		const pushSpy = jest.spyOn(router, 'push');

		expect(pushSpy).not.toHaveBeenCalled();

		await wp.vm.openDetails();

		expect(pushSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'product-detail',
				params: { familyId: 'managed-fund-asset', productId: 'fund-1/assets/fund-asset-1' },
			})
		);
	});

	/* CD-3049 */
	it('shows the liquidation value with six digits', () => {
		expect(
			wp
				.find('[data-testid="liquidation-value"]')
				.text()
				.replace(/\s/g, ' ')
		).toBe('Valor liquidativo 123,456789 €');
	});
});
