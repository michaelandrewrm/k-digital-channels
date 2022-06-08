import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import component from '@views/v-product-detail.vue';
import accounts from '@tests/fixtures/products/accounts';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-product-detail.vue', () => {
	let wp;
	let store;
	let router;

	const fixture = accounts[0];
	const LViewModal = {
		template: `
			<div>
				<h1><slot name="header" /></h1>
				<h2><slot name="subheader" /></h2>
				<slot />
			</div>
		`,
	};

	const getDetails = jest.fn().mockResolvedValue(fixture);
	const get = jest.fn().mockResolvedValue({ ...fixture, profiles: [], productFamily: 'account' });
	const open = jest.fn().mockResolvedValue('newAlias');

	beforeEach(() => {
		const { shallowStore, shallowRouter } = newInstance;
		store = shallowStore;
		router = shallowRouter;

		store.registerModule('products', { namespaced: true, actions: { getDetails, get } });
		store.mockModule('modal', { open });

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { productId: 'account-1', familyId: 'account' },
			stubs: { LViewModal },
		});
	});

	it('has a name equal to v-product-detail', () => {
		expect(wp.vm.$options.name).toBe('v-product-detail');
	});

	it('should go back when no details', async () => {
		const back = jest.spyOn(router, 'back');
		const getDetailsAction = jest.fn().mockResolvedValue();
		store.mockModule('products', { get, getDetails: getDetailsAction });

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { productId: 'account-1', familyId: 'account' },
			stubs: { LViewModal },
		});

		await flushPromises();

		expect(back).toHaveBeenCalled();
	});

	it('should go back after error', async () => {
		const back = jest.spyOn(router, 'back');
		const getDetailsAction = jest.fn().mockRejectedValue();
		store.mockModule('products', { get, getDetails: getDetailsAction });

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { productId: 'account-1', familyId: 'account' },
			stubs: { LViewModal },
		});

		await flushPromises();

		expect(back).toHaveBeenCalled();
	});

	it('should open a modal and change the alias', async () => {
		wp = shallowMount(component, {
			localVue,
			store,
			router,
			propsData: { productId: 'account-1', familyId: 'account' },
			stubs: { LViewModal, CIconButton: CButton },
		});

		await flushPromises();
		await wp.find('[data-testid="edit-alias"]').trigger('click');
		await flushPromises();

		expect(
			wp
				.find('[data-testid="alias"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe('newAlias');
	});
});
