import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-transfer-field-helper-text';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-transfer-field-helper-text.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			sync: false,
		});
	});

	it('has a name equal to c-transfer-field-helper-text', () => {
		expect(wp.vm.$options.name).toBe('c-transfer-field-helper-text');
	});

	it('should add a --persistent class', async () => {
		await wp.setProps({
			persistent: true,
		});
		expect(wp.find('.c-transfer-field-helper-text.--persistent').exists()).toBeTruthy();
	});

	it('should add a helper suffix', async () => {
		await wp.setProps({
			for: 'id',
		});

		expect(wp.find('[id="id-helper"]').exists()).toBeTruthy();
	});
});
