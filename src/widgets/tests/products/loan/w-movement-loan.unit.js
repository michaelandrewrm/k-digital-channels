import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/loan/w-movement-loan.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-loan.vue', () => {
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
					type: 'COMPRA',
					amount: { currency: { id: 'EUR' }, amount: 2000.4 },
					operationDate: '2020-01-02T00:00:00.000Z',
				},
			},
		});
	});

	it('has a name equal to w-movement-loan', () => {
		expect(wp.vm.$options.name).toBe('w-movement-loan');
	});

	it('renders correctly', () => {
		expect(wp.element).toMatchSnapshot();
	});
});
