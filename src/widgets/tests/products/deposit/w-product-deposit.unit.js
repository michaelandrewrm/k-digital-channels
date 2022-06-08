import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/deposit/w-product-deposit.vue';
import deposits from '@tests/fixtures/products/deposits';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-deposit.vue', () => {
	let wp;
	let store;

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

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		store.mockModule('modal', { open });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: {
				product: deposits[2],
				active: true,
			},
			stubs: { CAcrylicSheet },
			sync: false,
		});
	});

	it('has a name equal to w-product-deposit', () => {
		expect(wp.vm.$options.name).toBe('w-product-deposit');
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
});
