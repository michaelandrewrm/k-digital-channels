import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-bizum-selae.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

const date = new Date(new Date().getTime() + 10 * 60000);
const formatDate = `${date.getUTCFullYear()}-${`0${date.getUTCMonth() + 1}`.slice(
	-2
)}-${`0${date.getUTCDate()}`.slice(-2)} ${`0${date.getUTCHours()}`.slice(
	-2
)}:${`0${date.getUTCMinutes()}`.slice(-2)}:${`0${date.getUTCSeconds()}`.slice(-2)}`;

describe('v-bizum-selae', () => {
	let wp;
	let store;
	let router;

	beforeEach(() => {
		jest.useFakeTimers();

		const { shallowStore, localRouter } = newInstance;

		store = shallowStore;
		router = localRouter;

		const getQRCode = jest.fn().mockResolvedValue({
			data: {
				QR: 'test',
				expirationDate: formatDate,
				id: 'test_id',
			},
			result: {
				code: 'C200000000',
				info: 'Operación realizada correctamente',
			},
		});

		const getQRImage = jest.fn().mockResolvedValue({
			image: 'testQR',
		});

		const getSelaeOperation = jest.fn().mockResolvedValue({
			status: 200,
			data: {
				data: {
					status: 'VALIDATED',
					reason: 'Pago en apuestas y loterias',
					date: '2022-02-18 10:22:03.0',
					amount: {
						amount: '2.00',
						currency: {
							id: 'EUR',
							code: '978',
						},
					},
					operationType: 'PAGO-PREMIOS',
				},
			},
		});

		const open = jest.fn();

		store.mockModule('bizum', { getQRCode, getQRImage, getSelaeOperation });

		store.mockModule('notification', { open });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.resetModules();
	});

	it('has a name equal to v-bizum-selae', () => {
		expect(wp.vm.$options.name).toBe('v-bizum-selae');
	});

	it('should render correctly', async () => {
		await flushPromises();

		expect(wp.find('[data-testid="qr"]').exists()).toBeTruthy();

		expect(wp.find('[data-testid="description"]').text()).toBe(
			'Muestra este código en la Administración de Loterías para que lo escaneen y puedas realizar la operación'
		);

		expect(wp.find('[data-testid="timer"]').exists()).toBeTruthy();
	});

	it('should return ten minutes at start', () => {
		expect(wp.vm.time).toBe('10:00');
	});

	it('should go back when QR is not fetched', async () => {
		const back = jest.spyOn(router, 'back');

		const getQRCode = jest.fn().mockResolvedValue();

		const getQRImage = jest.fn().mockResolvedValue({
			image: 'testQR',
		});

		const getSelaeOperation = jest.fn().mockResolvedValue({
			status: 200,
			data: {
				status: 'VALIDATED',
				reason: 'Pago en apuestas y loterias',
				date: '2022-02-18 10:22:03.0',
				amount: {
					amount: '2.00',
					currency: {
						id: 'EUR',
						code: '978',
					},
				},
				operationType: 'PAGO-PREMIOS',
			},
		});

		store.mockModule('bizum', { getQRCode, getQRImage, getSelaeOperation });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
		});

		await flushPromises();

		expect(back).toHaveBeenCalled();
	});

	it('should go back when QR generation fail', async () => {
		const getQRCode = jest.fn().mockResolvedValue({
			data: {
				QR: 'test',
				expirationDate: formatDate,
				id: 'test_id',
			},
			result: {
				code: 'C200000000',
				info: 'Operación realizada correctamente',
			},
		});

		const getQRImage = jest.fn().mockRejectedValue();

		const getSelaeOperation = jest.fn().mockResolvedValue({
			status: 200,
			data: {
				data: {
					status: 'VALIDATED',
					reason: 'Pago en apuestas y loterias',
					date: '2022-02-18 10:22:03.0',
					amount: {
						amount: '2.00',
						currency: {
							id: 'EUR',
							code: '978',
						},
					},
					operationType: 'PAGO-PREMIOS',
				},
			},
		});

		const open = jest.fn();

		const back = jest.spyOn(router, 'back');

		store.mockModule('bizum', { getQRCode, getQRImage, getSelaeOperation });

		store.mockModule('notification', { open });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
		});

		await flushPromises();

		await flushPromises();

		expect(back).toHaveBeenCalled();
		expect(open).toHaveBeenCalled();
	});

	it('should go back when QR request fails', async () => {
		const back = jest.spyOn(router, 'back');

		const getQRCode = jest.fn().mockRejectedValue();

		const getQRImage = jest.fn().mockResolvedValue({
			image: 'testQR',
		});

		const getSelaeOperation = jest.fn().mockResolvedValue({
			status: 200,
			data: {
				status: 'VALIDATED',
				reason: 'Pago en apuestas y loterias',
				date: '2022-02-18 10:22:03.0',
				amount: {
					amount: '2.00',
					currency: {
						id: 'EUR',
						code: '978',
					},
				},
				operationType: 'PAGO-PREMIOS',
			},
		});

		store.mockModule('bizum', { getQRCode, getQRImage, getSelaeOperation });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
		});

		await flushPromises();

		expect(back).toHaveBeenCalled();
	});

	it('should check operation status', async () => {
		const checkOperation = jest.spyOn(wp.vm, 'checkOperation');

		await flushPromises();

		jest.advanceTimersToNextTimer();

		await flushPromises();

		expect(checkOperation).toHaveBeenCalled();
	});

	it('should show details when 200 status', async () => {
		const replace = jest.spyOn(router, 'replace');

		await flushPromises();

		jest.advanceTimersToNextTimer();

		await flushPromises();

		expect(replace).toHaveBeenCalledWith({
			name: 'bizum-selae-detail',
			params: {
				success: true,
				source: {
					status: 'VALIDATED',
					reason: 'Pago en apuestas y loterias',
					date: '2022-02-18 10:22:03.0',
					amount: {
						amount: '2.00',
						currency: {
							id: 'EUR',
							code: '978',
						},
					},
					operationType: 'PAGO-PREMIOS',
				},
			},
		});
	});

	it('should show error detail when 500 status', async () => {
		wp.destroy();

		const replace = jest.spyOn(router, 'replace');

		const getQRCode = jest.fn().mockResolvedValue({
			data: {
				QR: 'test',
				expirationDate: formatDate,
				id: 'test_id',
			},
			result: {
				code: 'C200000000',
				info: 'Operación realizada correctamente',
			},
		});

		const getQRImage = jest.fn().mockResolvedValue({
			image: 'testQR',
		});

		const getSelaeOperation = jest.fn().mockRejectedValue({
			status: 500,
		});

		const open = jest.fn();

		store.mockModule('bizum', { getQRCode, getQRImage, getSelaeOperation });

		store.mockModule('notification', { open });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
		});

		await flushPromises();

		jest.advanceTimersToNextTimer();

		await flushPromises();

		expect(replace).toHaveBeenCalledWith({
			name: 'bizum-selae-detail',
			params: {
				error: true,
				errorTitle: 'Ha habido un error con el cobro',
				errorDetail:
					'Ha habido un error en el cobro.\nPuedes ponerte en contacto con nosotros para mayor información.',
			},
		});
	});

	it('should do nothing when 404 status', async () => {
		wp.destroy();

		const push = jest.spyOn(router, 'push');

		const getQRCode = jest.fn().mockResolvedValue({
			data: {
				QR: 'test',
				expirationDate: formatDate,
				id: 'test_id',
			},
			result: {
				code: 'C200000000',
				info: 'Operación realizada correctamente',
			},
		});

		const getQRImage = jest.fn().mockResolvedValue({
			image: 'testQR',
		});

		const getSelaeOperation = jest.fn().mockRejectedValue({
			status: 404,
		});

		const open = jest.fn();

		store.mockModule('bizum', { getQRCode, getQRImage, getSelaeOperation });

		store.mockModule('notification', { open });

		wp = shallowMount(Component, {
			localVue,
			store,
			router,
		});

		await flushPromises();

		jest.advanceTimersToNextTimer();

		await flushPromises();

		expect(push).not.toHaveBeenCalled();
	});
});
