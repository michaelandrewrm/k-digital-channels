import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-input-ong';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-input-ong.vue', () => {
	let wp;
	let router;

	beforeEach(() => {
		const { localRouter } = newInstance;

		router = localRouter;

		// El componente redireccionará a la vista bizum-ongs que es hija de
		// bizum-transfer; entonces, para omitir el warning del router,
		// definimos como punto de entrada el padre.
		router.push({ name: 'bizum-transfer', params: { action: 'donate' } });

		wp = shallowMount(Component, { router, localVue });
	});

	it('has a name equal to c-input-ong', () => {
		expect(wp.vm.$options.name).toBe('c-input-ong');
	});

	it('marks as invalid an invalid field', async () => {
		await wp.setProps({ valid: false });
		expect(wp.find('input').attributes('aria-invalid')).toBeTruthy();
	});

	it('focus the input', async () => {
		wp = shallowMount(Component, {
			localVue,
			attachTo: document.body,
			propsData: { id: 'test' },
		});

		const input = wp.findComponent({ ref: 'input' }).element;

		expect(wp.element.ownerDocument.activeElement).not.toBe(input);
		wp.vm.focus();
		expect(wp.element.ownerDocument.activeElement).toBe(input);
		wp.vm.blur();
		expect(wp.element.ownerDocument.activeElement).not.toBe(input);

		wp.destroy();
	});

	/**
	 * Al hacer click en el input, debería abrir una vista nueva y pasarle
	 * como parámetro un channel. Ésta responderá con un objeto ONG que
	 * pintará en el input de este componente el nombre de la ONG seleccionada.
	 */
	it('select a ONG', async () => {
		await wp.findComponent({ ref: 'input' }).trigger('click');

		router.currentRoute.params.port.postMessage({ id: '1234', name: 'Caritas' });
		await flushPromises();

		expect(wp.findComponent({ ref: 'input' }).element.value).toBe('Caritas');
	});
});
