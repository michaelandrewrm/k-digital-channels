import secure from '@modules/secure/m-secure';
import { encryptRSA, getRSAKey } from '@modules/secure/cypher';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';

describe('m-secure', () => {
	let store;
	let storeMocked;

	beforeEach(async () => {
		const localVue = createLocalVue();
		localVue.use(Vuex);

		storeMocked = {
			service: {
				namespaced: true,
				state: {
					baseURL: '//localhost/',
				},
			},
		};

		store = new Vuex.Store({
			modules: {
				...storeMocked,
				secure,
			},
			strict: false,
		});
	});

	it('creates a new session', async () => {
		secure.modules.publicService.actions.request = jest
			.fn(secure.modules.publicService.actions.request)
			.mockImplementationOnce(async (noStore, { headers }) => {
				const rawPublicKey = headers['public-key'];
				const publicKey = await getRSAKey(rawPublicKey);

				const data = await encryptRSA(publicKey, {
					seed: 'JSCTuP78F0FG/fzKy944IA==',
					symmetricKey: 'TnLL/gFtg3xAdO5QbLROyqjnsOWd0M1QsEo8Ri+Ta1Q=',
					uuid: '46488d3b-9d44-4072-88ed-e0528d4892b8',
				});

				return {
					status: 200,
					data,
				};
			});

		store = new Vuex.Store({
			modules: {
				...storeMocked,
				secure,
			},
			strict: false,
		});

		await store.dispatch('secure/createSession');

		const encData = 'Lq/m9kKFayoaNWVfguQzag==';
		const decData = await store.dispatch('secure/decrypt', encData);

		expect(decData).toBe('hola mundo!');
	});

	it('should reject if there is not data after try to create a new session', async () => {
		secure.modules.publicService.actions.request = jest
			.fn(secure.modules.publicService.actions.request)
			.mockImplementationOnce(() => ({
				status: 200,
				data: '',
			}));

		store = new Vuex.Store({
			modules: {
				...storeMocked,
				secure,
			},
			strict: false,
		});

		store.dispatch('secure/createSession').catch((err) => {
			expect(err).toBeTruthy();
		});
	});

	it('encrypt and decrypt a string', async () => {
		expect.assertions(2);

		store.commit('secure/SET_SESSION_DATA', {
			seed: 'JSCTuP78F0FG/fzKy944IA==',
			symmetricKey: 'TnLL/gFtg3xAdO5QbLROyqjnsOWd0M1QsEo8Ri+Ta1Q=',
			uuid: '46488d3b-9d44-4072-88ed-e0528d4892b8',
		});

		const encData = await store.dispatch('secure/encrypt', 'hola mundo!');
		const decData = await store.dispatch('secure/decrypt', encData);

		expect(decData).toBe('hola mundo!');
	});

	it('removes a session', async () => {
		expect.assertions(3);

		// Expect symmetricKey to be null on start (CD-1580)
		expect(store.state.secure.symmetricKey).toBeNull();

		store.commit('secure/SET_SESSION_DATA', {
			seed: 'JSCTuP78F0FG/fzKy944IA==',
			symmetricKey: 'TnLL/gFtg3xAdO5QbLROyqjnsOWd0M1QsEo8Ri+Ta1Q=',
			uuid: '46488d3b-9d44-4072-88ed-e0528d4892b8',
		});

		expect(store.state.secure.symmetricKey).not.toBeNull();

		await store.dispatch('secure/removeSession');

		expect(store.state.secure.symmetricKey).toBeNull();
	});

	it('should refresh a session', async () => {
		const secureSession = {
			seed: 'Lbf+g+nvRQ8PwE/W3dxJzw==',
			symmetricKey: 'SpMu6X0YWkU8mba8DgwGHCkNEiDYMpIVKqUivx0Y8ac=',
			uuid: 'dc569939-52d0-40b2-8c0d-48800e8f2884',
		};

		secure.modules.publicService.actions.request = jest
			.fn(secure.modules.publicService.actions.request)
			.mockImplementationOnce(async (noStore, { headers }) => {
				const rawPublicKey = headers['public-key'];
				const publicKey = await getRSAKey(rawPublicKey);

				const data = await encryptRSA(publicKey, secureSession);

				return {
					status: 200,
					data,
				};
			});

		store = new Vuex.Store({
			modules: {
				...storeMocked,
				secure,
			},
			strict: false,
		});

		store.commit('secure/SET_SESSION_DATA', {
			seed: 'JSCTuP78F0FG/fzKy944IA==',
			symmetricKey: 'TnLL/gFtg3xAdO5QbLROyqjnsOWd0M1QsEo8Ri+Ta1Q=',
			uuid: '46488d3b-9d44-4072-88ed-e0528d4892b8',
		});

		expect(store.state.secure.symmetricKey).not.toBeNull();

		await store.dispatch('secure/refreshSession');

		expect(store.state.secure).toMatchObject(secureSession);
	});
});
