import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-transfer-textarea';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-transfer-textarea.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
		});
	});

	it('has a name equal to c-transfer-textarea', () => {
		expect(shallowWrapper.vm.$options.name).toBe('c-transfer-textarea');
	});

	it('focus the textarea', async () => {
		shallowWrapper = shallowMount(Component, {
			localVue,
			attachTo: document.body,
			sync: false,
			propsData: { id: 'test' },
		});

		const input = shallowWrapper.findComponent({ ref: 'input' }).element;

		expect(shallowWrapper.element.ownerDocument.activeElement).not.toBe(input);
		shallowWrapper.vm.focus();
		expect(shallowWrapper.element.ownerDocument.activeElement).toBe(input);

		shallowWrapper.destroy();
	});
});
