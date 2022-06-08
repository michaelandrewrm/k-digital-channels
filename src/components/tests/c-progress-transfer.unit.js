import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-progress-transfer';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-progress-transfer.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
			propsData: {
				step: 1,
			},
			sync: false,
		});
	});

	it('has a name equal to c-progress-transfer', () => {
		expect(shallowWrapper.vm.$options.name).toBe('c-progress-transfer');
	});

	it('sets progress', () => {
		const progressUnit = 100 / 3;
		const progress = shallowWrapper.vm.step * progressUnit;
		expect(shallowWrapper.vm.progress).toBe(progress);
		expect(shallowWrapper.attributes().style).toBe(`--progress: ${progress};`);
	});
});
