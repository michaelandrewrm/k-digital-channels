import loading from '@modules/loading/m-loading';

const newInstance = createPristineVue();

describe('m-loading', () => {
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('loading', loading);
	});

	it('should update the status state', async () => {
		await store.dispatch('loading/start');
		expect(store.state.loading.status).toBeTruthy();

		await store.dispatch('loading/end');
		expect(store.state.loading.status).toBeFalsy();
	});
});
