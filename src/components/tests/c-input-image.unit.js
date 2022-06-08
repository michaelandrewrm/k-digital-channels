import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-input-image';
import flushPromises from 'flush-promises';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-input-image.vue', () => {
	let wp;
	let store;

	const openModal = jest.fn().mockResolvedValue(true);
	const openNotification = jest.fn().mockResolvedValue(true);

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		store.mockModule('modal', { open: openModal });
		store.mockModule('notification', { open: openNotification });

		wp = shallowMount(Component, { localVue, store, stubs: { 'c-icon-button': CButton } });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to c-input-image', () => {
		expect(wp.vm.$options.name).toBe('c-input-image');
	});

	it('should open a modal', async () => {
		await wp.setProps({ value: '/image.png' });
		await wp.find('[data-testid="icon-image"]').trigger('click');

		expect(openModal).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ component: expect.objectContaining({ name: 'm-image' }) })
		);
	});

	it('should ask for confirmation after click on remove image', async () => {
		await wp.setProps({ value: '/image.png' });
		await wp.find('[data-testid="remove-file"]').trigger('click');
		await flushPromises();

		expect(openModal).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-confirm-image-deletion' })
		);

		expect(openNotification).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ text: 'Imagen eliminada' })
		);
	});
});
