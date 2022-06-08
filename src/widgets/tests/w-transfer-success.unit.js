import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-success.vue';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const model = {
	reference: '9b2e9a7d-86c0-4c26-8f25-678186ec07be',
	orderer: {
		fromAccount: {
			id: 'cfc2f9a0-ec13-4889-b624-8738cdbd24df',
			icon: {},
			info: 'Disponible',
			alias: 'Cuenta Corriente',
			balance: { amount: 106.58, currency: { id: 'EUR' } },
			productNumber: { format: { id: 'IBAN', name: 'IBAN' }, value: '2708' },
		},
	},
	beneficiary: {
		description: 'LUCIO KRAKOVICH',
		toAccount: {
			productNumber: {
				format: { id: 'IBAN' },
				value: 'RO09BCYP0000001234567890',
			},
		},
		favorite: false,
	},
	transferMode: 'SEPA',
	amount: { amount: 20, currency: { id: 'EUR' } },
	reason: 'Transferencia',
	periodicity: 'today',
	date: '2020-08-21T07:21:09.842Z',
	frequency: null,
	maxDate: null,
	fees: {
		fee: { amount: 0.6, currency: { id: 'EUR' } },
		expense: { amount: 0, currency: { id: 'EUR' } },
		total: { amount: 20, currency: { id: 'EUR' } },
	},
	chargeBearer: 'SHA',
};

const blob =
	'JVBERi0xLg10cmFpbGVyPDwvUm9vdDw8L1BhZ2VzPDwvS2lkc1s8PC9NZWRpYUJveFswIDAgMyAzXT4+XT4+Pj4+Pg==';

describe('w-transfer-success.vue', () => {
	let router;
	let store;

	beforeEach(() => {
		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;
	});

	it('has a name equal to w-transfer-success', () => {
		const wp = shallowMount(Component, {
			localVue,
			router,
			propsData: { model, title: '' },
		});

		expect(wp.vm.$options.name).toBe('w-transfer-success');
	});

	/**
	 * Al hacer click en descargar documento debería abrir una notificación
	 * con un channel en el que se pase el blob del documento generado.
	 */
	it('should download the receipt', async () => {
		const open = jest.fn().mockResolvedValue();
		const getReceipt = jest.fn().mockResolvedValue(blob);

		store.mockModule('move-money', { getReceipt });
		store.mockModule('notification', { open });

		const wp = await shallowMount(Component, {
			localVue,
			router,
			store,
			propsData: { model, title: '' },
		});

		await wp.find('[data-testid="download-document"]').trigger('click');
		await flushPromises();

		expect(getReceipt).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				reference: '9b2e9a7d-86c0-4c26-8f25-678186ec07be',
				transferMode: 'SEPA',
				reportType: 'pdf',
			})
		);

		expect(open.mock.calls[0][1].props.channel.port1.postMessage).toHaveBeenCalledWith({
			name: 'downloaded',
			blob: expect.any(Blob),
			b64Data:
				'JVBERi0xLg10cmFpbGVyPDwvUm9vdDw8L1BhZ2VzPDwvS2lkc1s8PC9NZWRpYUJveFswIDAgMyAzXT4+XT4+Pj4+Pg==',
		});
	});

	it('should not show download the receipt after cancel a transfer', async () => {
		const open = jest.fn().mockResolvedValue();
		const getReceipt = jest.fn().mockResolvedValue(blob);

		store.mockModule('move-money', { getReceipt });
		store.mockModule('notification', { open });

		const wp = await shallowMount(Component, {
			localVue,
			router,
			store,
			propsData: { model, title: '', action: 'cancel' },
		});

		expect(wp.find('[data-testid="download-document"]').exists()).toBeFalsy();
	});

	/**
	 * Al hacer click en descargar documento debería abrir una notificación
	 * con un channel en el que se pase el blob del documento generado. Pero
	 * si la generación falla, el channel debería lanzar error.
	 */
	it('should fail downloading the receipt', async () => {
		const open = jest.fn().mockResolvedValue();
		const getReceipt = jest.fn().mockRejectedValue();

		store.mockModule('move-money', { getReceipt });
		store.mockModule('notification', { open });

		const wp = await shallowMount(Component, {
			localVue,
			router,
			store,
			propsData: { model, title: '' },
		});

		await wp.find('[data-testid="download-document"]').trigger('click');
		await flushPromises();

		expect(getReceipt).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				reference: '9b2e9a7d-86c0-4c26-8f25-678186ec07be',
				transferMode: 'SEPA',
				reportType: 'pdf',
			})
		);

		expect(open.mock.calls[0][1].props.channel.port1.postMessage).toHaveBeenCalledWith({
			name: 'error',
		});
	});
});
