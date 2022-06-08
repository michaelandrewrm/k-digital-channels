import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/fund/w-detail-fund';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-detail-fund.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				detail: {
					connectedAccount: { value: '', format: '' },
					interveners: [],
				},
			},
		});
	});

	it('has a name equal to w-detail-fund', () => {
		expect(wp.vm.$options.name).toBe('w-detail-fund');
	});
});
