import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-bizum-dashboard';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-bizum-dashboard.vue', () => {
	let wp;
	let router;
	const WActions = {
		props: ['options'],
		template: `
			<div>
				<button
					:data-testid="opt.id"
					class="w-actions__btn"
					v-for="opt in options"
					:key="opt.id"
					@click="opt.action"
				>
					{{ opt.title }}
				</button>
			</div>
		`,
	};

	beforeEach(() => {
		const { localRouter } = newInstance;
		router = localRouter;

		wp = shallowMount(Component, { localVue, router, stubs: { WActions } });
	});

	it('has a name equal to v-bizum-dashboard', () => {
		expect(wp.vm.$options.name).toBe('v-bizum-dashboard');
	});

	/**
	 * Si la prop type (que se define por url) es "completed" debería
	 * mostrar el tab completed. Si es "pending" debería mostrar el
	 * tab de pending.
	 */
	it('show the active tab', async () => {
		expect(wp.find('[data-testid="tab-completed"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="tab-pending"]').exists()).toBeFalsy();

		await wp.setProps({ type: 'pending' });

		expect(wp.find('[data-testid="tab-completed"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="tab-pending"]').exists()).toBeTruthy();
	});

	/**
	 * Al hacer click en los tabs, debería navegar a la url seleccionando
	 * el tipo y eso debería mostrar el tab seleccionado. Como la vista
	 * en los tests no está relacionada con la ruta, es la única manera
	 * de probar el cambio de parámetro.
	 */
	it('change the active tab', async () => {
		await wp.find('[data-testid="tabs-nav"]').vm.$emit('select', 0);
		await flushPromises();
		await wp.setProps({ type: router.currentRoute.params.type });

		expect(wp.find('[data-testid="tab-completed"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="tab-pending"]').exists()).toBeFalsy();

		await wp.find('[data-testid="tabs-nav"]').vm.$emit('select', 1);
		await flushPromises();
		await wp.setProps({ type: router.currentRoute.params.type });

		expect(wp.find('[data-testid="tab-completed"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="tab-pending"]').exists()).toBeTruthy();
	});

	/**
	 * Si existen items pendientes, debería mostrar un puntito en el tab
	 * de pendientes.
	 */
	it('show a dot next to pending tab if it has pending items', async () => {
		await wp.setProps({ type: 'pending' });
		await wp.find('[data-testid="list-pending"]').vm.$emit('fetch', [1, 2, 3]);
	});

	/**
	 * Al hacer click en el botón de más detalles del sheet debería
	 * redirigir la página a bizum-details.
	 */
	it('go to bizum details on clicking expand on sheet ', async () => {
		await wp.find('[data-testid="sheet"]').vm.$emit('expand');
		await flushPromises();
		expect(router.currentRoute.name).toBe('bizum-details');
	});

	/**
	 * Al hacer click en el botón de ayuda en la vista
	 * redirigir la página a bizum-help.
	 */
	it('go to bizum help on clicking help icon', async () => {
		await wp.find('[data-testid="help"]').trigger('click');
		await flushPromises();
		expect(router.currentRoute.name).toBe('bizum-help');
	});

	it('go to bizum transfer after click on send money', async () => {
		const push = jest.spyOn(router, 'push');

		await wp.find('[data-testid="send-money"]').trigger('click');
		expect(push).toHaveBeenCalledWith({
			name: 'bizum-transfer',
			params: { action: 'send' },
		});
	});

	it('go to bizum transfer after click on request money', async () => {
		const push = jest.spyOn(router, 'push');

		await wp.find('[data-testid="request-money"]').trigger('click');
		expect(push).toHaveBeenCalledWith({
			name: 'bizum-transfer',
			params: { action: 'request' },
		});
	});

	it('go to bizum transfer after click on donate money', async () => {
		const push = jest.spyOn(router, 'push');

		await wp.find('[data-testid="donate-money"]').trigger('click');
		expect(push).toHaveBeenCalledWith({
			name: 'bizum-transfer',
			params: { action: 'donate' },
		});
	});
});
