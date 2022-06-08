import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-download-document.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-download-document.vue', () => {
	let wp;
	let channel;

	beforeEach(() => {
		channel = new window.MessageChannel();

		wp = shallowMount(Component, {
			localVue,
			propsData: {
				channel,
				extension: 'pdf',
				title: 'Listado de movimientos',
			},
		});
	});

	it('has a name equal to w-download-document', () => {
		expect(wp.vm.$options.name).toBe('w-download-document');
	});

	/**
	 * Al iniciar el componente, debe mostrar que el documento se está generando.
	 * Al recibir desde channel que el documento se ha generado, debe mostrar
	 * un botón para poder descargar el documento.
	 */
	it('should enable download button on generated document', async () => {
		expect(wp.text()).toBe('Generando documento');

		channel.port1.postMessage({
			name: 'downloaded',
			blob: new Blob([0, 1], { type: 'application/pdf' }),
		});

		await wp.vm.$nextTick();

		expect(wp.text().replace(/\s+/g, ' ')).toBe('Listado de movimientos Descargar pdf');
	});

	/**
	 * Al iniciar el componente, debe mostrar que el documento se está generando.
	 * Al recibir desde channel que el documento no se ha generado y ha ocurrido
	 * un error, debe mostrar un texto indicando que hay un error.
	 */
	it('should show an error info if generated document was wrong', async () => {
		expect(wp.text()).toBe('Generando documento');

		channel.port1.postMessage({ name: 'error' });

		await wp.vm.$nextTick();

		expect(wp.text().replace(/\s+/g, ' ')).toBe('Error al generar documento');
	});

	it('should open a new window when is not desktop', async () => {
		const open = jest.spyOn(window, 'open');

		wp = shallowMount(Component, {
			localVue,
			propsData: {
				channel,
				extension: 'pdf',
				title: 'Listado de movimientos',
			},
			computed: { isDesktop: () => false },
		});

		await wp.find('[data-testid="download"]').trigger('click');

		expect(open).toHaveBeenCalled();
	});
});
