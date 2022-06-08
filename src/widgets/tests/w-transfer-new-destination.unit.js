import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-new-destination.vue';
import flushPromises from 'flush-promises';
import CButton from '@tests/stubs/c-button.stub';
import CCheckbox from '@tests/stubs/generic-checkbox.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-new-destination.vue', () => {
	let wp;
	let store;

	const moveMoneyOK = {
		namespaced: true,
		actions: { validateXBAN: jest.fn().mockResolvedValue([{ transferMode: 'SEPA' }]) },
	};

	const moveMoneyKO = {
		namespaced: true,
		actions: { validateXBAN: jest.fn().mockRejectedValue() },
	};

	const CTransferField = {
		model: {
			prop: 'value',
			event: 'update:value',
		},
		template: `
			<div class="c-transfer-field">
				<slot />
				<input
					:id="id"
					ref="input"
					:value="value"
					type="text"
					class="c-transfer-field__input text-fixed-m-book"
					v-bind="$attrs"
					v-on="$listeners"
					@input="$emit('update:value', $event.target.value)"
				/>
			</div>
		`,
		props: { value: String, id: String },
	};

	const CTransferSelectField = {
		template: `
		<select v-bind="$attrs" v-on="$listeners" @change="$emit('update:value', $event.target.value)">
			<option v-for="opt in options" v-bind:key="opt.id" :value="opt.id">
				{{ opt.label }}
			</option>
		</select>`,
		props: { options: Array, value: String },
		model: {
			prop: 'value',
			event: 'update:value',
		},
	};

	beforeEach(() => {
		const { localStore } = newInstance;

		store = localStore;

		store.registerModule('move-money', moveMoneyOK);

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { value: {} },
			stubs: {
				CButton,
				CCheckbox,
				'c-transfer-field': CTransferField,
				'c-transfer-select-field': CTransferSelectField,
				'c-transfer-field-helper-text': {
					template: '<div data-testid="error-label" v-bind="$attrs"><slot /></div>',
				},
			},
		});
	});

	it('has a name equal to w-transfer-new-destination', () => {
		expect(wp.vm.$options.name).toBe('w-transfer-new-destination');
	});

	it('shows an error when input has an empty name', async () => {
		await wp.find('[data-testid="submit"]').trigger('click');
		const helperText = wp.findAll('[for="w-transfer-new-destination__name"]').at(1);

		expect(wp.emitted().submit).toBeFalsy();
		expect(helperText.text()).toBe(wp.vm.$t('FORM.FIELD.REQUIRED'));
	});

	it('shows an error when input has an empty iban', async () => {
		await wp.find('[data-testid="submit"]').trigger('click');
		const helperText = wp.findAll('[for="w-transfer-new-destination__iban"]').at(1);

		expect(wp.emitted().submit).toBeFalsy();
		expect(helperText.text()).toBe(wp.vm.$t('FORM.FIELD.REQUIRED'));
	});

	it('formats the input iban', async () => {
		const input = wp.find('[data-testid="iban"]').find('input');
		await input.setValue('ES7921000813610123456789');
		await input.trigger('blur');

		expect(input.element.value).toBe('ES79 2100 0813 6101 2345 6789');
	});

	it('allows BIC only in uppercase', async () => {
		await wp
			.find('[data-testid="iban"]')
			.find('input')
			.setValue('CZ5508000000001234567899');

		const input = wp.find('[data-testid="bic"]').find('input');
		await input.setValue('cxz213o');
		await input.trigger('blur');

		expect(input.element.value).toBe('CXZ213O');
	});

	it('should show an error with invalid BIC', async () => {
		await wp
			.find('[data-testid="iban"]')
			.find('input')
			.setValue('CZ5508000000001234567899');

		const queryBicErrorLabel = '[data-testid="error-label"][for="w-transfer-new-destination__bic"]';

		const input = wp.find('[data-testid="bic"]').find('input');
		await input.setValue('CXZ213O');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find(queryBicErrorLabel).exists()).toBeTruthy();

		await input.setValue('BACXCZ');
		expect(wp.find(queryBicErrorLabel).exists()).toBeTruthy();

		await input.setValue('BACXCZPPCC00');
		expect(wp.find(queryBicErrorLabel).exists()).toBeTruthy();

		await input.setValue('BACXCZPP');
		expect(wp.find(queryBicErrorLabel).exists()).toBeFalsy();
	});

	it('should format a spanish number account', async () => {
		const input = wp.find('[data-testid="iban"]').find('input');
		await input.setValue('21000813610123456789');

		expect(input.element.value).toBe('2100 0813 6 1 0123456789');
	});

	it('submit the form without errors', async () => {
		const inputName = wp.find('[data-testid="name"]').find('input');
		const inputIban = wp.find('[data-testid="iban"]').find('input');

		await inputName.setValue('Rodolfo');
		await inputName.trigger('blur');
		await inputIban.setValue('ES7921000813610123456789');
		await inputIban.trigger('blur');
		await wp.find('[data-testid="submit"]').trigger('click');

		await flushPromises();

		expect(wp.emitted()['update:value']).toBeTruthy();
		expect(wp.emitted()['update:value'][1][0]).toMatchObject({
			destination: {
				account: { type: 'IBAN', id: 'ES7921000813610123456789' },
				transferMode: 'SEPA',
				name: 'RODOLFO',
				view: { name: 'RODOLFO', id: '**** **** **** **** **** 6789' },
			},
		});

		await inputName.setValue('Rodolfo');
		await inputName.trigger('blur');
		await inputIban.setValue('21000813610123456789');
		await inputIban.trigger('blur');
		await wp.find('[data-testid="submit"]').trigger('click');

		await flushPromises();

		expect(wp.emitted()['update:value']).toBeTruthy();
		expect(wp.emitted()['update:value'][2][0]).toMatchObject({
			destination: {
				account: { type: 'CCC', id: '21000813610123456789' },
				transferMode: 'SEPA',
				name: 'RODOLFO',
				view: { name: 'RODOLFO', id: '**** **** **** **** **** 6789' },
			},
		});
	});

	it('resets the extra info fields after switching to a spanish number account', async () => {
		await wp
			.find('[data-testid="iban"]')
			.find('input')
			.setValue('IE64IRCE92050112345678');
		await wp
			.find('[data-testid="bic"]')
			.find('input')
			.setValue('AIBKIED02');
		await wp
			.find('[data-testid="iban"]')
			.find('input')
			.setValue('ES7921000813610123456789');
		expect(wp.vm.bic).toBe('');
	});

	it('ban an invalid iban', async () => {
		store.unregisterModule('move-money');
		store.registerModule('move-money', moveMoneyKO);

		const name = wp.find('[data-testid="name"]').find('input');
		const iban = wp.find('[data-testid="iban"]').find('input');

		await name.setValue('Rodolfo');
		await iban.setValue('ES7921000813610123456789');
		await wp.find('[data-testid="submit"]').trigger('click');

		await flushPromises();

		expect(wp.emitted().submit).toBeFalsy();

		const helperText = wp.findAll('[for="w-transfer-new-destination__iban"]').at(1);

		expect(helperText.text()).toBe(wp.vm.$t('TRANSFERS.BENEFICIARY.INVALID_IBAN'));

		await iban.setValue('ES9121000418450200051332');
		expect(helperText.exists()).toBeFalsy();

		await iban.setValue('ES7921000813610123456789');
		expect(helperText.text()).toBe(wp.vm.$t('TRANSFERS.BENEFICIARY.INVALID_IBAN'));
	});

	it('dont allow a destination IBAN as same as origin', async () => {
		store.unregisterModule('move-money');
		store.registerModule('move-money', moveMoneyKO);

		await wp.setProps({
			value: {
				origin: { productNumber: { value: 'ES7921000813610123456789' } },
			},
		});

		await wp
			.find('[data-testid="name"]')
			.find('input')
			.setValue('Rodolfo');
		await wp
			.find('[data-testid="iban"]')
			.find('input')
			.setValue('ES7921000813610123456789');
		await wp.find('[data-testid="submit"]').trigger('click');

		await flushPromises();

		expect(wp.emitted().submit).toBeFalsy();

		const helperText = wp.findAll('[for="w-transfer-new-destination__iban"]').at(1);

		expect(helperText.text()).toBe(wp.vm.$t('TRANSFERS.BENEFICIARY.IBAN_SAME_AS_ORIGIN'));
	});

	it('should remove the accent on letters, replace º by O and ª by A on beneficiary name value', async () => {
		store.unregisterModule('move-money');
		store.registerModule('move-money', moveMoneyOK);
		const inputName = wp.find('[data-testid="name"]').find('input');

		await wp
			.find('[data-testid="iban"]')
			.find('input')
			.setValue('ES7921000813610123456789');

		await inputName.setValue('áäàâéëèêíïîìóöòôúùüû');
		await inputName.trigger('blur');
		await wp.find('[data-testid="submit"]').trigger('click');

		await flushPromises();

		expect(wp.vm.localModel.destination.name).toBe('AAAAEEEEIIIIOOOOUUUU');

		await inputName.setValue('ÁÄÀÂÉËÈÊÍÏÌÎÓÖÒÔÚÙÜÛçÇ');
		await inputName.trigger('blur');
		await wp.find('[data-testid="submit"]').trigger('click');

		await flushPromises();

		expect(wp.vm.localModel.destination.name).toBe('AAAAEEEEIIIIOOOOUUUUCC');

		await inputName.setValue('ºªºª');
		await wp.find('[data-testid="submit"]').trigger('click');

		await flushPromises();

		expect(wp.vm.localModel.destination.name).toBe('OAOA');
	});

	it('should call the validateBICIBAN service with a type queryParam', async () => {
		store.unregisterModule('move-money');
		store.registerModule('move-money', moveMoneyOK);

		await wp
			.find('[data-testid="iban"]')
			.find('input')
			.setValue('21000813610123456789');
		await wp.find('[data-testid="submit"]').trigger('click');

		await flushPromises();

		expect(moveMoneyOK.actions.validateXBAN).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				iban: '21000813610123456789',
				type: 'CCC',
				bic: undefined,
				origin: undefined,
			})
		);
	});

	it('should open a iban info modal', async () => {
		expect(wp.vm.$store.getters['modal/lastOpened']).toBeUndefined();
		await wp.find('[data-testid="iban-info"]').trigger('click');

		expect(wp.vm.$store.getters['modal/lastOpened'].component.options.name).toEqual(
			'm-transfer-iban-info'
		);
	});

	it('should open a bic info modal', async () => {
		expect(wp.vm.$store.getters['modal/lastOpened']).toBeUndefined();

		await wp
			.find('[data-testid="iban"]')
			.find('input')
			.setValue('IE64IRCE92050112345678');

		await wp.find('[data-testid="bic-info"]').trigger('click');

		expect(wp.vm.$store.getters['modal/lastOpened'].component.options.name).toEqual(
			'm-transfer-bic-info'
		);
	});
});
