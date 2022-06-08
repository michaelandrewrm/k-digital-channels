import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-request-statement.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-request-statement.vue', () => {
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
			propsData: { productNumber: '1234' },
			stubs: { LModal, CButton },
		});
	});

	it('has a name equal to m-request-statement', () => {
		expect(wp.vm.$options.name).toBe('m-request-statement');
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
				description: 'Solicitud de extracto de liquidación de la tarjeta: 1234 \ndel mes',
				typologyId: '13',
			},
		});
	});
});
