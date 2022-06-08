import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-bizum-transfer-amount';
import CButton from '@tests/stubs/c-button.stub';
import CInput from '@tests/stubs/c-text-field.stub';
import CTransferTextarea from '@tests/stubs/generic-textarea.stub';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-bizum-transfer-amount.vue', () => {
	let wp;
	let value;
	let store;

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

		const { shallowStore } = newInstance;
		store = shallowStore;

		const getContacts = jest.fn().mockImplementation((rootStore, [{ phone }]) => {
			if (phone === '+34657136699') {
				return Promise.resolve([{ phone, multimediaCapability: 1 }]);
			}
			return Promise.resolve([{ phone, multimediaCapability: 0 }]);
		});

		store.mockModule('bizum', { getContacts });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { value },
			stubs: { CButton, CTransferInputAmount, CTransferTextarea, CInputPhone: CInput },
		});

		wp.vm.$on(wp.vm.$options.model.event, (event) => {
			wp.setProps(wp.vm.$options.model.prop, event);
			value = event;
		});
	});

	it('has a name equal to w-bizum-transfer-amount', () => {
		expect(wp.vm.$options.name).toBe('w-bizum-transfer-amount');
	});

	/**
	 * Debería validar que el importe máximo y mínimo se cumpla.
	 * El mínimo es 0,50 y el máximo es 1000 o el balance de la cuenta.
	 */
	it('validate amount', async () => {
		await wp.setProps({ action: 'send' });

		await wp.find('[data-testid="amount"]').setValue('1500');
		expect(wp.find('[for="w-bizum-transfer-amount__amount"]').text()).toBe(
			wp.vm.$t('TRANSFERS.LIMIT_ERROR')
		);

		await wp.find('[data-testid="amount"]').setValue('2500');
		expect(wp.find('[for="w-bizum-transfer-amount__amount"]').text()).toBe(
			wp.vm.$t('TRANSFERS.BALANCE_ERROR')
		);

		await wp.find('[data-testid="amount"]').setValue('-24');
		expect(wp.find('[for="w-bizum-transfer-amount__amount"]').text()).toBe(
			wp.vm.$t('TRANSFERS.AMOUNT_ERROR')
		);

		await wp.find('[data-testid="amount"]').setValue('0.24');
		expect(wp.find('[for="w-bizum-transfer-amount__amount"]').text()).toBe(
			wp.vm.$t('TRANSFERS.MINIMUM_AMOUNT_ERROR')
		);

		await wp.find('[data-testid="amount"]').setValue('25');
		expect(
			wp.find('[for="w-bizum-transfer-amount__amount"]:not([persistent])').exists()
		).toBeFalsy();
	});

	/**
	 * Debería validar que el teléfono sea un teléfono español de
	 * 9 dígitos.
	 */
	it('validate phone', async () => {
		await wp.setProps({ action: 'send' });
		await wp.find('[data-testid="recipient"]').setValue('123657135544');
		expect(wp.find('[for="w-bizum-transfer-amount__recipient"]').text()).toBe(
			wp.vm.$t('FORM.FIELD.INVALID_PHONE')
		);

		await wp.find('[data-testid="recipient"]').setValue('+34657135544');

		expect(wp.find('[for="w-bizum-transfer-amount__recipient"]').exists()).toBeFalsy();
	});

	/**
	 * Debería validar que el concepto sea menor que 50 caracteres.
	 */
	it('validate reason', async () => {
		await wp.find('[data-testid="reason"]').setValue('a'.repeat(51));
		expect(wp.find('[for="w-bizum-transfer-amount__reason"]').text()).toBe(
			wp.vm.$t('TRANSFERS.ERROR_FIELD_LENGTH', { length: 35 })
		);
	});

	/**
	 * No debería actualizar el modelo si faltan campos requeridos: importe
	 * y beneficiario. El concepto es opcional.
	 */
	it('dont update model value on submit if form has errors', async () => {
		await wp.setProps({ action: 'send' });
		await wp.find('[data-testid="recipient"]').setValue('+346571');
		await wp.find('[data-testid="amount"]').setValue('1');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(value).toStrictEqual({
			origin: {
				alias: 'Cuenta transparente',
				productNumber: { format: 'IBAN', value: 'ES7921000813610123456789' },
				balance: { amount: 2000, currency: { id: 'EUR' } },
			},
		});
	});

	/**
	 * Debería actualizar el modelo si todo ha ido bien con los campos
	 * requeridos
	 */
	it('update model value on submit', async () => {
		await wp.setProps({ action: 'send' });
		await wp.find('[data-testid="recipient"]').setValue('+34657135544');
		await wp.find('[data-testid="amount"]').setValue('1');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(value).toMatchObject({
			recipient: '+34657135544',
			reason: '',
			amount: { amount: 1, currency: { code: '978', id: 'EUR' } },
		});
	});

	/**
	 * En un teléfono con capacidad para recibir multimedia, debería
	 * mostrar los campos de agregar imagen y agregar comentario adicional.
	 */
	it('show additional content on multimedia phones', async () => {
		await wp.setProps({ action: 'send' });
		await wp.find('[data-testid="recipient"]').setValue('+34657135544');
		await wp.find('[data-testid="amount"]').setValue('1');
		await flushPromises();
		expect(wp.find('[data-testid="image"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="comment"]').exists()).toBeFalsy();
		await wp.find('[data-testid="recipient"]').setValue('+34657136699');
		await flushPromises();
		expect(wp.find('[data-testid="image"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="comment"]').exists()).toBeTruthy();
	});
});
