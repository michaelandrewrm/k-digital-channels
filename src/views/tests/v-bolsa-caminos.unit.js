import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bolsa-caminos.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-bolsa-caminos.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;
	});

	it('has a name equal to v-bolsa-caminos', () => {
		const ssoBolsaCaminos = jest.fn().mockRejectedValue();
		const open = jest.fn().mockResolvedValue();

		store.mockModule('user', { ssoBolsaCaminos });
		store.mockModule('modal', { open });

		wp = shallowMount(Component, { localVue, store, router });

		expect(wp.vm.$options.name).toBe('v-bolsa-caminos');
	});

	it('should open the iframe and set sso session on it', async () => {
		const fixture = { data: { url: 'localhost' } };
		const ssoBolsaCaminos = jest.fn().mockResolvedValue(fixture);
		const open = jest.fn().mockResolvedValue();

		store.mockModule('user', { ssoBolsaCaminos });
		store.mockModule('modal', { open });

		wp = shallowMount(Component, { localVue, store, router });
		await flushPromises();

		const iframe = wp.findComponent({ ref: 'iframe' });

		expect(iframe.exists()).toBeTruthy();
		expect(iframe.attributes('src')).toBe('localhost');

		// el iframe aún no es visible
		expect(iframe.element).not.toHaveClass('--is-active');

		iframe.element.dispatchEvent(new Event('load'));
		await localVue.nextTick();

		// el iframe ahora es visible
		expect(iframe.element).toHaveClass('--is-active');

		wp.destroy();
	});

	it('should open a modal error when service sso fails', async () => {
		const ssoBolsaCaminos = jest.fn().mockRejectedValue();
		const open = jest.fn().mockResolvedValue();

		store.mockModule('user', { ssoBolsaCaminos });
		store.mockModule('modal', { open });

		wp = shallowMount(Component, { localVue, store, router });
		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-something-wrong' })
		);
	});

	it('should open a modal error on timeout', async () => {
		const fixture = { data: { url: 'localhost' } };
		const ssoBolsaCaminos = jest.fn().mockResolvedValue(fixture);
		const open = jest.fn().mockResolvedValue(true);

		store.mockModule('user', { ssoBolsaCaminos });
		store.mockModule('modal', { open });

		wp = shallowMount(Component, { localVue, store, router });
		await flushPromises();

		const iframe = wp.findComponent({ ref: 'iframe' });

		expect(iframe.exists()).toBeTruthy();

		jest.runAllTimers();

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-something-wrong' })
		);
	});
});
