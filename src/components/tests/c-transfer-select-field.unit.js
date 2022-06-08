import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-transfer-select-field';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-transfer-select-field.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it('has a name equal to c-transfer-select-field', () => {
		expect(wp.vm.$options.name).toBe('c-transfer-select-field');
	});

	it('render a select form field', async () => {
		await wp.setProps({
			options: [{ id: 1, label: 'one' }, { id: 2, label: 'two' }, { id: 3, label: 'three' }],
			value: 3,
		});

		const select = wp.findComponent({ ref: 'input' });
		const options = select.findAll('option');
		const id = select.attributes('id');

		expect(wp.find(`label[for=${id}]`).text()).toBe('three');

		await options.at(2).setSelected();

		expect(wp.emitted().change[0]).toEqual(['2']);
	});

	it('should focus the field', () => {
		wp = shallowMount(Component, { localVue, attachTo: document.body });

		const input = wp.findComponent({ ref: 'input' }).element;

		expect(wp.element.ownerDocument.activeElement).not.toBe(input);
		wp.vm.focus();
		expect(wp.element.ownerDocument.activeElement).toBe(input);

		wp.destroy();
	});
});
