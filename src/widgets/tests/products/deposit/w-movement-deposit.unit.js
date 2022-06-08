import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/deposit/w-movement-deposit.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const source = {
	id: 1234,
	reason: 'COMPRA',
	amount: { currency: { id: 'EUR' }, amount: 2000.4 },
	operationDate: '2020-01-02T00:00:00.000Z',
	balance: { currency: { id: 'EUR' }, amount: 100531.4 },
};

describe('w-movement-deposit.vue', () => {
	let wp;
	let router;

	beforeEach(() => {
		const { localRouter } = newInstance;

		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			router,
			propsData: {
				source,
			},
		});
	});

	it('has a name equal to w-movement-deposit', () => {
		expect(wp.vm.$options.name).toBe('w-movement-deposit');
	});

	it('renders correctly', () => {
		expect(wp.element).toMatchSnapshot();
	});

	it('returns imposition string after receive state', () => {
		wp.setProps({
			source: {
				...source,
				state: true,
			},
		});
		expect(wp.vm.movementDetailRouteTarget).toEqual('imposition');
	});
});
