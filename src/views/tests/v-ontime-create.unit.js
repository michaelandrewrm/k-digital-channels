import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import component from '@views/v-ontime-create';
import accounts from '@tests/fixtures/products/accounts';
import CCheckbox from '@tests/stubs/generic-checkbox.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-ontime-create.vue', () => {
	let wp;
	let store;
	let router;

	const WActions = {
		template: `
			<div>
				<button
					v-for="option in options"
					:key="option.id"
					:data-testid="option.id"
					@click="option.action()"
				>{{ option.title }}</button>
			</div>
		`,
		props: ['options'],
	};

	const COntimeProduct = {
		props: ['value'],
		model: { prop: 'value', event: 'update:value' },
		computed: {
			localValue: {
				get() {
					return this.value;
				},
				set() {
					this.$emit('update:value', !this.value);
					this.$emit('select-item', !this.value);
				},
			},
		},
		template: `
			<input
				v-bind="$attrs"
				v-on="$listeners"
				type="checkbox"
				v-model="localValue"
			/>
		`,
	};

	const fixture = accounts.map((item) => ({ ...item, onTime: false }));

	const create = jest.fn().mockResolvedValue();
	const get = jest.fn().mockResolvedValue(fixture);
	const setWelcome = jest.fn();
	const deleteCache = jest.fn().mockResolvedValue();

	beforeEach(async () => {
		jest.useFakeTimers();

		const { shallowStore, shallowRouter } = newInstance;
		store = shallowStore;
		router = shallowRouter;

		store.mockModule('ontime', { create, get, setWelcome });
		store.registerModule('app', { namespaced: true, state: { companyId: 'BC' } });
		store.mockModule('session', { deleteCache });

		await router.replace('/');

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			stubs: { CCheckbox, WActions, COntimeProduct },
		});
	});

	it('has a name equal to v-ontime-create', () => {
		expect(wp.vm.$options.name).toBe('v-ontime-create');
	});

	it('should request a selection of products for ontime', async () => {
		await flushPromises();
		await wp.find('[data-testid="account"]').trigger('click');
		await wp.find('[data-testid="configure"]').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		const productsOnTime = [
			{ ...accounts[0], onTime: true },
			{ ...accounts[1], onTime: true },
			{ ...accounts[2], onTime: true },
			{ ...accounts[5], onTime: true },
		];

		expect(create).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ productsOnTime })
		);

		expect(wp.findComponent({ name: 'c-operation-success' }).exists()).toBeTruthy();
	});

	it('should request a product for ontime', async () => {
		await flushPromises();
		await wp.find('[id="account-4"]').trigger('click');
		await wp.find('[data-testid="configure"]').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		const productsOnTime = [{ ...accounts[3], onTime: true }];

		expect(create).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ productsOnTime })
		);

		expect(wp.findComponent({ name: 'c-operation-success' }).exists()).toBeTruthy();
	});

	it('should show an error after request a ontime create', async () => {
		const createAction = jest.fn().mockRejectedValue();
		store.mockModule('ontime', { create: createAction, get, setWelcome });

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			stubs: { CCheckbox, WActions, COntimeProduct },
		});

		await flushPromises();
		await wp.find('[id="account-4"]').trigger('click');
		await wp.find('[data-testid="configure"]').trigger('click');

		jest.runAllTimers();
		await flushPromises();

		expect(wp.findComponent({ name: 'c-operation-error' }).exists()).toBeTruthy();
	});

	it('should show an error when request a ontime get', async () => {
		const getAction = jest.fn().mockRejectedValue();
		store.mockModule('ontime', { create, get: getAction, setWelcome });

		wp = shallowMount(component, {
			localVue,
			store,
			router,
			stubs: { CCheckbox, WActions, COntimeProduct },
		});

		await flushPromises();

		expect(wp.find('[data-testid="error"]').exists()).toBeTruthy();
	});
});
