import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@widgets/products/loan/w-product-loan.vue';
import loans from '@tests/fixtures/products/loans';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const CAcrylicSheet = {
	template: `
		<div class="c-acrylic-sheet">
			<slot name="icon" />
			<slot />
			<button
				v-if="actionable"
				class="c-acrylic-sheet__button"
				data-testid="more-info-button"
				@click="$emit('expand')"
			>
				<span aria-hidden="true">&#8942;</span>
			</button>
			<slot name="footer" />
		</div>
	`,
	props: ['actionable'],
};

describe('w-product-loan.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('resources', { fetch: jest.fn().mockResolvedValue({ data: [] }) });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { product: loans[0], active: true, familyId: 'loan' },
			stubs: { CAcrylicSheet },
		});
	});

	it('has a name equal to w-product-loan', () => {
		expect(wp.vm.$options.name).toBe('w-product-loan');
	});

	it('should emit an expand event after click on more info button', async () => {
		await wp.find('[data-testid="more-info-button"]').trigger('click');
		expect(wp.findComponent({ name: 'c-acrylic-sheet' }).emitted('expand')).toBeTruthy();
	});

	it('should show snackbar when pending fees', async () => {
		const fetch = jest.fn().mockResolvedValue({
			data: [
				{
					pendingAmount: { amount: 123.45, currency: { id: 'EUR' } },
				},
			],
		});
		store.mockModule('resources', { fetch });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { product: loans[0], active: true, familyId: 'loan' },
			stubs: { CAcrylicSheet },
		});

		await flushPromises();

		expect(wp.find('[data-testid="pending-fees"]').exists()).toBeTruthy();
	});

	it('should render correctly', () => {
		expect(
			wp
				.findComponent({ name: 'c-acrylic-sheet' })
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Mi préstamo plus 123,45 € Pendiente ***** ***** 0314 ⋮');
	});
});
