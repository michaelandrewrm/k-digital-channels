import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-unlock-user.vue';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-unlock-user.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		store.registerModule('app', {
			namespaced: true,
			state() {
				return { telephone: '786 523 102', email: 'test@testing.com' };
			},
		});

		wp = shallowMount(Component, { localVue, store, stubs: { LModal } });
	});

	it('has a name equal to m-unlock-user', () => {
		expect(wp.vm.$options.name).toBe('m-unlock-user');
	});
});
