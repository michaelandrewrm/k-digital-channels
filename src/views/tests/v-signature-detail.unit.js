import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-signature-detail.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-signatures', () => {
	let wp;
	let store;
	let router;
	const signatures = [
		{
			signatureId: 'signature-1',
			operationType: 'transfer',
			operationDescription: 'transferencia',
			creationDate: '01/07/2021',
			status: 'pending',
			data: {
				amount: 123.45,
				currency: 'EUR',
				origin: 1234,
				destination: 5678,
			},
		},
	];
	const WActions = {
		props: ['options'],
		template: `
			<div>
				<button
					:data-testid="opt.id"
					class="w-actions__btn"
					v-for="opt in options"
					:key="opt.id"
					@click="opt.action"
				>
					{{ opt.title }}
				</button>
			</div>
		`,
	};
	const COperation = {
		template: `
			<section v-bind="$attrs">
				<slot name="title" />
				<slot />
				<slot name="buttons" />
			</section>
		`,
	};
	const getAction = jest.fn().mockImplementation((context, { signatureId }) => {
		if (signatureId) {
			return Promise.resolve(signatures[0]);
		}
		return Promise.resolve(signatures);
	});
	const signAction = jest.fn().mockResolvedValue();
	const deleteAction = jest.fn().mockResolvedValue();

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		store.mockModule('signatures', {
			get: getAction,
			sign: signAction,
			delete: deleteAction,
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { signatureId: 'signature-1', type: 'pending' },
			stubs: { WActions },
		});
	});

	it('has a name equal to v-signatures', () => {
		expect(wp.vm.$options.name).toBe('v-signature-detail');
	});

	it('should render correctly', async () => {
		await flushPromises();

		expect(wp.text().replace(/\s+/g, ' ')).toBe(
			'Detalle de la operación transferencia 123,45 € Pendiente de firma Firmar operación Rechazar firma'
		);
	});

	it('should request a sign operation', async () => {
		await wp.find('[data-testid="sign-operation"]').trigger('click');
		expect(signAction).toHaveBeenCalled();
	});

	it('should show an error after sign an operation', async () => {
		store.mockModule('signatures', {
			get: getAction,
			sign: jest.fn().mockRejectedValue(),
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { signatureId: 'signature-1', type: 'pending' },
			stubs: { WActions, 'c-operation-error': COperation },
		});

		await flushPromises();
		await wp.find('[data-testid="sign-operation"]').trigger('click');
		await flushPromises();

		expect(wp.find('[data-testid="operation-error"]').exists()).toBeTruthy();
		expect(
			wp
				.find('[data-testid="operation-error"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe(
			'Error al ejecutar la operación. Ha habido un error al ejecutar la operación. Puedes intentar de nuevo más tarde, o ponerte en contacto con nosotros para mayor información.'
		);
	});

	it('should show an error after sign an expired operation', async () => {
		store.mockModule('signatures', {
			get: getAction,
			sign: jest.fn().mockRejectedValue({ response: { data: { errorCode: 'C503000304' } } }),
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { signatureId: 'signature-1', type: 'pending' },
			stubs: { WActions, 'c-operation-error': COperation },
		});

		await flushPromises();
		await wp.find('[data-testid="sign-operation"]').trigger('click');
		await flushPromises();

		expect(wp.find('[data-testid="operation-error"]').exists()).toBeTruthy();
		expect(
			wp
				.find('[data-testid="operation-error"]')
				.text()
				.replace(/\s+/g, ' ')
		).toBe(
			'Error al ejecutar la operación. Ha habido un error al ejecutar la operación. La operación pendiente de firma ha expirado.'
		);
	});

	it('should trigger delete action', async () => {
		await wp.find('[data-testid="reject-operation"]').trigger('click');
		expect(deleteAction).toHaveBeenCalled();
	});

	it('should show error on delete action', async () => {
		store.mockModule('signatures', {
			get: getAction,
			delete: jest.fn().mockRejectedValue(),
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: { signatureId: 'signature-1', type: 'pending' },
			stubs: { WActions, 'c-operation-error': COperation },
		});

		await flushPromises();
		await wp.find('[data-testid="reject-operation"]').trigger('click');
		await flushPromises();

		expect(wp.find('[data-testid="operation-error"]').exists()).toBeTruthy();
	});

	it('should not show actions on signed operations', async () => {
		const signedOperations = [
			{
				signatureId: 'signature-1',
				operationType: 'transfer',
				operationDescription: 'transferencia',
				creationDate: '01/07/2021',
				signatureDate: null,
				status: 'signed',
				data: {
					amount: 123.45,
					currency: 'EUR',
					origin: 1234,
					destination: 5678,
				},
			},
		];

		store.mockModule('signatures', { get: jest.fn().mockResolvedValue(signedOperations) });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: {
				signatureId: 'signature-1',
				type: 'signed',
			},
			stubs: { WActions },
		});

		expect(wp.find('[data-testid="action-buttons"]').exists()).toBeFalsy();
	});

	it('should go back when no data is received', async () => {
		const back = jest.spyOn(router, 'back');

		store.mockModule('signatures', { get: jest.fn().mockResolvedValue() });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
			propsData: {
				signatureId: 'signature-1',
				type: 'signed',
			},
			stubs: { WActions },
		});

		await flushPromises();

		expect(back).toHaveBeenCalled();
	});
});
