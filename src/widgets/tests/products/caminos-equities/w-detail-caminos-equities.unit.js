import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/caminos-equities/w-detail-caminos-equities';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const detail = {
	connectedAccount: { value: '4321', format: 'IBAN' },
	interveners: [],
	unityQuantity: 100,
	totalValue: { amount: 1880, currency: { id: 'EUR' } },
	unityValue: { amount: 15.5, currency: { id: 'EUR' } },
	effectiveUnityValue: { amount: 18.8, currency: { id: 'EUR' } },
	lastValueDate: new Date('2020-09-29'),
	createDate: new Date('2020-09-29'),
};

describe('w-detail-caminos-equities.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: { detail },
		});
	});

	it('has a name equal to w-detail-caminos-equities', () => {
		expect(wp.vm.$options.name).toBe('w-detail-caminos-equities');
	});

	it('renders correctly', () => {
		expect(wp.element).toMatchSnapshot();
	});
});
