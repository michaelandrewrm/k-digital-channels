import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import communications from '@modules/communications/m-communications';
import SessionCache from '@modules/session/session-cache';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('m-communications', () => {
	let store;

	beforeEach(() => {
		store = new Vuex.Store({
			modules: { communications },
			strict: false,
		});

		SessionCache.clear();
	});

	it('should call the service to post a feedback', async () => {
		const request = jest.fn().mockResolvedValue();

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		await store.dispatch('communications/postFeedback', { review: 'prueba', rate: 2 });

		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				payload: {
					review: 'prueba',
					rate: 2,
				},
			})
		);
	});

	it('should set unread messages counter on success', async () => {
		const request = jest.fn().mockResolvedValue({ data: { unreadMessages: 25 } });

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		expect(store.state.communications.unreadMessages).toBe(0);

		await store.dispatch('communications/getUnreadMessages');

		expect(store.state.communications.unreadMessages).toBe(25);
	});

	it('should set unread messages counter to zero when fail', async () => {
		const request = jest.fn().mockRejectedValue();

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		expect(store.state.communications.unreadMessages).toBe(0);

		await store.dispatch('communications/getUnreadMessages');

		expect(store.state.communications.unreadMessages).toBe(0);
	});

	it('should return a list with messages and cache it', async () => {
		const fixturePage1 = {
			data: [
				{
					id: '2a8520a5-381c-401d-9266-d111f5a23bc2',
					hasAttachment: false,
					text: 'Et sint dolor illum voluptas sapiente atque sint eum ad.',
					description: 'Voluptas omnis maiores quae.',
					expirationDate: '2021-09-30T06:04:19.401Z',
					reviewDate: '2020-07-26T01:57:28.491Z',
					creationDate: '2020-11-07T15:42:59.571Z',
					type: { id: 1, name: 'alerta' },
				},
			],
			paging: {
				hasMorePages: true,
				nextPaginationKey: '175a34b2-9614-4b0e-9dea-8c92414b8ff3',
			},
		};
		const fixturePage2 = {
			data: [
				{
					id: '175a34b2-9614-4b0e-9dea-8c92414b8ff3',
					hasAttachment: false,
					text: 'Est eius qui odio dolor reprehenderit minus nemo mollitia harum.',
					description: 'Unde fuga qui accusantium.',
					expirationDate: '2021-03-08T00:45:26.396Z',
					reviewDate: '2020-10-18T16:03:36.309Z',
					creationDate: '2020-06-14T05:15:32.314Z',
					type: { id: 1, name: 'alerta' },
				},
			],
			paging: {
				hasMorePages: false,
			},
		};
		const request = jest
			.fn()
			.mockResolvedValueOnce({ data: fixturePage1 })
			.mockResolvedValueOnce({ data: fixturePage2 });

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		const messageRequest = await store.dispatch('communications/getMessages');

		expect(messageRequest.data).toHaveLength(1);
		expect(request).toHaveBeenCalledTimes(1);

		const message = await store.dispatch(
			'communications/getMessage',
			'2a8520a5-381c-401d-9266-d111f5a23bc2'
		);

		expect(message).toMatchObject(messageRequest.data[0]);

		// verificamos el almacenamiento en cache comprobando
		// que no se haga otra llamada extra al servicio.
		const anotherMessageRequest = await store.dispatch('communications/getMessages');

		expect(anotherMessageRequest.data).toHaveLength(1);
		expect(request).toHaveBeenCalledTimes(1);

		// verificamos que la llamada a la siguiente página
		// sí haga una llamada al servicio saltandose el caché.
		const nextMessageRequest = await store.dispatch('communications/getMessages', {
			paginationKey: anotherMessageRequest.paging.nextPaginationKey,
		});

		expect(nextMessageRequest.data).toHaveLength(2);
		expect(request).toHaveBeenCalledTimes(2);
	});

	it('should return a list with documents and cache it', async () => {
		const fixturePage1 = {
			data: [
				{
					id: '2a8520a5-381c-401d-9266-d111f5a23bc2',
					hasAttachment: true,
					description: 'Voluptas omnis maiores quae.',
					reviewDate: '2020-07-26T01:57:28.491Z',
					creationDate: '2020-11-07T15:42:59.571Z',
					type: { id: 2, name: 'document' },
				},
			],
			paging: {
				hasMorePages: true,
				nextPaginationKey: '175a34b2-9614-4b0e-9dea-8c92414b8ff3',
			},
		};
		const fixturePage2 = {
			data: [
				{
					id: '175a34b2-9614-4b0e-9dea-8c92414b8ff3',
					hasAttachment: false,
					text: 'Est eius qui odio dolor reprehenderit minus nemo mollitia harum.',
					description: 'Unde fuga qui accusantium.',
					expirationDate: '2021-03-08T00:45:26.396Z',
					reviewDate: '2020-10-18T16:03:36.309Z',
					creationDate: '2020-06-14T05:15:32.314Z',
					type: { id: 2, name: 'document' },
				},
			],
			paging: {
				hasMorePages: false,
			},
		};
		const request = jest
			.fn()
			.mockResolvedValueOnce({ data: fixturePage1 })
			.mockResolvedValueOnce({ data: fixturePage2 });

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		const documentsRequest = await store.dispatch('communications/getDocuments');

		expect(documentsRequest.data).toHaveLength(1);
		expect(request).toHaveBeenCalledTimes(1);

		// verificamos el almacenamiento en cache comprobando
		// que no se haga otra llamada extra al servicio.
		const anotherDocumentsRequest = await store.dispatch('communications/getDocuments');

		expect(anotherDocumentsRequest.data).toHaveLength(1);
		expect(request).toHaveBeenCalledTimes(1);

		// verificamos que la llamada a la siguiente página
		// sí haga una llamada al servicio saltandose el caché.
		const nextDocumentsRequest = await store.dispatch('communications/getDocuments', {
			paginationKey: anotherDocumentsRequest.paging.nextPaginationKey,
		});

		expect(nextDocumentsRequest.data).toHaveLength(2);
		expect(request).toHaveBeenCalledTimes(2);

		const documentRequest = await store.dispatch(
			'communications/getDocument',
			'2a8520a5-381c-401d-9266-d111f5a23bc2'
		);

		expect(documentRequest).toMatchObject(fixturePage1.data[0]);
		expect(request).toHaveBeenCalledTimes(2);
	});

	it('should use date filters', async () => {
		const fixturePage1 = {
			data: [
				{
					id: '2a8520a5-381c-401d-9266-d111f5a23bc2',
					hasAttachment: true,
					description: 'Voluptas omnis maiores quae.',
					reviewDate: '2020-09-26T01:57:28.491Z',
					creationDate: '2020-09-30T15:42:59.571Z',
					type: { id: 2, name: 'alert' },
				},
			],
			paging: { hasMorePages: false },
		};
		const fixturePage2 = {
			data: [
				{
					id: '175a34b2-9614-4b0e-9dea-8c92414b8ff3',
					hasAttachment: false,
					text: 'Est eius qui odio dolor reprehenderit minus nemo mollitia harum.',
					description: 'Unde fuga qui accusantium.',
					expirationDate: '2021-03-08T00:45:26.396Z',
					reviewDate: '2020-10-18T16:03:36.309Z',
					creationDate: '2020-06-14T05:15:32.314Z',
					type: { id: 2, name: 'alert' },
				},
			],
			paging: { hasMorePages: false },
		};
		const request = jest
			.fn()
			.mockResolvedValueOnce({ data: fixturePage1 })
			.mockResolvedValueOnce({ data: fixturePage2 });

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		const messageRequest1 = await store.dispatch('communications/getMessages');
		const messageRequest2 = await store.dispatch('communications/getMessages', {
			dateFrom: '2020-09-04',
			dateTo: '2020-12-31',
		});

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: expect.objectContaining({ method: 'GET' }) },
				queryParams: { dateFrom: '2020-09-04', dateTo: '2020-12-31' },
			})
		);

		expect(messageRequest1.data).not.toMatchObject(messageRequest2.data);
	});

	it('should mark a message as read', async () => {
		const request = jest.fn().mockResolvedValueOnce();

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		await store.dispatch('communications/markMessageAsRead', { id: '1234', type: 1 });
		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: expect.objectContaining({ method: 'PATCH' }) },
				payload: { type: 1 },
			})
		);
	});

	it('should mark a document as read', async () => {
		const request = jest.fn().mockResolvedValueOnce();

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		await store.dispatch('communications/markDocumentAsRead', { id: '1234', type: 5 });
		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: expect.objectContaining({ method: 'PATCH' }) },
				payload: { type: 5 },
			})
		);
	});

	it('should clear the cache when it has new unread messages', async () => {
		const request = jest
			.fn()
			.mockResolvedValueOnce({ data: { unreadMessages: 25 } })
			.mockResolvedValueOnce({ data: { data: [] } })
			.mockResolvedValueOnce({ data: { unreadMessages: 25 } })
			.mockResolvedValueOnce({ data: { unreadMessages: 10 } })
			.mockResolvedValueOnce({ data: { data: [] } });

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		await store.dispatch('communications/getUnreadMessages');
		expect(request).toHaveBeenCalledTimes(1);

		await store.dispatch('communications/getMessages');
		expect(request).toHaveBeenCalledTimes(2);

		await store.dispatch('communications/getMessages');
		// Tira del caché, no realiza ninguna llamada
		expect(request).toHaveBeenCalledTimes(2);

		await store.dispatch('communications/getUnreadMessages');
		expect(request).toHaveBeenCalledTimes(3);

		await store.dispatch('communications/getMessages');
		// Tira del caché, porque siguen los mismos mensajes sin leer que antes
		expect(request).toHaveBeenCalledTimes(3);

		// En esta llamada, hay menos mensajes sin leer
		await store.dispatch('communications/getUnreadMessages');
		expect(request).toHaveBeenCalledTimes(4);

		await store.dispatch('communications/getMessages');
		// Ya no tira del caché, se realiza la petición
		expect(request).toHaveBeenCalledTimes(5);
	});

	it('should return pre-login announcements', async () => {
		const request = jest.fn().mockResolvedValueOnce({ data: { data: [] } });

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		store.registerModule('session', {
			namespaced: true,
			state: () => ({ lang: 'en' }),
		});

		store.registerModule('app', {
			namespaced: true,
			state: () => ({ companyId: 'BC' }),
		});

		await store.dispatch('communications/getAnnouncements', 'prelogin');
		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: {
					request: expect.objectContaining({
						url: expect.stringContaining('prelogin/communications'),
						method: 'GET',
					}),
				},
				queryParams: { language: 'en', company: 'BC' },
			})
		);
	});

	it('should use the cache to return anouncements when available', async () => {
		const request = jest.fn().mockResolvedValueOnce({ data: { data: [] } });

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		store.registerModule('session', {
			namespaced: true,
			state: () => ({ lang: 'en' }),
		});

		store.registerModule('app', {
			namespaced: true,
			state: () => ({ companyId: 'BC' }),
		});

		await store.dispatch('communications/getAnnouncements', 'prelogin');
		await store.dispatch('communications/getAnnouncements', 'prelogin');

		expect(request).toHaveBeenCalledTimes(1);
	});

	it('should return post-login announcements', async () => {
		const request = jest.fn().mockResolvedValueOnce({ data: { data: [1, 2, 3, 4, 5] } });

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		const results = await store.dispatch('communications/getAnnouncements', 'postlogin');

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: {
					request: expect.objectContaining({
						url: expect.stringContaining('communications/communications'),
						method: 'GET',
					}),
				},
				queryParams: { spaceId: 2 },
			})
		);

		expect(results).toHaveLength(3);
	});

	it('should change feedback of an announcement', async () => {
		const request = jest.fn().mockResolvedValueOnce({ data: { data: [] } });

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		await store.dispatch('communications/setAnnouncementFeedback', { id: 1, feedback: 0 });

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: {
					request: expect.objectContaining({
						url: expect.stringContaining('communications/communications/1'),
						method: 'PATCH',
					}),
				},
				payload: { feedback: 0 },
			})
		);
	});

	it('should change an impression of an announcement', async () => {
		const request = jest.fn().mockResolvedValueOnce({ data: { data: [] } });

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		await store.dispatch('communications/setAnnouncementImpression', 1);

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: {
					request: expect.objectContaining({
						url: expect.stringContaining('communications/communications/1'),
						method: 'PATCH',
					}),
				},
				payload: { impressions: 1 },
			})
		);
	});

	it('should download a document', async () => {
		const request = jest.fn().mockResolvedValueOnce({ data: 'pdf' });

		store.registerModule('service', {
			namespaced: true,
			actions: { request },
		});

		await store.dispatch('communications/downloadDocument', { id: 1, type: 'document' });

		expect(request).toHaveBeenLastCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: {
					request: expect.objectContaining({
						url: expect.stringContaining('communications/documents/1/document'),
						method: 'GET',
					}),
				},
				queryParams: { typeId: 'document' },
			})
		);
	});

	it('should not return any unread message when the app is embedded', async () => {
		const authn = {
			namespaced: true,
			state() {
				return { isEmbedded: true };
			},
		};

		store = new Vuex.Store({
			modules: { communications, authn },
			strict: false,
		});

		const response = await store.dispatch('communications/getUnreadMessages');

		expect(response).toMatchObject({ data: { unreadMessages: 0 } });
	});

	it('should not return any document when the app is embedded', async () => {
		const authn = {
			namespaced: true,
			state() {
				return { isEmbedded: true };
			},
		};

		store = new Vuex.Store({
			modules: { communications, authn },
			strict: false,
		});

		const response = await store.dispatch('communications/getDocuments');

		expect(response).toMatchObject({ data: [] });
	});

	it('should not return any message when the app is embedded', async () => {
		const authn = {
			namespaced: true,
			state() {
				return { isEmbedded: true };
			},
		};

		store = new Vuex.Store({
			modules: { communications, authn },
			strict: false,
		});

		const response = await store.dispatch('communications/getMessages');

		expect(response).toMatchObject({ data: [] });
	});
});
