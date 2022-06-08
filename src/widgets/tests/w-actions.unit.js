import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@widgets/w-actions.vue';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-actions.vue', () => {
	let wp;
	let store;

	const optionAction = jest.fn();
	const fixture = [{ id: 'option-1', title: 'option-a', action: optionAction }];

	const open = jest.fn().mockResolvedValue(true);

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('modal', { open });

		wp = shallowMount(Component, { localVue, propsData: { options: fixture }, stubs: { CButton } });
	});

	it('has a name equal to w-actions', () => {
		expect(wp.vm.$options.name).toBe('w-actions');
	});

	it('should not show the more button', () => {
		expect(wp.find('[data-testid="more-button"]').exists()).toBeFalsy();
	});

	it('should show a more button and open a modal on click', () => {
		const options = [
			{ id: 'option-1', title: 'option-a', action: () => {} },
			{ id: 'option-2', title: 'option-b', action: () => {} },
		];

		wp = shallowMount(Component, { localVue, propsData: { options }, stubs: { CButton }, store });

		const button = wp.find('[data-testid="more-button"]');
		expect(button.exists()).toBeTruthy();

		button.trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				component: expect.objectContaining({ name: 'm-options' }),
				props: { title: '¿Qué desea hacer?', options },
			})
		);
	});

	it('should execute the option action after close modal', async () => {
		const options = [
			{ id: 'option-1', title: 'option-a', action: jest.fn() },
			{ id: 'option-2', title: 'option-b', action: jest.fn() },
		];
		const openAction = jest.fn().mockResolvedValue(options[0]);

		store.mockModule('modal', { open: openAction });

		wp = shallowMount(Component, { localVue, propsData: { options }, stubs: { CButton }, store });

		await wp.find('[data-testid="more-button"]').trigger('click');
		await flushPromises();

		expect(options[0].action).toHaveBeenCalled();
	});
});
