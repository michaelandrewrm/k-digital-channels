import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-button-copy-to-clipboard';
import flushPromises from 'flush-promises';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-button-copy-to-clipboard.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		const open = jest.fn().mockResolvedValue();

		store.mockModule('notification', { open });

		wp = shallowMount(Component, {
			localVue,
			store,
			stubs: { CIconButton: CButton },
			propsData: { copyText: 'copiado', copyTitle: 'Documento' },
		});
	});

	it('has a name equal to c-button-copy-to-clipboard', () => {
		expect(wp.vm.$options.name).toBe('c-button-copy-to-clipboard');
	});

	it('shows a notification after copy a text', async () => {
		await wp.trigger('click');
		await flushPromises();

		expect(store.mockedActions['notification/open']).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				text: 'Documento copiado en el portapapeles.',
			})
		);
	});
});
