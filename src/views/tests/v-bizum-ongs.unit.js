import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bizum-ongs.vue';
import flushPromises from 'flush-promises';
import WList from '@tests/stubs/w-list.stub';
import CTransferField from '@tests/stubs/c-text-field.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-bizum-ongs.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;
	});

	it('has a name equal to v-bizum-ongs', () => {
		wp = shallowMount(Component, { localVue, store, router });

		expect(wp.vm.$options.name).toBe('v-bizum-ongs');
	});

	/**
	 * Cuando WList emita el evento fetch, debería ir a pedir
	 * al servicio el listado de ongs.
	 */
	it('should fetch the ongs list', async () => {
		const getONGs = jest.fn().mockResolvedValue({ data: [{ id: '1' }, { id: '2' }] });

		store.mockModule('bizum', { getONGs });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { WList, CTransferField },
		});

		await flushPromises();

		expect(getONGs).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: { name: null },
			})
		);
	});

	/**
	 * Si el servicio falla, debería mostrar un error.
	 */
	it('should show an error when service fails', async () => {
		const getONGs = jest.fn().mockRejectedValue();

		store.mockModule('bizum', { getONGs });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { WList, CTransferField },
		});

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
	});

	/**
	 * Debería enviar al servicio el parámetro de búsqueda por ONG.
	 */
	it('search a ong by name', async () => {
		const getONGs = jest.fn().mockResolvedValue({ data: [{ id: '1' }, { id: '2' }] });

		store.mockModule('bizum', { getONGs });
		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { WList, CTransferField },
		});

		await flushPromises();

		expect(getONGs).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: { name: null },
			})
		);

		await wp.find('[data-testid="search-input"]').setValue('caritas');
		jest.advanceTimersToNextTimer();
		await flushPromises();

		expect(getONGs).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: { name: 'caritas' },
			})
		);
	});

	/**
	 * Al hacer click en una ONG debería enviar el item al puerto abierto.
	 */
	it('select a ong and send data to port', async () => {
		const getONGs = jest.fn().mockResolvedValue({ data: [{ id: '1' }, { id: '2' }] });
		const getONG = jest.fn().mockImplementation((voidStore, id) => Promise.resolve({ id }));

		store.mockModule('bizum', { getONGs, getONG });
		jest.useFakeTimers();

		const channel = new MessageChannel();
		const selectedONG = new Promise((resolve) => {
			channel.port1.onmessage = ({ data }) => {
				resolve(data);
			};
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { WList, CTransferField },
			propsData: { port: channel.port2 },
		});

		await flushPromises();
		await wp
			.findAllComponents({ name: 'w-bizum-ong' })
			.at(0)
			.trigger('click');

		const value = await selectedONG;

		expect(value).toMatchObject({ id: '1' });
	});
});
