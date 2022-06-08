import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-operation-success';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-operation-success.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it('has a name equal to c-operation-success', () => {
		expect(wp.vm.$options.name).toBe('c-operation-success');
	});
});
