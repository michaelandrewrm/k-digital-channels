import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/deposit/w-actions-deposit';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-actions-deposit.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = {
		id: 'deposit-1',
		productSubtype: { id: '09' },
		productFamily: 'deposit',
		profiles: [],
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

	it('has a name equal to w-actions-deposit', () => {
		expect(wp.vm.$options.name).toBe('w-actions-deposit');
	});

	it('should open modal after click on deposit button', async () => {
		await wp.find('[data-testid="deposit"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-deposit-info' })
		);
	});

	it('should emit a download document event after click on download pdf', async () => {
		await wp.find('[data-testid="download-pdf"]').trigger('click');

		expect(wp.emitted('download-document')[0][0]).toBe('pdf');
	});

	it('should emit a download document event after click on download xls', async () => {
		await wp.find('[data-testid="download-xls"]').trigger('click');

		expect(wp.emitted('download-document')[0][0]).toBe('xls');
	});

	it('should navigate to product profiles', async () => {
		await wp.find('[data-testid="product-profiles"]').trigger('click');

		expect(router.currentRoute.name).toBe('product-profiles');
		expect(router.currentRoute.params).toMatchObject({
			familyId: 'deposit',
			productId: 'deposit-1',
		});
	});
});
