import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-correos-cash-destination';
import accounts from '@tests/fixtures/products/accounts';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-correos-cash-destination.vue', () => {
	let wp;
	let value;

	const WTransferDestinationList = {
		template: `
			<button
				class="w-transfer-destination-list__button"
				@click="$emit('select', destination)"
			>
			</button>
		`,
		data() {
			return { destination: accounts[0] };
		},
	};

	beforeEach(() => {
		jest.useFakeTimers();

		wp = shallowMount(Component, {
			localVue,
			propsData: { value: { destination: null, amount: null } },
			stubs: { 'w-transfer-destination-list': WTransferDestinationList },
		});

		wp.vm.$on(wp.vm.$options.model.event, (event) => {
			wp.setProps(wp.vm.$options.model.prop, event);
			value = event;
		});
	});

	it('has a name equal to w-correos-cash-destination', () => {
		expect(wp.vm.$options.name).toBe('w-correos-cash-destination');
	});

	it('should update model on select', async () => {
		await wp.find('button').trigger('click');

		jest.runAllTimers();

		expect(value).toMatchObject({
			destination: {
				account: { type: 'IBAN', id: 'ES3102340098375445122708' },
				name: 'Cuenta Corriente',
				view: { name: 'Cuenta Corriente', id: '**** **** **** **** **** 2708' },
			},
			amount: null,
		});
	});
});
