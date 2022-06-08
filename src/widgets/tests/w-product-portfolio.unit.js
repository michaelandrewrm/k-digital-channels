import flushPromises from 'flush-promises';
import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-product-portfolio';
import { intervenersByTitle } from '@modules/products/product-interveners';
import { typesByTitle } from '@modules/products/product-types';
import { subtypesByTitle } from '@modules/products/product-subtypes';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-product-portfolio.vue', () => {
	let wp;
	let store;

	const fixture = [
		{
			id: 'cfc2f9a0-ec13-4889-b624-8738cdbd24df',
			alias: 'Cuenta Corriente',
			productType: { id: typesByTitle.account },
			productSubtype: { id: subtypesByTitle['managed-account'] },
			relationType: { id: intervenersByTitle.holder },
			balance: { amount: 106.58, currency: { id: 'EUR' } },
			productNumber: { format: { id: 'IBAN' }, value: '2708' },
			parentId: 'abc123',
		},
		{
			id: 'f9a027a8-987e-46a9-9d4c-796e517f1013',
			alias: 'Depósito Caminos',
			productType: { id: typesByTitle.deposit },
			productSubtype: { id: subtypesByTitle['managed-deposit'] },
			relationType: { id: intervenersByTitle.holder },
			balance: { amount: 982.8, currency: { id: 'EUR' } },
			productNumber: { format: { id: 'FIDES' }, value: '1755' },
			parentId: 'abc123',
		},
	];

	beforeEach(() => {
		jest.useFakeTimers();
		const { localStore } = newInstance;

		store = localStore;
	});

	it('has a name equal to w-product-portfolio', () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			sync: false,
			propsData: {
				productId: 'abc123',
			},
		});

		expect(wp.vm.$options.name).toBe('w-product-portfolio');
	});

	it('filter products by parentId', async () => {
		store.registerModule('products', {
			namespaced: true,
			actions: { fetch: jest.fn().mockResolvedValue(fixture) },
		});

		wp = shallowMount(Component, {
			localVue,
			store,
			sync: false,
			propsData: {
				type: 'managed-portfolio',
				productId: 'abc123',
			},
			stubs: ['w-portfolio-managed-portfolio'],
		});

		jest.advanceTimersByTime(200);
		expect(wp.vm.loading).toBeTruthy();

		await flushPromises();

		expect(wp.vm.source).toBeTruthy();
		expect(wp.vm.loading).toBeFalsy();
	});
});
