import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-bizum-movements.vue';
import flushPromises from 'flush-promises';
import WList from '@tests/stubs/w-list.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-bizum-movements.vue', () => {
	let wp;
	let store;
	let router;

	const SENT = { name: 'SENT' };
	const RECEIVED = { name: 'RECEIVED' };
	const SENT_ECOM = { name: 'SENT-ECOM' };

	const COMPLETED = { name: 'COMPLETED' };
	const PENDING = { name: 'PENDING' };

	const item1 = { id: '1', type: SENT, status: COMPLETED };
	const item2 = { id: '2', type: RECEIVED, status: COMPLETED };
	const item3 = { id: '3', type: SENT_ECOM, status: PENDING, signatureId: '31337' };
	const item4 = { id: '4', type: SENT_ECOM, status: COMPLETED, signatureId: '99669' };

	beforeEach(() => {
		const { shallowStore, shallowRouter } = newInstance;

		store = shallowStore;
		router = shallowRouter;

		router.addRoute({ name: 'bizum-movement', path: '/bizum-movement/:movementId' });
		router.addRoute({ name: 'signature-detail', path: '/signature-detail/:type/:signatureId' });
	});

	it("has a name equal 'w-bizum-movements'", () => {
		wp = shallowMount(Component, { localVue, store, router, propsData: { status: 'completed' } });

		expect(wp.vm.$options.name).toBe('w-bizum-movements');
	});

	/**
	 * Cuando WList emita el evento fetch, debería ir a pedir
	 * al servicio los movimientos disponibles.
	 */
	it('should fetch the movements', async () => {
		const getMovements = jest.fn().mockResolvedValue({ data: [item1, item2, item3, item4] });

		store.mockModule('bizum', { getMovements });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { status: 'completed' },
			stubs: { WList },
		});

		await flushPromises();

		expect(getMovements).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				status: 'completed',
			})
		);

		await wp
			.findAll('[data-testid="list"] [status="completed"]')
			.at(0)
			.trigger('click');

		expect(router.history.current.name).toBe('bizum-movement');
		expect(router.history.current.params).toMatchObject({
			movementId: '1',
		});
	});

	/**
	 * Al hacer click en un movimiento del tipo SENT-ECOM en estado pendiente
	 * debería redirigir a la vista de signature-detail.
	 */
	it('should redirect to signature-detail when is a SENT-ECOM type movement', async () => {
		const getMovements = jest.fn().mockResolvedValue({
			data: [item1, item2, item3, item4],
			paging: { hasMorePages: true, paginationKey: 'aabb322133a' },
		});

		store.mockModule('bizum', { getMovements });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { status: 'pending' },
			stubs: { WList },
		});

		await flushPromises();

		expect(getMovements).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				status: 'pending',
			})
		);

		await wp
			.findAll('[data-testid="list"] [status="pending"]')
			.at(2)
			.trigger('click');

		expect(router.history.current.name).toBe('signature-detail');
		expect(router.history.current.params).toMatchObject({
			type: 'pending',
			signatureId: '31337',
		});
	});

	/**
	 * Si el servicio falla, deberia mostrar un error.
	 */
	it('should show an error when service fails', async () => {
		const getMovements = jest.fn().mockRejectedValue();

		store.mockModule('bizum', { getMovements });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { status: 'completed' },
			stubs: { WList },
		});

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="list"]').exists()).toBeFalsy();
	});
});
