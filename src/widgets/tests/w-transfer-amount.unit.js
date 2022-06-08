import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-amount.vue';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-amount.vue', () => {
	let wp;
	let store;

	const fixture = {
		origin: {
			id: 'account-1',
			alias: 'Cuenta Corriente',
			balance: { amount: 3999.99, currency: { id: 'EUR' } },
			productNumber: {
				format: { id: 'IBAN', name: 'IBAN' },
				value: 'ES3102340098375445122708',
			},
		},
		destination: {
			account: { type: 'IBAN', id: 'CH35400381564AIVBCS54', bic: 'BANKCHXXXXX' },
			transferMode: 'SEPA',
			name: 'Elisa Naranjo',
			view: { name: 'Elisa Naranjo', id: '**** **** **** **** **** CS54' },
		},
	};

	const limits = {
		ownOperationLimit: { amount: 3000, currency: { id: 'EUR' } },
		internalOperationLimit: { amount: 4000, currency: { id: 'EUR' } },
		externalOperationLimit: { amount: 4000, currency: { id: 'EUR' } },
		internalDailyLimit: { amount: 2000, currency: { id: 'EUR' } },
		externalDailyLimit: { amount: 2000, currency: { id: 'EUR' } },
	};

	const CTransferRadio = {
		model: { prop: 'model', event: 'update:model' },
		template: `
			<input
				type="radio"
				:value="value"
				v-bind="$attrs"
				v-on="$listeners"
				@input="$emit('update:model', $event.target.value)"
			/>
		`,
		props: ['type', 'value', 'model'],
	};

	const CTransferInputAmount = {
		model: { prop: 'value', event: 'update:value' },
		template: `
			<input
				type="text"
				:value="value"
				v-bind="$attrs"
				v-on="$listeners"
				@input="$emit('update:value', $event.target.value)"
			/>`,
		props: { value: { type: String } },
	};

	const CTransferDatePicker = {
		model: { prop: 'value', event: 'update:value' },
		template: `
			<input
				type="text"
				:value="value"
				v-bind="$attrs"
				@input="$emit('update:value', $event.target.value)"
			/>
		`,
		props: { value: { type: String } },
	};

	const CTransferTextarea = {
		model: { prop: 'value', event: 'update:value' },
		template: `
			<textarea
				:value="value"
				v-bind="$attrs"
				v-on="$listeners"
				@input="$emit('update:value', $event.target.value)"
			/>
		`,
		props: { value: { type: String } },
	};

	const CTransferSelectField = {
		props: ['options'],
		model: { prop: 'value', event: 'update:value' },
		template: `
			<select
				v-bind="$attrs"
				@change="$emit('update:value', $event.target.value)"
			>
				<option value="" />
				<option v-for="opt in options" v-bind:key="opt.id" :value="opt.id">{{ opt.label }}</option>
			</select>
		`,
	};

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		const getLimits = jest.fn().mockResolvedValue(limits);

		store.mockModule('move-money', { getLimits });
		store.registerModule('session', { namespaced: true, state: { lang: 'es' } });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { value: fixture },
			stubs: {
				CButton,
				CTransferRadio,
				CTransferInputAmount,
				CTransferDatePicker,
				CTransferTextarea,
				CTransferSelectField,
			},
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to w-transfer-amount', () => {
		expect(wp.vm.$options.name).toBe('w-transfer-amount');
	});

	it('shows an error when input has a zero value', async () => {
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-value"]').text()).toBe(
			wp.vm.$t('TRANSFERS.AMOUNT_ERROR')
		);
	});

	it('shows an error when input has a value above the balance', async () => {
		await wp.find('[data-testid="amount"]').setValue('4000');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-value"]').text()).toBe(
			wp.vm.$t('TRANSFERS.BALANCE_ERROR')
		);
	});

	it('shows an error when input has a value above the daily limit', async () => {
		await wp.find('[data-testid="amount"]').setValue('2500');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-value"]').text()).toBe(
			wp.vm.$t('TRANSFERS.DAILY_LIMIT_ERROR')
		);
	});

	it('should not show a reason error for allowed characters', async () => {
		await wp.find('[data-testid="amount"]').setValue('250');

		// Verificamos letras y números
		await wp
			.find('[data-testid="reason"]')
			.setValue('abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-reason"]').exists()).toBeFalsy();

		// Verificamos caracteres especiales permitidos
		await wp.find('[data-testid="reason"]').setValue("/-¿?:().,'+ºª ");
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-reason"]').exists()).toBeFalsy();

		// Verificamos letras con tildes permitidas
		await wp.find('[data-testid="reason"]').setValue('áäàâéëèêíïîìóöòôúùüûÁÄÀÂÉËÈÊÍÏÌÎÓÖÒÔÚÙÜÛçÇ');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-reason"]').exists()).toBeFalsy();
	});

	it('shows an error when the reason has invalid characters', async () => {
		await wp.find('[data-testid="amount"]').setValue('250');
		await wp.find('[data-testid="reason"]').setValue('*Payment to Voldemort!');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-reason"]').text()).toBe(
			wp.vm.$t('TRANSFERS.REASON_ERROR')
		);
	});

	it('should remove the accent on letters, replace º by o and ª by a on reason value', async () => {
		await wp.find('[data-testid="amount"]').setValue('250');

		await wp.find('[data-testid="reason"]').setValue('áäàâéëèêíïîìóöòôúùüûÁÄÀÂÉËÈÊÍÏÌÎÓÖÒÔÚÙÜÛçÇ');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.vm.localModel.reason).toBe('aaaaeeeeiiiioooouuuuAAAAEEEEIIIIOOOOUUUUcC');

		await wp.find('[data-testid="reason"]').setValue('ºªºª');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.vm.localModel.reason).toBe('oaoa');
	});

	it('shows an error when input has a reason with more than 70 characters', async () => {
		const longValue = Array.from({ length: 100 })
			.map(() => 'a')
			.join('');
		await wp.find('[data-testid="reason"]').setValue(longValue);
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.emitted()['update:value'][1]).toBeFalsy();
		expect(wp.find('[for="w-transfer-amount-reason"]').text()).toBe(
			wp.vm.$t('TRANSFERS.REASON_LENGTH_ERROR')
		);
	});

	it('should replace linefeed by white space on reason', async () => {
		const reason = wp.find('[data-testid="reason"]');

		reason.setValue(`
			reason test
		`);

		expect(reason.element.value.match(/\n/g)).toBeTruthy();

		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.emitted()['update:value'][1]).toBeFalsy();
		expect(wp.vm.localModel.reason.match(/\n/g)).toBeFalsy();
		expect(wp.vm.localModel.reason.match(/\s/g)).toBeTruthy();
	});

	it('sets reason and date by default if they are null', async () => {
		await wp.find('[data-testid="amount"]').setValue('1000');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.emitted()['update:value']).toBeTruthy();
		expect(wp.emitted()['update:value'][1][0]).toMatchObject({
			amount: { amount: '1000', currency: { id: 'EUR' } },
			reason: 'TRANSFERENCIA',
			periodicity: 'today',
		});
	});

	it('submits the form without errors', async () => {
		await wp.find('[data-testid="amount"]').setValue('1000');
		await wp.find('[data-testid="reason"]').setValue('traspaso');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.emitted()['update:value']).toBeTruthy();
		expect(wp.emitted()['update:value'][1][0]).toMatchObject({
			amount: { amount: '1000', currency: { id: 'EUR' } },
			reason: 'traspaso',
			periodicity: 'today',
		});
	});

	it('shows an error when no date is enter', async () => {
		await wp.find('[data-testid="amount"]').setValue('1000');
		await wp.find('[data-testid="periodicity-scheduled"]').trigger('click');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-date"]').text()).toBe(
			wp.vm.$t('TRANSFERS.DATE_REQUIRED_ERROR')
		);

		await wp.find('[data-testid="date"]').setValue('2020-08-18');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.emitted()['update:value']).toBeTruthy();
		expect(wp.emitted()['update:value'][1][0]).toMatchObject({
			amount: { amount: '1000', currency: { id: 'EUR' } },
			reason: 'TRANSFERENCIA',
			date: '2020-08-18',
			periodicity: 'scheduled',
		});
	});

	it('shows an error when no frequency is enter', async () => {
		await wp.find('[data-testid="amount"]').setValue('1000');
		await wp.find('[data-testid="periodicity-periodic"]').trigger('click');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.emitted()['update:value'][1]).toBeFalsy();
		expect(wp.find('[for="w-transfer-amount-date"]').text()).toBe(
			wp.vm.$t('TRANSFERS.DATE_REQUIRED_ERROR')
		);
		expect(wp.find('[for="w-transfer-amount-frequency"]').text()).toBe(
			wp.vm.$t('TRANSFERS.FREQUENCY_REQUIRED_ERROR')
		);

		await wp
			.findAll('[data-testid="frequency"] option')
			.at(2)
			.setSelected();
		await wp.find('[data-testid="date"]').setValue('2020-08-18');
		await wp.find('[data-testid="max-date"]').setValue('2020-08-18');
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.emitted()['update:value']).toBeTruthy();
		expect(wp.emitted()['update:value'][1][0]).toMatchObject({
			amount: { amount: '1000', currency: { id: 'EUR' } },
			reason: 'TRANSFERENCIA',
			date: '2020-08-18',
			maxDate: '2020-08-18',
			periodicity: 'periodic',
		});
	});

	it('removes ending date if it is less than starting date', async () => {
		await wp.find('[data-testid="periodicity-periodic"]').trigger('click');
		await wp.find('[data-testid="date"]').setValue('2020-08-18');
		await wp.find('[data-testid="max-date"]').setValue('2020-08-19');

		expect(wp.find('[data-testid="max-date"]').element.value).toBe('2020-08-19');

		await wp.find('[data-testid="date"]').setValue('2020-08-20');

		expect(wp.find('[data-testid="max-date"]').element.value).toBeFalsy();
	});

	it('should not allow users to select today on scheduled transfer', () => {
		const [today] = new Date().toISOString().split('T');
		expect(wp.vm.scheduledMinDate).not.toBe(today);
	});

	it('should ignore account balance on periodic transfers initiating today', async () => {
		const [today] = new Date().toISOString().split('T');

		await wp.find('[data-testid="amount"]').setValue('3200');
		await wp.find('[data-testid="periodicity-periodic"]').trigger('click');
		await wp.find('[data-testid="date"]').setValue(today);
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-value"]').exists()).toBeTruthy();

		expect(wp.find('[for="w-transfer-amount-value"]').text()).not.toBe(
			wp.vm.$t('TRANSFERS.BALANCE_ERROR')
		);
	});

	it('should show daily limits error message on scheduled and periodic transfers', async () => {
		const today = new Date();
		const nextDay = new Date();
		nextDay.setDate(today.getDate() + 1);

		await wp.find('[data-testid="amount"]').setValue('3200');
		await wp.find('[data-testid="periodicity-scheduled"]').trigger('click');
		await wp.find('[data-testid="date"]').setValue(nextDay.toISOString().split('T')[0]);
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-value"]').exists()).toBeTruthy();
		expect(wp.find('[for="w-transfer-amount-value"]').text()).toBe(
			wp.vm.$t('TRANSFERS.DAILY_LIMIT_ERROR')
		);

		await wp.find('[data-testid="amount"]').setValue('3200');
		await wp.find('[data-testid="periodicity-periodic"]').trigger('click');
		await wp.find('[data-testid="date"]').setValue(today.toISOString().split('T')[0]);
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-value"]').exists()).toBeTruthy();
		expect(wp.find('[for="w-transfer-amount-value"]').text()).toBe(
			wp.vm.$t('TRANSFERS.DAILY_LIMIT_ERROR')
		);
	});

	it('should show operation limits error message on scheduled and periodic transfers', async () => {
		const today = new Date();
		const nextDay = new Date();
		nextDay.setDate(today.getDate() + 1);

		await wp.find('[data-testid="amount"]').setValue('4500');
		await wp.find('[data-testid="periodicity-scheduled"]').trigger('click');
		await wp.find('[data-testid="date"]').setValue(nextDay.toISOString().split('T')[0]);
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-value"]').exists()).toBeTruthy();
		expect(wp.find('[for="w-transfer-amount-value"]').text()).toBe(
			wp.vm.$t('TRANSFERS.LIMIT_ERROR')
		);

		await wp.find('[data-testid="amount"]').setValue('4500');
		await wp.find('[data-testid="periodicity-periodic"]').trigger('click');
		await wp.find('[data-testid="date"]').setValue(today.toISOString().split('T')[0]);
		await wp.find('[data-testid="submit"]').trigger('click');

		expect(wp.find('[for="w-transfer-amount-value"]').exists()).toBeTruthy();
		expect(wp.find('[for="w-transfer-amount-value"]').text()).toBe(
			wp.vm.$t('TRANSFERS.LIMIT_ERROR')
		);
	});

	it('should hide periodicity fields when transfer is international', async () => {
		expect(wp.find('[data-testid="periodicity-today"]').exists()).toBeTruthy();

		await wp.setProps({
			value: { ...fixture, destination: { ...fixture.destination, transferMode: 'INTERNATIONAL' } },
		});

		expect(wp.find('[data-testid="periodicity-today"]').exists()).toBeFalsy();
	});
});
