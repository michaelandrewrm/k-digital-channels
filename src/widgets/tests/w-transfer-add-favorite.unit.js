import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-add-favorite.vue';
import CCheckbox from '@tests/stubs/generic-checkbox.stub';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-add-favorite.vue', () => {
	let store;

	const CTransferField = {
		template: `
			<input
				type="text"
				v-bind="$attrs"
				@input="$emit('input', $event.target.value)"
			/>
		`,
	};

	beforeEach(() => {
		const { localStore } = newInstance;

		store = localStore;

		const moveMoneyOK = {
			namespaced: true,
			actions: { validateFavorite: jest.fn().mockResolvedValue() },
		};

		store.registerModule('move-money', moveMoneyOK);
	});

	it('has a name equal to w-transfer-add-favorite', () => {
		const wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { model: { notify: false, email: null, favorite: true, alias: null } },
			stubs: { CTransferField, CCheckbox },
		});
		expect(wp.vm.$options.name).toBe('w-transfer-add-favorite');
	});

	it('should reset the alias after switching on/off the checkbox', async () => {
		const template = {
			components: { ComponentTest: Component },
			data: () => ({ model: { notify: false, email: null, favorite: false, alias: null } }),
			template: '<component-test v-model="model" />',
		};

		const wrapper = shallowMount(template, {
			localVue,
			store,
			stubs: { componentTest: Component, CTransferField, CCheckbox },
		});

		const wp = wrapper.findComponent(Component);
		const alias = 'Payment';
		const checkbox = wp.find('input[type=checkbox][data-testid="favorite"]');

		await checkbox.setChecked();

		const input = wp.find('input[type=text][data-testid="alias"]');
		expect(input.exists()).toBeTruthy();

		await input.setValue(alias);
		expect(input.element.value).toBe(alias);

		await checkbox.setChecked(false);
		expect(input.exists()).toBeFalsy();

		await checkbox.setChecked();

		const input2 = wp.find('input[type=text][data-testid="alias"]');
		expect(input2.exists()).toBeTruthy();
		expect(input2.element.value).toBeFalsy();
	});

	it('should throw an error on invalid alias', async () => {
		const template = {
			components: { ComponentTest: Component },
			data: () => ({ model: { notify: false, email: null, favorite: true, alias: null } }),
			template: '<component-test v-model="model" />',
		};

		const wrapper = shallowMount(template, {
			localVue,
			store,
			stubs: { componentTest: Component, CTransferField, CCheckbox },
		});

		const wp = wrapper.findComponent(Component);
		const alias = '{1234}';
		const input = wp.find('input[type=text][data-testid="alias"]');

		await input.setValue(alias);

		const errorLabel = wp.find('[for="w-transfer-add-favorite__alias"]');

		expect(errorLabel.exists()).toBeTruthy();
		expect(errorLabel.text()).toBe(
			'El campo contiene caracteres no permitidos. Sólo se admiten letras y números.'
		);
	});

	it('should throw an error on externally invalid alias', async () => {
		store.unregisterModule('move-money');

		const moveMoneyKO = {
			namespaced: true,
			actions: { validateFavorite: jest.fn().mockRejectedValue() },
		};

		store.registerModule('move-money', moveMoneyKO);

		jest.useFakeTimers();

		const template = {
			components: { ComponentTest: Component },
			data: () => ({ model: { notify: false, email: null, favorite: true, alias: null } }),
			template: '<component-test v-model="model" />',
		};

		const wrapper = shallowMount(template, {
			localVue,
			store,
			stubs: { componentTest: Component, CTransferField, CCheckbox },
		});

		const wp = wrapper.findComponent(Component);
		const alias = 'pruebitamala';
		const input = wp.find('input[type=text][data-testid="alias"]');

		await input.setValue(alias);

		wp.vm.debouncedValidation.flush();
		await flushPromises();

		const errorLabel = wp.find('[for="w-transfer-add-favorite__alias"]');

		expect(errorLabel.exists()).toBeTruthy();
		expect(errorLabel.text()).toBe('Alias ya utilizado. Por favor, elige otro nombre.');
	});

	it('should emit a success event on externally validated aliases', async () => {
		jest.useFakeTimers();

		const template = {
			components: { ComponentTest: Component },
			data: () => ({ model: { notify: false, email: null, favorite: true, alias: null } }),
			template: '<component-test v-model="model" />',
		};

		const wrapper = shallowMount(template, {
			localVue,
			store,
			stubs: { componentTest: Component, CTransferField, CCheckbox },
		});

		const wp = wrapper.findComponent(Component);
		const alias = 'pruebita';
		const input = wp.find('input[type=text][data-testid="alias"]');

		await input.setValue(alias);

		expect(wp.emitted('success')).toBeFalsy();

		wp.vm.debouncedValidation.flush();
		await flushPromises();

		const errorLabel = wp.find('[for="w-transfer-add-favorite__alias"]');

		expect(errorLabel.exists()).toBeFalsy();
		expect(wp.emitted('success')).toBeTruthy();
	});

	it('should emit an error event on invalid aliases', async () => {
		jest.useFakeTimers();

		store.unregisterModule('move-money');

		const moveMoneyKO = {
			namespaced: true,
			actions: {
				validateFavorite: jest
					.fn()
					.mockResolvedValueOnce()
					.mockRejectedValue(),
			},
		};

		store.registerModule('move-money', moveMoneyKO);

		const template = {
			components: { ComponentTest: Component },
			data: () => ({ model: { notify: false, email: null, favorite: false, alias: null } }),
			template: '<component-test v-model="model" />',
		};

		const wrapper = shallowMount(template, {
			localVue,
			store,
			stubs: { componentTest: Component, CTransferField, CCheckbox },
		});

		const wp = wrapper.findComponent(Component);
		const checkbox = wp.find('input[type=checkbox][data-testid="favorite"]');

		expect(wp.emitted('error')).toBeFalsy();
		await checkbox.setChecked();
		expect(wp.emitted('error')).toBeTruthy();
		expect(wp.emitted('error').length).toBe(1);

		const input = wp.find('input[type=text][data-testid="alias"]');

		await input.setValue('pruebita');
		wp.vm.debouncedValidation.flush();
		await flushPromises();
		expect(wp.emitted('success')).toBeTruthy();
		expect(wp.emitted('success').length).toBe(1);

		await input.setValue('pruebitamala');
		wp.vm.debouncedValidation.flush();
		await flushPromises();
		expect(wp.emitted('error')).toBeTruthy();
		expect(wp.emitted('error').length).toBe(2);

		await input.setValue('pruebita');
		expect(wp.emitted('success')).toBeTruthy();
		expect(wp.emitted('success').length).toBe(2);
	});

	it('should emit a success event if uncheck favorite', async () => {
		const template = {
			components: { ComponentTest: Component },
			data: () => ({ model: { notify: false, email: null, favorite: false, alias: null } }),
			template: '<component-test v-model="model" />',
		};

		const wrapper = shallowMount(template, {
			localVue,
			store,
			stubs: { componentTest: Component, CTransferField, CCheckbox },
		});

		const wp = wrapper.findComponent(Component);
		const checkbox = wp.find('input[type=checkbox][data-testid="favorite"]');

		expect(wp.emitted('error')).toBeFalsy();
		await checkbox.setChecked();
		expect(wp.emitted('error')).toBeTruthy();
		expect(wp.emitted('error').length).toBe(1);

		const input = wp.find('input[type=text][data-testid="alias"]');

		await input.setValue('pruebita');
		wp.vm.debouncedValidation.flush();
		await flushPromises();
		expect(wp.emitted('success')).toBeTruthy();
		expect(wp.emitted('success').length).toBe(1);

		await checkbox.setChecked(false);

		// El evento success debe ser el último lanzado y
		// no debe lanzarse otro evento error.
		expect(wp.emitted('error').length).toBe(1);
		expect(wp.emitted('success').length).toBe(1);
	});

	it('should reset the email on toggle', async () => {
		const template = {
			components: { ComponentTest: Component },
			data: () => ({ model: { favorite: false, alias: null, notify: false, email: null } }),
			template: '<component-test v-model="model" />',
		};

		const wp = shallowMount(template, {
			localVue,
			store,
			stubs: { componentTest: Component, CTransferField, CCheckbox },
		});

		expect(wp.vm.model.notify).toBeFalsy();
		expect(wp.vm.model.email).toBeFalsy();

		await wp.find('input[type=checkbox][data-testid="notify"]').setChecked();
		await wp.find('[data-testid="email-info"]').setValue('example@gmail.com');

		expect(wp.vm.model.notify).toBeTruthy();
		expect(wp.vm.model.email).toBe('example@gmail.com');

		await wp.find('input[type=checkbox][data-testid="notify"]').setChecked(false);

		expect(wp.vm.model.notify).toBeFalsy();
		expect(wp.vm.model.email).toBeFalsy();

		await wp.find('input[type=checkbox][data-testid="notify"]').setChecked();

		expect(wp.vm.model.notify).toBeTruthy();
		expect(wp.vm.model.email).toBeFalsy();
	});

	it('should show an invalid email error', async () => {
		const template = {
			components: { ComponentTest: Component },
			data: () => ({ model: { favorite: false, alias: null, notify: false, email: null } }),
			template: '<component-test v-model="model" />',
		};

		const wp = shallowMount(template, {
			localVue,
			store,
			stubs: { componentTest: Component, CTransferField, CCheckbox },
		});

		await wp.find('input[type=checkbox][data-testid="notify"]').setChecked();
		await wp.find('[data-testid="email-info"]').setValue('example');

		expect(wp.find('[for="w-transfer-add-favorite__email"]').exists()).toBeTruthy();

		await wp.find('[data-testid="email-info"]').setValue('example@');

		expect(wp.find('[for="w-transfer-add-favorite__email"]').exists()).toBeTruthy();

		await wp.find('[data-testid="email-info"]').setValue('example@gmail.');

		expect(wp.find('[for="w-transfer-add-favorite__email"]').exists()).toBeTruthy();

		await wp.find('[data-testid="email-info"]').setValue('example@gmail.c');

		expect(wp.find('[for="w-transfer-add-favorite__email"]').exists()).toBeFalsy();

		await wp.find('[data-testid="email-info"]').setValue('example@gamil.com');

		expect(wp.find('[for="w-transfer-add-favorite__email"]').exists()).toBeFalsy();

		await wp.find('[data-testid="email-info"]').setValue('example-go@gamil.com');

		expect(wp.find('[for="w-transfer-add-favorite__email"]').exists()).toBeFalsy();
	});
});
