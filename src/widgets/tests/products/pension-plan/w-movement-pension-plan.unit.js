import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/pension-plan/w-movement-pension-plan.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-pension-plan.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				source: {
					id: 1234,
					reason: 'COMPRA',
					amount: { currency: { id: 'EUR' }, amount: 2000.4 },
					operationDate: '2020-01-02T00:00:00.000Z',
					unityQuantity: 123,
					unityValue: { currency: { id: 'EUR' }, amount: 654.4 },
				},
			},
		});
	});

	it('has a name equal to w-movement-pension-plan', () => {
		expect(wp.vm.$options.name).toBe('w-movement-pension-plan');
	});

	it('renders correctly', () => {
		expect(wp.element).toMatchSnapshot();
	});
});
