import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/pension-plan/w-actions-pension-plan';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-actions-pension-plan.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = { id: 'pension-plan-1', productFamily: 'pension-plan', profiles: [] };
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

	it('has a name equal to w-actions-pension-plan', () => {
		expect(wp.vm.$options.name).toBe('w-actions-pension-plan');
	});

	it('should open a modal after click on limit change button', async () => {
		await wp.find('[data-testid="contribute"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-pension-plan-operative' })
		);
	});

	it('should navigate to product profiles', async () => {
		await wp.find('[data-testid="product-profiles"]').trigger('click');

		expect(router.currentRoute.name).toBe('product-profiles');
		expect(router.currentRoute.params).toMatchObject({
			familyId: 'pension-plan',
			productId: 'pension-plan-1',
		});
	});
});
