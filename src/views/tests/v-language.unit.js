import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-language.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-language.vue', () => {
	let wp;
	let store;
	let session;

	beforeEach(() => {
		const { localStore } = newInstance;

		store = localStore;
		session = {
			namespaced: true,
			state() {
				return { lang: 'ca' };
			},
			actions: { changeLanguage: jest.fn() },
		};

		if (store.hasModule('session')) {
			store.unregisterModule('session');
		}

		store.registerModule('session', session);

		wp = shallowMount(Component, { localVue, store });
	});

	it('has a name equal to v-language', () => {
		expect(wp.vm.$options.name).toBe('v-language');
	});

	it('change the language on button click', async () => {
		await wp.find('[data-test-id="change-lang-es"]').vm.$emit('click');
		await flushPromises();

		expect(session.actions.changeLanguage).toHaveBeenCalledWith(expect.anything(), 'es');
	});
});
