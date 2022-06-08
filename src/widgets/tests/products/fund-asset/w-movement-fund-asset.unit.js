import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/fund-asset/w-movement-fund-asset.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-fund-asset.vue', () => {
	let wp;
	let router;

	beforeEach(() => {
		const { localRouter } = newInstance;

		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			router,
			propsData: {
				source: {
					id: 1234,
					reason: 'COMPRA',
					amount: { currency: { id: 'EUR' }, amount: 2000.4 },
					operationDate: '2020-01-02T00:00:00.000Z',
					effectiveValue: { currency: { id: 'EUR' }, amount: 100531.4 },
					unityQuantity: 1000,
				},
			},
		});
	});

	it('has a name equal to w-movement-fund-asset', () => {
		expect(wp.vm.$options.name).toBe('w-movement-fund-asset');
	});

	it('renders correctly', () => {
		expect(wp.element).toMatchSnapshot();
	});
});
