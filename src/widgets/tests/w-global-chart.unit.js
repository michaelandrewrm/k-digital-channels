import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-global-chart.vue';
import Vuex from 'vuex';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-global-chart.vue', () => {
	let store;
	let wp;
	let cashflow;

	beforeEach(() => {
		cashflow = {
			namespaced: true,
			actions: { fetch: jest.fn().mockResolvedValue({ data: [] }) },
		};

		store = new Vuex.Store({ modules: { cashflow } });

		wp = shallowMount(Component, { localVue, store });
	});

	it('has a name equal to w-global-chart', () => {
		expect(wp.vm.$options.name).toBe('w-global-chart');
	});

	it('should fetch data', () => {
		expect(cashflow.actions.fetch).toHaveBeenCalledTimes(1);
	});
});
