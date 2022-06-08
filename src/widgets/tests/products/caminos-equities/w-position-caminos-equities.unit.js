import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/caminos-equities/w-position-caminos-equities';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const source = {
	totalValue: {
		amount: 123.45,
		currency: { id: 'EUR', code: '978' },
	},
	unityQuantity: 80.234,
	unityValue: {
		amount: 123.45,
		currency: { id: 'EUR', code: '978' },
	},
	lastValueDate: new Date(),
};

describe('w-position-caminos-equities.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: { source },
		});
	});

	it('has a name equal to w-position-caminos-equities', () => {
		expect(wp.vm.$options.name).toBe('w-position-caminos-equities');
	});
});
