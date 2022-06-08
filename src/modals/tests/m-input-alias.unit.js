import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@modals/m-input-alias.vue';
import CButton from '@tests/stubs/c-button.stub';
import CTextField from '@tests/stubs/c-text-field.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-input-alias.vue', () => {
	let wp;
	let store;
	let router;

	const LModal = {
		template: `
			<div class="l-modal" @keydown.capture="keyHandler">
				<slot name="header" />
				<slot />
				<slot name="buttons" />
				<slot name="actions" />
			</div>
		`,
		methods: {
			keyHandler: jest.fn(),
		},
	};

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			stubs: { LModal, CButton, CTextField },
			propsData: {
				detail: 'Cta. Cte. Personal',
				productId: '123456',
				canEdit: true,
				validationCode: { dirty: true, invalid: false },
			},
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to m-input-alias', () => {
		expect(wp.vm.$options.name).toBe('m-input-alias');
	});

	it('can not send an empty alias', async () => {
		const putAlias = jest.fn().mockResolvedValue();
		store.mockModule('products', { putAlias });

		await wp.find('[data-testid="send-alias-input"]').setValue(' ');

		wp.find('[data-testid="send-alias-button"]').trigger('click');

		expect(putAlias).not.toHaveBeenCalled();
	});

	it('it should send a valid alias', async () => {
		const putAlias = jest.fn().mockResolvedValue();

		store.mockModule('products', { putAlias });

		const open = jest.fn().mockResolvedValue();

		store.mockModule('notification', { open });

		await wp.find('[data-testid="send-alias-input"]').setValue('Cuenta alias');

		wp.find('[data-testid="send-alias-button"]').trigger('click');

		const data = {
			alias: 'Cuenta alias',
			productId: '123456',
		};

		expect(putAlias).toHaveBeenCalledWith(expect.anything(), expect.objectContaining(data));

		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ text: 'Alias cambiado con éxito' })
		);
	});

	it('it should not send a alias', async () => {
		const putAlias = jest.fn().mockResolvedValue();

		store.mockModule('products', { putAlias });

		await wp.find('[data-testid="send-alias-input"]').setValue('&&');

		wp.find('[data-testid="send-alias-button"]').trigger('click');

		expect(putAlias).not.toHaveBeenCalled();

		await wp.vm.$nextTick();

		expect(wp.emitted('click'));
	});

	it('it should fails the request', async () => {
		const putAlias = jest.fn().mockRejectedValue();

		store.mockModule('products', { putAlias });

		const open = jest.fn();

		store.mockModule('notification', { open });

		await wp.find('[data-testid="send-alias-input"]').setValue('Cuenta alias');

		wp.find('[data-testid="send-alias-button"]').trigger('click');

		const data = {
			alias: 'Cuenta alias',
			productId: '123456',
		};

		expect(putAlias).toHaveBeenCalledWith(expect.anything(), expect.objectContaining(data));

		await flushPromises();

		expect(open).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ text: 'No se ha podido cambiar el alias de su producto' })
		);
	});
});
