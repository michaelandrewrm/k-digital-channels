import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@widgets/products/account/w-product-account.vue';
import accounts from '@tests/fixtures/products/accounts';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-account.vue', () => {
	let wp;
	let store;

	const fixture = {
		id: 'withholding-1',
		reason: 'Traspaso',
		amount: { amount: -123.45, currency: { id: 'EUR', code: '978' } },
		operationDate: '2021-01-11',
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

	const open = jest.fn();
	const fetch = jest.fn().mockResolvedValue({ data: [fixture] });

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		store.registerModule('app', { namespaced: true, state: { companyId: 'BF' } });
		store.mockModule('modal', { open });
		store.mockModule('resources', { fetch });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { product: accounts[0], active: true },
			stubs: { CAcrylicSheet },
			sync: false,
		});
	});

	it('has a name equal to w-product-account', () => {
		expect(wp.vm.$options.name).toBe('w-product-account');
	});

	it('should emit an expand event after click on more info button', () => {
		wp.find('[data-testid="more-info-button"]').trigger('click');

		expect(wp.findComponent({ name: 'c-acrylic-sheet' }).emitted('expand')).toBeTruthy();
	});

	it('should open modal after click on info icon', () => {
		wp.find('[data-testid="info-icon"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				name: 'm-available-balance',
			})
		);
	});

	it('should show withholdings', async () => {
		await flushPromises();

		expect(wp.find('[data-testid="withholdings"]').exists()).toBeTruthy();
		expect(
			wp
				.find('[data-testid="withholdings"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('Tiene un próximo movimiento');
	});
});
