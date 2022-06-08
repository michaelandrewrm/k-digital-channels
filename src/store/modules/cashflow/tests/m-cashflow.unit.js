import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import cashflow from '@modules/cashflow/m-cashflow';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('m-cashflow', () => {
	it('should get the cashflow state', async () => {
		const request = jest.fn().mockResolvedValue({ data: { data: { abc: 123 } } });
		const service = { namespaced: true, actions: { request } };
		const store = new Vuex.Store({ modules: { service, cashflow } });

		expect(request).toBeCalledTimes(0);
		const data = await store.dispatch('cashflow/fetch');

		expect(data).toMatchObject({ abc: 123 });

		expect(request).toBeCalledTimes(1);
		expect(request).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				service: { request: { method: 'GET', url: '/cashflow' } },
			})
		);

		const data2 = await store.dispatch('cashflow/fetch');
		expect(data2).toMatchObject({ abc: 123 });

		// data2 came from cache!
		expect(request).toBeCalledTimes(1);
	});
});
