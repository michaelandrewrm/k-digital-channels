import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Vuex from 'vuex';
import Component from '@views/v-customer-chat';
import liveagent from '@modules/liveagent/m-liveagent';
import projectStore from '@local-store';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

global.window.liveagent = {
	startChat: jest.fn(),
};

describe('v-customer-chat.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		store = new Vuex.Store({
			modules: { liveagent, ...projectStore },
			strict: false,
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			stubs: { CButton },
		});
	});

	it('has a name equal to v-customer-chat', () => {
		expect(wp.vm.$options.name).toBe('v-customer-chat');
	});

	it('should enable the chat when is online', async () => {
		expect(wp.find('[data-testid="offline-desc"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="online-desc"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="init-button"]').attributes('disabled')).toBeTruthy();
		await flushPromises();
		// Emulamos agente disponible
		store.dispatch('liveagent/eventHandler', 'BUTTON_AVAILABLE');
		await localVue.nextTick();
		expect(wp.find('[data-testid="offline-desc"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="online-desc"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="init-button"]').attributes('disabled')).toBeFalsy();
	});

	it('should start a chat', async () => {
		// Emulamos agente disponible
		store.dispatch('liveagent/eventHandler', 'BUTTON_AVAILABLE');
		await localVue.nextTick();
		wp.find('[data-testid="init-button"]').trigger('click');
		expect(window.liveagent.startChat).toHaveBeenCalled();
	});
});
