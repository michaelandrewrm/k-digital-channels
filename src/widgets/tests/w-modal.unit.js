import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-modal.vue';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('WModal.vue', () => {
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		const close = jest
			.fn()
			.mockImplementation(
				({ commit, state }, { id = Object.keys(state.queue).slice(-1)[0] } = {}) =>
					commit('remove', id)
			);
		const open = jest.fn().mockImplementation(({ commit }, data) => commit('add', data));

		let i = 0;

		store.registerModule('modal', {
			namespaced: true,
			state() {
				return { queue: {} };
			},
			mutations: {
				add(state, data) {
					state.queue[i] = data;
					state.queue = { ...state.queue };
					i += 1;
				},
				remove(state, id) {
					delete state.queue[id];
					state.queue = { ...state.queue };
				},
			},
			getters: {
				lastOpened({ queue }) {
					return queue[Object.keys(queue).slice(-1)[0]];
				},
			},
			actions: { open, close },
		});
	});

	it('has a name equal to w-modal', () => {
		const wp = shallowMount(Component, { localVue, store });
		expect(wp.vm.$options.name).toBe('w-modal');
	});

	/**
	 * Debería pintarse el último modal del store. Si hay uno, debería
	 * pintarse solo uno.
	 */
	it('should render the last modal opened', async () => {
		const modal1 = { name: 'modal-1', template: '<div data-modal="1" />' };
		await store.dispatch('modal/open', { component: 'modal-1', layer: 1 });

		const wp = shallowMount(Component, { localVue, store, stubs: { modal1 } });

		expect(wp.element.childElementCount).toBe(1);
		expect(wp.find('[data-modal="1"]').exists()).toBeTruthy();
	});

	/**
	 * Debería pintarse el último modal del store. Si hay dos, debería
	 * pintarse solo el último.
	 */
	it('should render the last modal opened when there are two modal', async () => {
		const modal1 = { name: 'modal-1', template: '<div data-modal="1" />' };
		const modal2 = { name: 'modal-2', template: '<div data-modal="2" />' };

		await store.dispatch('modal/open', { component: 'modal-1', layer: 1 });
		await store.dispatch('modal/open', { component: 'modal-2', layer: 1 });

		const wp = shallowMount(Component, { localVue, store, stubs: { modal1, modal2 } });

		expect(wp.element.childElementCount).toBe(1);
		expect(wp.find('[data-modal="1"]').exists()).toBeFalsy();
		expect(wp.find('[data-modal="2"]').exists()).toBeTruthy();
	});

	/**
	 * Debería pintarse el último modal del store para cada capa. Si hay
	 * dos capas, y cada capa tiene un modal, deberían pintarse los dos
	 * modales, uno encima del otro.
	 */
	it('should render a modal of each layer', async () => {
		const modal1 = { name: 'modal-1', template: '<div data-modal="1" />' };
		const modal2 = { name: 'modal-2', template: '<div data-modal="2" />' };

		await store.dispatch('modal/open', { component: 'modal-1', layer: 0 });
		await store.dispatch('modal/open', { component: 'modal-2', layer: 1 });

		const wp = shallowMount(Component, { localVue, store, stubs: { modal1, modal2 } });

		expect(wp.element.childElementCount).toBe(2);
		expect(wp.find('[data-modal="1"]').exists()).toBeTruthy();
		expect(wp.find('[data-modal="2"]').exists()).toBeTruthy();
	});

	/**
	 * Debería pintarse el último modal del store para cada capa. Si hay
	 * dos capas, y cada capa tiene dos modales, deberían pintarse los dos
	 * últimos modales de cada capa, uno encima del otro.
	 */
	it('should render the last modal of each layer', async () => {
		const modal1 = { name: 'modal-1', template: '<div data-modal="1" />' };
		const modal2 = { name: 'modal-2', template: '<div data-modal="2" />' };
		const modal3 = { name: 'modal-3', template: '<div data-modal="3" />' };
		const modal4 = { name: 'modal-4', template: '<div data-modal="4" />' };

		await store.dispatch('modal/open', { component: 'modal-1', layer: 0 });
		await store.dispatch('modal/open', { component: 'modal-2', layer: 0 });
		await store.dispatch('modal/open', { component: 'modal-3', layer: 1 });
		await store.dispatch('modal/open', { component: 'modal-4', layer: 1 });

		const wp = shallowMount(Component, {
			localVue,
			store,
			stubs: { modal1, modal2, modal3, modal4 },
		});

		expect(wp.element.childElementCount).toBe(2);
		expect(wp.find('[data-modal="1"]').exists()).toBeFalsy();
		expect(wp.find('[data-modal="2"]').exists()).toBeTruthy();
		expect(wp.find('[data-modal="3"]').exists()).toBeFalsy();
		expect(wp.find('[data-modal="4"]').exists()).toBeTruthy();
	});

	/**
	 * Debería dejar de pintar un modal de una capa que ha emitido
	 * el evento 'close'. Si hay otros modales en otras capas, esos
	 * deberían seguir pintandose.
	 */
	it('should stop rendering a modal when it has emmited the close event', async () => {
		const modal1 = { name: 'modal-1', template: '<div data-modal="1" />' };
		const modal2 = { name: 'modal-2', template: '<div data-modal="2" />' };

		await store.dispatch('modal/open', { component: 'modal-1', layer: 0 });
		await store.dispatch('modal/open', { component: 'modal-2', layer: 1 });

		const wp = shallowMount(Component, { localVue, store, stubs: { modal1, modal2 } });

		expect(wp.element.childElementCount).toBe(2);

		await wp.find('[data-modal="2"]').trigger('close');
		await flushPromises();

		expect(wp.element.childElementCount).toBe(1);
		expect(wp.find('[data-modal="1"]').exists()).toBeTruthy();
		expect(wp.find('[data-modal="2"]').exists()).toBeFalsy();
	});

	/**
	 * Cuando un modal está pintado, debería ponerse el foco sobre el primer
	 * elemento focusable del modal. Cuando un modal se deja de pintar, debería
	 * devolver el focus al elemento que lo tenía antes de abrir el modal.
	 */
	it('should manage focus when a modal is rendered and when is not', async () => {
		const modal1 = {
			name: 'modal-1',
			template: '<div data-modal="1"><button id="button1"/></div>',
		};

		const element = document.createElement('div');
		element.setAttribute('tabindex', '-1');
		document.body.appendChild(element);
		element.focus();

		const wrapper = document.createElement('div');
		document.body.appendChild(wrapper);

		const wp = shallowMount(Component, {
			localVue,
			store,
			attachTo: wrapper,
			stubs: { modal1 },
		});

		expect(wp.element.ownerDocument.activeElement).toStrictEqual(element);

		await store.dispatch('modal/open', { component: 'modal-1', layer: 0 });
		await flushPromises();

		expect(wp.element.ownerDocument.activeElement).not.toStrictEqual(element);
		expect(wp.element.ownerDocument.activeElement).toHaveAttribute('id', 'button1');

		await store.dispatch('modal/close');
		await flushPromises();

		expect(wp.element.ownerDocument.activeElement).toBe(element);

		await wp.destroy();
		wrapper.remove();
	});

	/**
	 * Cuando el foco está en el último elemento dentro de un modal, al presionar
	 * la tecla TAB debería redirigir el foco al primer elemento dentro del modal.
	 * Si el foco está en el primer elemento del modal, al presionar las teclas
	 * TAB + SHIFT debería redirigir el foco al último elemento dentro del modal.
	 */
	it('is accesible and user can navigate with the TAB key', async () => {
		const modal1 = {
			name: 'modal-1',
			template: '<div data-modal="1"><button id="button1"/><button id="button2"/></div>',
		};
		const modal2 = {
			name: 'modal-2',
			template: '<div data-modal="2"><button id="button3"/><button id="button4"/></div>',
		};

		const wrapper = document.createElement('div');
		document.body.appendChild(wrapper);

		const wp = shallowMount(Component, {
			localVue,
			store,
			attachTo: wrapper,
			stubs: { modal1, modal2 },
		});

		await store.dispatch('modal/open', { component: 'modal-1', layer: 0 });
		await store.dispatch('modal/open', { component: 'modal-2', layer: 0 });
		await flushPromises();

		expect(wp.element.ownerDocument.activeElement).toHaveAttribute('id', 'button3');

		wp.element.querySelector('#button4').focus();
		expect(wp.element.ownerDocument.activeElement).toHaveAttribute('id', 'button4');

		await wp.find('[data-modal="2"]').trigger('keydown.tab');
		await flushPromises();

		expect(wp.element.ownerDocument.activeElement).toHaveAttribute('id', 'button3');

		await wp.find('[data-modal="2"]').trigger('keydown.tab', { shiftKey: true });
		await flushPromises();

		expect(wp.element.ownerDocument.activeElement).toHaveAttribute('id', 'button4');

		await wp.destroy();
		wrapper.remove();
	});
});
