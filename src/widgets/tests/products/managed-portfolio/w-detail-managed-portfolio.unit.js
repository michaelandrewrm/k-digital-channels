import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/managed-portfolio/w-detail-managed-portfolio.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-detail-managed-portfolio.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				detail: {
					productNumber: {
						value: 'ES7921000813610123456789',
						format: { id: 'IBAN' },
					},
					interveners: [],
				},
				createDate: '2019-01-12',
			},
		});
	});

	it('has a name equal to w-detail-managed-portfolio', () => {
		expect(wp.vm.$options.name).toBe('w-detail-managed-portfolio');
	});
});
