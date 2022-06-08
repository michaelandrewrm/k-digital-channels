import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/deposit/w-imposition-deposit.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const fixture = {
	id: 'imposition-1',
	reason: 'Imposition',
	impositionAmount: { currency: { id: 'EUR' }, amount: 123.45 },
	creationDate: '2020-01-02',
	state: { name: 'VIVA' },
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
			propsData: { source: fixture },
		});
	});

	it('has a name equal to w-imposition-deposit', () => {
		expect(wp.vm.$options.name).toBe('w-imposition-deposit');
	});

	it('renders correctly', () => {
		expect(wp.text().replace(/\s+/g, ' ')).toBe('Imposition 123,45 € 2/1/2020 VIVA');
	});
});
