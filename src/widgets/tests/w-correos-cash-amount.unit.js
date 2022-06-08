import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-correos-cash-amount';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-correos-cash-amount.vue', () => {
	let wp;
	let value;

	const CTransferInputAmount = {
		model: { prop: 'value', event: 'update:value' },
		template: `
			<input type="text"
				:value="value"
				v-bind="$attrs"
				v-on="$listeners"
				@input="$emit('update:value', $event.target.value)"
			/>`,
		props: { value: { type: String } },
	};

	beforeEach(() => {
		value = {
			origin: {
				alias: 'Cuenta transparente',
				productNumber: { format: 'IBAN', value: 'ES7921000813610123456789' },
				balance: { amount: 2000, currency: { id: 'EUR' } },
			},
		};

		wp = shallowMount(Component, {
			localVue,
			propsData: { maxAmount: { amount: 10000, currency: { id: 'EUR' } }, value },
			stubs: { CButton, CTransferInputAmount },
		});

		wp.vm.$on(wp.vm.$options.model.event, (event) => {
			wp.setProps(wp.vm.$options.model.prop, event);
			value = event;
		});
	});

	it('has a name equal to w-correos-cash-amount', () => {
		expect(wp.vm.$options.name).toBe('w-correos-cash-amount');
	});

	it('should show the amount error', async () => {
		await wp.find('[data-testid="submit"]').trigger('click');
		expect(wp.find('[data-testid="amount-error"]').text()).toBe(
			'El importe debe ser mayor que cero.'
		);
	});

	it('should show the limit error', async () => {
		await wp.find('[data-testid="amount"]').setValue('10000,01');
		await wp.find('[data-testid="submit"]').trigger('click');
		expect(wp.find('[data-testid="limit-error"]').text()).toBe(
			'El importe no puede ser mayor que 10.000€'
		);
	});

	it('should update model on submit', async () => {
		await wp.find('[data-testid="amount"]').setValue('1000');
		await wp.find('[data-testid="submit"]').trigger('click');
		expect(value).toMatchObject({
			amount: {
				amount: '1000',
				currency: { id: 'EUR' },
			},
		});
	});
});
