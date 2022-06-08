import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-return-receipt.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-return-receipt.vue', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		const { shallowStore, shallowRouter } = newInstance;

		store = shallowStore;
		router = shallowRouter;

		store.registerModule('app', { namespaced: true, state: { companyId: 'BC' } });

		router.addRoute({ path: '/main/sso-rsi', name: 'sso-rsi' });
		router.addRoute({ path: '/main/sirvase-create', name: 'sirvase-create' });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: {
				productNumber: '1234',
				movementId: 'movement-1',
				receiptId: 'receipt-1',
			},
			stubs: { LModal, CButton },
		});
	});

	it('has a name equal to m-return-receipt', () => {
		expect(wp.vm.$options.name).toBe('m-return-receipt');
	});

	it('should emit a close event and navigate to the extended operative', async () => {
		expect(wp.emitted().close).toBeFalsy();

		await wp.find('[data-testid="confirm-button"]').trigger('click');

		expect(wp.emitted().close).toBeTruthy();
		expect(router.currentRoute.name).toBe('sso-rsi');
	});

	it('should navigate to sirvase efectuar page', async () => {
		const push = jest.spyOn(router, 'push');

		await wp.find('[data-testid="sirvase"]').trigger('click');

		expect(push).toHaveBeenCalledWith({
			name: 'sirvase-create',
			params: {
				description:
					'Solicitud de devolución de un recibo de la cuenta: 1234 \nMovimiento: movement-1 \nRecibo: receipt-1',
				typologyId: '06',
			},
		});
	});
});
