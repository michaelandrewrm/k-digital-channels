import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/card/w-product-card.vue';
import cards from '@tests/fixtures/products/cards';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-card.vue', () => {
	let wp;

	const CSkeuomorphicCard = {
		template: `
			<div class="c-skeuomorphic-card">
				<div class="c-skeuomorphic-card__title text-fixed-m-medium">{{ title }}</div>
				<div class="c-skeuomorphic-card__value text-fixed-l-bold">{{ value }}</div>
				<div class="c-skeuomorphic-card__sub-title text-fixed-s-medium">{{ subTitle }}</div>
				<div class="c-skeuomorphic-card__product-id text-s-book" v-if="productNumber">
					<span class="a11y-hide">
						{{ $t('PRODUCT_NUMBER_ENDED_IN', { productNumber: productNumber.value }) }}
					</span>
					<span aria-hidden="true">{{ $pn(productNumber) }}</span>
				</div>
				<button
					v-if="actionable"
					class="c-skeuomorphic-card__button"
					@click="$emit('expand')"
					data-testid="more-info-button"
				>
					<span aria-hidden="true">&#8942;</span>
				</button>
			</div>
		`,
		props: ['title', 'value', 'subTitle', 'productNumber', 'actionable'],
	};

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				product: cards[0],
				active: true,
			},
			stubs: { CSkeuomorphicCard },
			sync: false,
		});
	});

	it('has a name equal to w-product-card', () => {
		expect(wp.vm.$options.name).toBe('w-product-card');
	});

	it('should emit an expand event after click on more info button', () => {
		wp.find('[data-testid="more-info-button"]').trigger('click');

		expect(wp.findComponent({ name: 'c-skeuomorphic-card' }).emitted('expand')).toBeTruthy();
	});
});
