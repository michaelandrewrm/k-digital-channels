import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-customer-online';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-customer-online.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			computed: { isBancofar: () => false },
		});
	});

	it('has a name equal to v-customer-online', () => {
		expect(wp.vm.$options.name).toBe('v-customer-online');
	});

	it('should match snapshot', () => {
		expect(wp.element).toMatchSnapshot();
	});
});
