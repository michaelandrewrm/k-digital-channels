import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-translide';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-translide.vue', () => {
	it('has a name equal to c-translide', () => {
		const wp = shallowMount(Component, {
			localVue,
			sync: false,
		});
		expect(wp.vm.$options.name).toBe('c-translide');
	});

	it('should render with slide class as default', async () => {
		const wp = shallowMount(Component, {
			localVue,
			sync: false,
		});

		expect(wp.attributes('name')).toBe('slide');
	});

	it('should render with slide-immediate class', async () => {
		const wp = shallowMount(Component, {
			localVue,
			sync: false,
		});

		await wp.setProps({ immediate: true });
		expect(wp.attributes('name')).toBe('slide-immediate');
	});
});
