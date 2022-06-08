import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bizum-contacts.vue';
import flushPromises from 'flush-promises';
import CTransferField from '@tests/stubs/c-text-field.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-bizum-contacts.vue', () => {
	let wp;
	let store;
	let router;
	let postMessage;

	beforeAll(() => {
		postMessage = jest
			.spyOn(window, 'postMessage')
			.mockImplementation((data, targetOrigin, ports) => {
				if (data.name === 'bridge-get-contacts') {
					ports[0].postMessage({
						addressbook: [
							{
								fullName: 'Eduardo',
								profileImage: 'data:image/png;base64,iVBORw0Kggo',
								phone: '+34657135544',
							},
							{
								fullName: 'María',
								profileImage: 'data:image/png;base64,iVBORw0Kggo',
								phone: '+34682249150',
							},
							{
								fullName: 'Ángeles',
								phone: '621 356 809',
							},
							{
								fullName: 'Roberto',
								phone: '0034748 647 895',
							},
							{
								fullName: 'Roberto',
								phone: '0034748 647 895',
							},
							{
								fullName: 'Paco',
								phone: '+5442245130',
							},
							{
								fullName: 'Geranio',
								phone: '+34 661 988 441',
							},
						],
					});
				}
			});
	});

	afterAll(() => {
		postMessage.mockRestore();
	});

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore, localRouter } = newInstance;
		store = shallowStore;
		router = localRouter;

		const getContacts = jest.fn().mockResolvedValue([{ phone: '+34682249150' }]);

		store.mockModule('bizum', { getContacts });
	});

	it('has a name equal to v-bizum-contacts', () => {
		wp = shallowMount(Component, { localVue, store, router });

		expect(wp.vm.$options.name).toBe('v-bizum-contacts');
	});

	/**
	 * Debería pintar una lista de todos los contactos. Los contactos
	 * se piden con un evento llamado 'bridge-get-contacts' que envía
	 * como parámetro un puerto al que hay que contestar con una respuesta
	 * desde la parte nativa. Se emula esa respuesta para poder hacer
	 * la prueba.
	 */
	it('should render a contact list and show a bizum icon next to it', async () => {
		wp = shallowMount(Component, { localVue, store, router });

		await wp.vm.$nextTick();

		jest.runAllTimers();

		// It's required double flushPromises 'cause
		// the postMessage mock executes another internal postMessage
		await flushPromises();
		await flushPromises();

		expect(store.mockedActions['bizum/getContacts']).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.arrayContaining([
				{ phone: '+34657135544' },
				{ phone: '+34682249150' },
				{ phone: '+34621356809' },
				{ phone: '+34748647895' },
				{ phone: '+5442245130' },
				{ phone: '+34661988441' },
			])
		);
		expect(wp.find('[data-testid="contact-list"]').element.children).toHaveLength(6);
		expect(wp.findAll('[data-testid="has-bizum-icon"]')).toHaveLength(1);
		expect(
			wp
				.findAll('[data-testid="contact"]')
				.at(0)
				.text()
		).toBe('Ángeles 621 356 809');
	});

	it('should show the phone contact list even if getContacts fails', async () => {
		const getContacts = jest.fn().mockRejectedValue();
		store.mockModule('bizum', { getContacts });

		wp = shallowMount(Component, { localVue, store, router });

		await wp.vm.$nextTick();

		jest.runAllTimers();

		await flushPromises();
		await flushPromises();

		expect(getContacts).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.arrayContaining([
				{ phone: '+34657135544' },
				{ phone: '+34682249150' },
				{ phone: '+34621356809' },
				{ phone: '+34748647895' },
				{ phone: '+5442245130' },
				{ phone: '+34661988441' },
			])
		);
		expect(wp.find('[data-testid="contact-list"]').element.children).toHaveLength(6);
		expect(wp.findAll('[data-testid="has-bizum-icon"]')).toHaveLength(0);
		expect(
			wp
				.findAll('[data-testid="contact"]')
				.at(0)
				.text()
		).toBe('Ángeles 621 356 809');
	});

	/**
	 * Debería filtrar la lista de contactos con el campo de texto
	 * que hace de buscador.
	 */
	it('should filter the contacts by an input search', async () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { CTransferField },
		});

		await wp.vm.$nextTick();

		jest.runAllTimers();

		await flushPromises();
		await flushPromises();

		// Debería filtrar los contactos repetidos, por lo que debería haber seis contactos.
		expect(wp.find('[data-testid="contact-list"]').element.children).toHaveLength(6);

		await wp.find('[data-testid="search-input"]').setValue('Mar');
		jest.advanceTimersToNextTimer(1);
		await flushPromises();

		expect(wp.find('[data-testid="contact-list"]').element.children).toHaveLength(1);
	});

	/**
	 * Sí pasamos como parámetro un puerto, al seleccionar un contacto
	 * debería enviarnos la información de ese contacto al puerto.
	 */
	it('should send the selected contact to the port', async () => {
		const channel = new MessageChannel();
		const port = channel.port2;
		const onPortResponse = new Promise((resolve) => {
			channel.port1.onmessage = ({ data }) => {
				resolve(data);
			};
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { port },
		});

		await wp.vm.$nextTick();

		jest.runAllTimers();

		await flushPromises();
		await flushPromises();

		await wp
			.findAll('[data-testid="contact"]')
			.at(0)
			.trigger('click');
		await flushPromises();

		const response = await onPortResponse;

		expect(response).toMatchObject({ name: 'Ángeles', phone: '+34621356809' });

		await wp.destroy();
	});

	/**
	 * Sí pasamos como parámetro un puerto, aún sin seleccionar ningún
	 * contacto deberíamos responder al puerto al salir de la vista.
	 */
	it('should respond to the port even if there is not a contact selected', async () => {
		const channel = new MessageChannel();
		const port = channel.port2;
		const onPortResponse = new Promise((resolve) => {
			channel.port1.onmessage = ({ data }) => {
				resolve(data);
			};
		});

		wp = shallowMount(Component, { localVue, store, router, propsData: { port } });

		await wp.vm.$nextTick();

		jest.runAllTimers();

		await flushPromises();
		await flushPromises();

		await wp.destroy();
		await flushPromises();

		const response = await onPortResponse;

		expect(response).toBeFalsy();
	});
});
