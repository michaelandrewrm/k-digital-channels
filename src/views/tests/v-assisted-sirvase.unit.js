import { shallowMount } from '@vue/test-utils';
import Component from '@views/v-assisted-sirvase';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-assisted-sirvase.vue', () => {
	let wp;
	let store;

	const setRequestStatus = jest.fn().mockResolvedValue();
	const open = jest.fn().mockResolvedValue();

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('sirvase', { setRequestStatus });
		store.mockModule('modal', { open });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: {
				session: {
					isLoading: true,
					sirvase: {
						response: [],
					},
				},
			},
		});
	});

	it('has a name equal to v-assisted-sirvase', () => {
		expect(wp.vm.$options.name).toBe('v-assisted-sirvase');
	});
});
