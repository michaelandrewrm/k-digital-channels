import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/credit/w-actions-credit';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-actions-credit.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = { id: 'credit-1', productFamily: 'credit', profiles: [] };
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

	it('has a name equal to w-actions-credit', () => {
		expect(wp.vm.$options.name).toBe('w-actions-credit');
	});

	it('should navigate to transfer after click on transfer button', async () => {
		await wp.find('[data-testid="transfer"]').trigger('click');

		expect(router.currentRoute.name).toBe('transfer');
		expect(router.currentRoute.params).toMatchObject({ action: 'new' });
		expect(router.currentRoute.query).toMatchObject({ origin: 'credit-1' });
	});

	it('should navigate to my transfers after click on my transfers button', async () => {
		await wp.find('[data-testid="my-transfers"]').trigger('click');

		expect(router.currentRoute.name).toBe('my-transfers');
		expect(router.currentRoute.params).toMatchObject({ productId: 'credit-1' });
	});

	it('should navigate to product profiles', async () => {
		await wp.find('[data-testid="product-profiles"]').trigger('click');

		expect(router.currentRoute.name).toBe('product-profiles');
		expect(router.currentRoute.params).toMatchObject({
			familyId: 'credit',
			productId: 'credit-1',
		});
	});
});
