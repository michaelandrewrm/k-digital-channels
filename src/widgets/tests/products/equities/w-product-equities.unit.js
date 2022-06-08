import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/equities/w-product-equities.vue';
import equities from '@tests/fixtures/products/equities';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-equities.vue', () => {
	let wp;

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
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				product: equities[0],
				active: true,
			},
			stubs: { CAcrylicSheet },
			sync: false,
		});
	});

	it('has a name equal to w-product-equities', () => {
		expect(wp.vm.$options.name).toBe('w-product-equities');
	});

	it('should emit an expand event after click on more info button', () => {
		wp.find('[data-testid="more-info-button"]').trigger('click');

		expect(wp.findComponent({ name: 'c-acrylic-sheet' }).emitted('expand')).toBeTruthy();
	});
});
