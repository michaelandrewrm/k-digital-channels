import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-amortize-card.vue';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-amortize-card.vue', () => {
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

	it('has a name equal to m-amortize-card', () => {
		expect(wp.vm.$options.name).toBe('m-amortize-card');
	});

	it('should navigate to sirvase efectuar page', async () => {
		const push = jest.spyOn(router, 'push');

		await wp.find('[data-testid="sirvase"]').trigger('click');

		expect(push).toHaveBeenCalledWith({
			name: 'sirvase-create',
			params: {
				description:
					'Solicitud de la amortización de operación de la tarjeta: 1234 \nEl importe a amortizar es de',
				typologyId: '13',
			},
		});
	});
});
