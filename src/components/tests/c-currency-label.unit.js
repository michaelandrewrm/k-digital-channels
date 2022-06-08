import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-currency-label';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-currency-label.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				balance: { amount: 142.42, currency: { id: 'EUR' } },
			},
		});
	});

	it("has a name equal 'c-currency-label'", () => {
		expect(wp.vm.$options.name).toBe('c-currency-label');
	});

	it('renders corrently', () => {
		expect(wp).toMatchSnapshot();
	});
});
