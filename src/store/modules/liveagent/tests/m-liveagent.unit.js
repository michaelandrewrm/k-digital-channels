import liveagent from '@modules/liveagent/m-liveagent';

const newInstance = createPristineVue();

describe('m-modal', () => {
	let store;

	const getPersonalDetails = jest.fn().mockResolvedValue({ data: { userId: 'user-id' } });

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		store.registerModule('app', {
			namespaced: true,
			state: { liveagent: { deployment: 'deployment-1', buttonId: 'button-1' } },
		});
		store.mockModule('user', { getPersonalDetails });
		store.registerModule('authn', { namespaced: true, state: { isEmbedded: false } });
		store.registerModule('liveagent', { ...liveagent });
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should not install the liveagent when the app is embedded', () => {
		store.unregisterModule('authn');
		store.registerModule('authn', { namespaced: true, state: { isEmbedded: true } });

		store.dispatch('liveagent/install');

		expect(document.querySelector('[data-indicator]')).toBeFalsy();
		expect(document.querySelector('[data-liveagent]')).toBeFalsy();
	});

	it('should add an indicator and script', () => {
		expect(document.querySelector('[data-indicator]')).toBeFalsy();
		expect(document.querySelector('[data-liveagent]')).toBeFalsy();

		store.dispatch('liveagent/install');

		expect(document.querySelector('[data-indicator]')).toBeTruthy();
		expect(document.querySelector('[data-liveagent]')).toBeTruthy();
	});

	it('should init a chat user session', async () => {
		window.liveagent = {
			addButtonEventHandler: jest.fn(),
			addCustomDetail: jest.fn(),
			init: jest.fn(),
		};

		await store.dispatch('liveagent/init');

		expect(window.liveagent.addButtonEventHandler).toHaveBeenCalledTimes(1);
		expect(window.liveagent.addCustomDetail).toHaveBeenCalledWith('digital_id', 'user-id', true);
		expect(window.liveagent.init).toHaveBeenCalledTimes(1);
	});

	it('should enable chat init button by setting the online state', () => {
		expect(store.state.liveagent.online).toBeFalsy();

		store.dispatch('liveagent/eventHandler', 'BUTTON_ACCEPTED');
		expect(store.state.liveagent.online).toBeTruthy();

		store.dispatch('liveagent/eventHandler', 'BUTTON_UNAVAILABLE');
		expect(store.state.liveagent.online).toBeFalsy();
	});
});
