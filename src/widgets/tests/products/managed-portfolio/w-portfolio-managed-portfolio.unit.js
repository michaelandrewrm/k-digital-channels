import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/managed-portfolio/w-portfolio-managed-portfolio.vue';
import { intervenersByTitle } from '@modules/products/product-interveners';
import { typesByTitle } from '@modules/products/product-types';
import { subtypesByTitle } from '@modules/products/product-subtypes';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-portfolio-managed-portfolio.vue', () => {
	let wp;

	const fixture = [
		{
			id: 'cfc2f9a0-ec13-4889-b624-8738cdbd24df',
			alias: 'Cuenta Corriente',
			productType: { id: typesByTitle.account },
			productSubtype: { id: subtypesByTitle['managed-account'] },
			relationType: { id: intervenersByTitle.holder },
			balance: { amount: 106.58, currency: { id: 'EUR' } },
			productNumber: { format: { id: 'IBAN' }, value: '2708' },
			parentId: '6699',
		},
		{
			id: '19d0as9d098a-awd9aw0d98-awdawjodiawjd-21',
			alias: 'Cuenta Corriente en dólares',
			productType: { id: typesByTitle.account },
			productSubtype: { id: subtypesByTitle['managed-currency-account'] },
			relationType: { id: intervenersByTitle.holder },
			balance: { amount: 100, currency: { id: 'USD' } },
			productNumber: { format: { id: 'IBAN' }, value: '3212' },
			parentId: '6699',
		},
		{
			id: '320910asd-qa2e-a2r12341239841-2123',
			alias: 'Cuenta Corriente en libras',
			productType: { id: typesByTitle.account },
			productSubtype: { id: subtypesByTitle['managed-currency-account'] },
			relationType: { id: intervenersByTitle.holder },
			balance: { amount: 200, currency: { id: 'GBP' } },
			productNumber: { format: { id: 'IBAN' }, value: '3231' },
			parentId: '6699',
		},
		{
			id: 'ds90a9d0aw-da020e021321-31231234asd',
			alias: 'Cuenta Corriente en libras',
			productType: { id: typesByTitle.account },
			productSubtype: { id: subtypesByTitle['managed-currency-account'] },
			relationType: { id: intervenersByTitle.holder },
			balance: { amount: 100, currency: { id: 'GBP' } },
			productNumber: { format: { id: 'IBAN' }, value: '2998' },
			parentId: '6699',
		},
		{
			id: 'f9a027a8-987e-46a9-9d4c-796e517f1013',
			alias: 'Depósito Caminos',
			productType: { id: typesByTitle.deposit },
			productSubtype: { id: subtypesByTitle['managed-deposit'] },
			relationType: { id: intervenersByTitle.holder },
			balance: { amount: 982.8, currency: { id: 'EUR' } },
			productNumber: { format: { id: 'FIDES' }, value: '1755' },
			parentId: '6699',
		},
		{
			id: '1203980asd80f901c2930-aw9832ure23',
			alias: 'Tarjeta débito',
			productType: { id: typesByTitle.card },
			productSubtype: { id: subtypesByTitle['debit-card'] },
			relationType: { id: intervenersByTitle.holder },
			balance: { amount: 213, currency: { id: 'EUR' } },
			productNumber: { format: { id: 'FIDES' }, value: '0031' },
			parentId: '1234',
		},
	];

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: { source: fixture, productId: '6699' },
		});
	});

	it('has a name equal to w-portfolio-managed-portfolio', () => {
		expect(wp.vm.$options.name).toBe('w-portfolio-managed-portfolio');
	});

	it('renders correctly', () => {
		expect(wp.element).toMatchSnapshot();
	});
});
