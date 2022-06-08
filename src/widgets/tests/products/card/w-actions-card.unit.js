import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/card/w-actions-card';
import cards from '@tests/fixtures/products/cards';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-actions-card.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = {
		...cards[0],
		productFamily: 'credit-card',
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

		store.registerModule('resources', { namespaced: true, state: { hasResult: true } });
		store.mockModule('modal', { open });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { WActions },
			propsData: { product: fixture },
		});
	});

	it('has a name equal to w-actions-card', () => {
		expect(wp.vm.$options.name).toBe('w-actions-card');
	});

	it('should open a modal after click on limit change button', async () => {
		await wp.find('[data-testid="change-limit"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-change-limit' }),
				props: { productNumber: '5866 37** **** 9381' },
			})
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
			familyId: 'credit-card',
			productId: 'card-1',
		});
	});

	it('should open a modal after click on activate', async () => {
		await wp.find('[data-testid="activate"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-activate-card' }),
				props: { productNumber: '5866 37** **** 9381' },
			})
		);
	});

	it('should open a modal after click on amortize', async () => {
		await wp.find('[data-testid="amortize"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-amortize-card' }),
				props: { productNumber: '5866 37** **** 9381' },
			})
		);
	});

	it('should open a modal after click on settlement-statement', async () => {
		await wp.find('[data-testid="settlement-statement"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-request-statement' }),
				props: { productNumber: '5866 37** **** 9381' },
			})
		);
	});
});
