import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-sirvase-requests.vue';
import flushPromises from 'flush-promises';
import WList from '@tests/stubs/w-list.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-sirvase-requests.vue', () => {
	let wp;
	let store;
	let router;

	const item1 = {
		id: '1',
		type: {
			id: '01',
			name_es: 'Transferencias y traspasos',
			name_en: 'Transfers',
		},
		requestDate: '12-04-2022 23:00:00',
		status: {
			id: '01',
			name_es: 'Solicitada',
			name_en: 'Requested',
		},
	};

	const item2 = {
		id: '2',
		type: {
			id: '02',
			name_es: 'Devolución de adeudos',
			name_en: 'Debt reimbursement',
		},
		requestDate: '13-04-2022 23:00:00',
		status: {
			id: '02',
			name_es: 'Realizada',
			name_en: 'Done',
		},
	};

	const item3 = {
		id: '3',
		type: {
			id: '03',
			name_es: 'Devolución de adeudos',
			name_en: 'Debt reimbursement',
		},
		requestDate: '14-04-2022 23:00:00',
		status: {
			id: '03',
			name_es: 'Expirada',
			name_en: 'Expirated',
		},
	};

	const get = jest.fn().mockResolvedValue({ data: [item1, item2, item3] });

	beforeEach(() => {
		const { shallowStore, shallowRouter } = newInstance;

		store = shallowStore;
		router = shallowRouter;

		store.mockModule('sirvase', { get });
	});

	it('has a name equal to w-sirvase-requests', () => {
		wp = shallowMount(Component, { localVue, store, router });

		expect(wp.vm.$options.name).toBe('w-sirvase-requests');
	});

	it('should fetch the movements', async () => {
		wp = shallowMount(Component, { localVue, store, router, stubs: { WList } });

		await flushPromises();

		expect(get).toHaveBeenCalled();
	});

	it('should fetch the movements with paging', async () => {
		const getAction = jest.fn().mockResolvedValue({
			data: [item1, item2, item3],
			paging: { hasMorePages: true, nextPaginationKey: 0 },
		});
		store.mockModule('sirvase', { get: getAction });

		wp = shallowMount(Component, { localVue, store, router, stubs: { WList } });

		await flushPromises();

		expect(getAction).toHaveBeenCalled();
	});
});
