import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/account/w-movement-account.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-account.vue', () => {
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
					balance: { currency: { id: 'EUR' }, amount: 100531.4 },
				},
			},
		});
	});

	it('has a name equal to w-movement-account', () => {
		expect(wp.vm.$options.name).toBe('w-movement-account');
	});

	it('renders correctly', () => {
		expect(wp.element).toMatchSnapshot();
	});
});
