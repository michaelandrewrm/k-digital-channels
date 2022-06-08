import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/deposit/w-movement-detail-deposit.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-detail-deposit.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {},
			},
		});
	});

	it('has a name equal to w-movement-detail-deposit', () => {
		expect(wp.vm.$options.name).toBe('w-movement-detail-deposit');
	});

	it('shows the canceled date when the deposit is canceled', async () => {
		wp.setProps({
			movement: {
				id: '1234',
				operationDate: '2020-01-05',
				valueDate: '2020-01-06',
				expirationDate: '2030-01-01',
				type: { name: 'COMPRA' },
				state: { id: '00', name: 'Cancelada' },
			},
		});

		await localVue.nextTick();

		expect(wp.find('[title="Fecha de cancelación"]').exists()).toBeTruthy();
		expect(wp.find('[title="Fecha de vencimiento"]').exists()).toBeFalsy();
	});

	it('shows the expiration date when the deposit is alive', async () => {
		wp.setProps({
			movement: {
				id: '1234',
				operationDate: '2020-01-05',
				valueDate: '2020-01-06',
				expirationDate: '2030-01-01',
				type: { name: 'COMPRA' },
				state: { id: '01', name: 'Viva' },
			},
		});

		await localVue.nextTick();

		expect(wp.find('[title="Fecha de vencimiento"]').exists()).toBeTruthy();
		expect(wp.find('[title="Fecha de cancelación"]').exists()).toBeFalsy();
	});
});
