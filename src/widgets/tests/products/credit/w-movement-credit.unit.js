import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/credit/w-movement-credit.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-credit.vue', () => {
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
					id: 'movement-1',
					reason: '',
					amount: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
					operationDate: '2020-01-02',
					balance: { amount: 123.45, currency: { code: '978', id: 'EUR' } },
				},
			},
		});
	});

	it('has a name equal to w-movement-credit', () => {
		expect(wp.vm.$options.name).toBe('w-movement-credit');
	});

	it('renders correctly', () => {
		expect(wp.element).toMatchSnapshot();
	});
});
