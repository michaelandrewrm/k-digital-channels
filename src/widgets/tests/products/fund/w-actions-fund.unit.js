import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/fund/w-actions-fund';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-actions-fund.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = { id: 'fund-1', productFamily: 'fund', profiles: [] };
	const WActions = {
		template: `
			<div>
				<button
					v-for="option in options"
					:key="option.id"
					:data-testid="option.id"
					@click="option.action()"
				>{{ option.title }}</button>
			</div>
		`,
		props: ['options'],
	};

	const open = jest.fn();

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('modal', { open });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { WActions },
			propsData: { product: fixture },
		});
	});

	it('has a name equal to w-actions-fund', () => {
		expect(wp.vm.$options.name).toBe('w-actions-fund');
	});

	it('should open modal after click on operate button', async () => {
		await wp.find('[data-testid="operate"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-fund-operative' })
		);
	});

	it('should navigate to product profiles', async () => {
		await wp.find('[data-testid="product-profiles"]').trigger('click');

		expect(router.currentRoute.name).toBe('product-profiles');
		expect(router.currentRoute.params).toMatchObject({
			familyId: 'fund',
			productId: 'fund-1',
		});
	});
});
