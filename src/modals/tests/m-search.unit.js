import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-search.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-search.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it('has a name equal to m-search', () => {
		expect(wp.vm.$options.name).toBe('m-search');
	});

	it('emits event close', () => {
		wp.findComponent({ name: 'w-search' }).vm.$emit('close');
		expect(wp.emitted().close).toBeTruthy();
	});
});
