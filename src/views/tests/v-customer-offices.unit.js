import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-customer-offices';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-customer-offices.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			computed: { isBancofar: () => false },
		});
	});

	it('has a name equal to v-customer-offices', () => {
		expect(wp.vm.$options.name).toBe('v-customer-offices');
	});

	it('should match snapshot', () => {
		expect(wp.element).toMatchSnapshot();
	});

	it('should match snapshot when BF', () => {
		wp = shallowMount(Component, {
			localVue,
			computed: { isBancofar: () => true },
		});

		expect(wp.element).toMatchSnapshot();
	});
});
