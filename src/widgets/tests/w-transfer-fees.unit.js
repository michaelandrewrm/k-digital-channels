import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-fees.vue';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const model = {
	origin: { balance: { amount: 200, currency: { id: 'EUR' } } },
	fees: {
		fee: { amount: 0.6, currency: { id: 'EUR' } },
		expense: { amount: 0, currency: { id: 'EUR' } },
		total: { amount: 20, currency: { id: 'EUR' } },
	},
};

describe('w-transfer-fees.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { model },
			stubs: { CButton },
		});
	});

	it('has a name equal to w-transfer-fees', () => {
		expect(wp.vm.$options.name).toBe('w-transfer-fees');
	});

	it('submits the form with updated values', async () => {
		await wp.find('[data-testid="radio-sha"]').trigger('click');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.emitted()['update:model']).toBeTruthy();
		expect(wp.emitted()['update:model'][1][0]).toMatchObject({
			fees: model.fees,
			chargeBearer: 'SHA',
		});
	});

	it('should show an error if transfer plus fees exceeds balance', async () => {
		expect(wp.find('[data-testid="error-balance"]').exists()).toBeFalsy();

		wp.vm.model.fees.total.amount = 201;
		await localVue.nextTick();

		expect(wp.find('[data-testid="error-balance"]').exists()).toBeTruthy();
	});

	/**
	 * Al hacer click en el icono de info debería abrir el modal de información
	 */
	it('should open modal info', async () => {
		const open = jest.fn().mockResolvedValue();

		store.mockModule('modal', { open });

		wp = await shallowMount(Component, {
			localVue,
			store,
			propsData: { model },
			stubs: { CButton },
		});

		await wp.find('[data-testid="iban-info"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ name: 'm-transfer-fees-info' })
		);
	});
});
