import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/loan/w-actions-loan';
import loans from '@tests/fixtures/products/loans';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-actions-loan.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = {
		...loans[0],
		productFamily: 'loan',
		profiles: [],
		productId: 'loan-1',
	};
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
		const { shallowStore, shallowRouter } = newInstance;
		store = shallowStore;
		router = shallowRouter;

		router.addRoute({ name: 'product-profiles', path: 'product/:familyId/:productId/profiles' });
		router.addRoute({ name: 'amortization-table', path: 'amortization-table/:productId' });

		store.mockModule('modal', { open });
		store.mockModule('products', {
			getDetails: jest.fn().mockResolvedValue({
				connectedAccount: { format: { id: 'IBAN' }, value: 'ES4802340001032400716216' },
			}),
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { WActions },
			propsData: { product: fixture },
		});
	});

	it('has a name equal to w-actions-loan', () => {
		expect(wp.vm.$options.name).toBe('w-actions-loan');
	});

	it('should open a modal after click on amortize button', async () => {
		await wp.find('[data-testid="amortize"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-amortize-loan' }),
				props: { productNumber: 'ES4802340001032400716216' },
			})
		);
	});

	it('should navigate to amortize table', async () => {
		await wp.find('[data-testid="amortize-table"]').trigger('click');

		expect(router.currentRoute.name).toBe('amortization-table');
		expect(router.currentRoute.params).toMatchObject({ productId: 'loan-1' });
	});

	it('should navigate to product profiles', async () => {
		await wp.find('[data-testid="product-profiles"]').trigger('click');

		expect(router.currentRoute.name).toBe('product-profiles');
		expect(router.currentRoute.params).toMatchObject({
			familyId: 'loan',
			productId: 'loan-1',
		});
	});
});
