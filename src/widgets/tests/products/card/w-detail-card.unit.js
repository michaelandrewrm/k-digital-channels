import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { typesByTitle } from '@modules/products/product-types';
import Component from '@widgets/products/card/w-detail-card.vue';
import CButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-detail-card.vue', () => {
	let wp;
	let store;

	const fixture = {
		id: 'card-1',
		chargeAccount: {
			id: '1234',
			productNumber: { format: { id: 'IBAN' }, value: 'ES3102340098375445122708' },
		},
		productType: { id: typesByTitle.card },
		productNumber: { format: { id: 'PAN' }, value: '1234567890123456' },
		interveners: [],
		expirationDate: '2021-12-31',
		openingDate: '2018-11-22',
		lastUseDate: '2020-10-14',
	};

	const CListIconItem = {
		template: `
			<div>
				<span v-if="$slots.default">
					<slot/>
				</span>
				<span v-else-if="description">
					{{description}}
				</span>
			</div>
		`,
		props: ['description'],
	};

	const get = jest
		.fn()
		.mockResolvedValue({ name: 'Cuenta transparente', relationType: { id: '01' } });
	const getCardCVV = jest.fn().mockResolvedValue('123');
	const getCardPIN = jest.fn().mockResolvedValue('1234');
	const getCardPAN = jest.fn().mockResolvedValue('1234567890123456');

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('app', { namespaced: true, state: { companyId: 'BC' } });
		store.registerModule('authn', { namespaced: true, state: { isEmbedded: null } });
		store.mockModule('products', { get, getCardCVV, getCardPIN, getCardPAN });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { detail: fixture },
			stubs: { CIconButton: CButton, CListIconItem },
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('has a name equal to w-detail-card', () => {
		expect(wp.vm.$options.name).toBe('w-detail-card');
	});

	it('should render correctly', async () => {
		expect(wp.find('[data-testid="detail-card-account"]').text()).toBe(
			'Cuenta transparente **** **** **** **** **** 2708'
		);
		expect(wp.find('[data-testid="detail-secret-pan"]').text()).toBe('1234 56** **** 3456');
		expect(wp.find('[data-testid="detail-secret-expiration-date"]').text()).toBe('• • / • •');
		expect(wp.find('[data-testid="detail-secret-cvv"]').text()).toBe('• • •');
		expect(wp.find('[data-testid="detail-secret-pin"]').text()).toBe('• • • •');
		expect(wp.find('[data-testid="detail-opening-date"]').text()).toBe('22/11/2018');
		expect(wp.find('[data-testid="detail-last-use-date"]').text()).toBe('14/10/2020');
	});

	it('should request a PAN', async () => {
		expect(wp.find('[data-testid="detail-secret-pan"]').text()).toBe('1234 56** **** 3456');

		await wp.find('[data-testid="request-pan-button"]').trigger('click');
		await flushPromises();

		expect(wp.find('[data-testid="detail-secret-pan"]').text()).toBe('1234 5678 9012 3456');
	});

	it('should request a expiration date and CVV', async () => {
		expect(wp.find('[data-testid="detail-secret-expiration-date"]').text()).toBe('• • / • •');
		expect(wp.find('[data-testid="detail-secret-cvv"]').text()).toBe('• • •');

		await wp.find('[data-testid="request-cvv-button"]').trigger('click');
		await flushPromises();

		expect(wp.find('[data-testid="detail-secret-expiration-date"]').text()).toBe('12 / 2021');
		expect(wp.find('[data-testid="detail-secret-cvv"]').text()).toBe('123');
	});

	it('should request a PIN', async () => {
		expect(wp.find('[data-testid="detail-secret-pin"]').text()).toBe('• • • •');

		await wp.find('[data-testid="request-pin-button"]').trigger('click');
		await flushPromises();

		expect(wp.find('[data-testid="detail-secret-pin"]').text()).toBe('1234');
	});

	it('should not allow a PAN, CVV or PIN request when is embedded', async () => {
		store.unregisterModule('authn');
		store.registerModule('authn', { namespaced: true, state: { isEmbedded: true } });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { detail: fixture },
			stubs: { CIconButton: CButton, CListIconItem },
		});

		expect(wp.find('[data-testid="request-pan-button"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="request-cvv-button"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="request-pin-button"]').exists()).toBeFalsy();
	});
});
