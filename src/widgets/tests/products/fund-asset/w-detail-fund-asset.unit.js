import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/fund-asset/w-detail-fund-asset';
import CIconButton from '@tests/stubs/c-button.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-detail-fund-asset.vue', () => {
	let wp;
	let store;

	const fixture = {
		id: 'fund-asset-1',
		amount: { amount: 123.45, currency: { id: 'EUR' } },
		connectedAccount: { value: '', format: '' },
		costEffectiveness: 123.45,
		effectiveValue: { amount: 123.45, currency: { id: 'EUR' } },
		interveners: [],
		isin: '',
		liquidationValueDate: '2022-01-01',
		liquidationValue: { amount: 123.456942, currency: { id: 'EUR' } },
		monthCostEffectiveness: '',
		unityQuantity: 12.345,
		yearCostEffectiveness: '',
	};

	const open = jest.fn().mockResolvedValue();

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.mockModule('modal', { open });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { detail: fixture },
			stubs: { CIconButton },
		});
	});

	it('has a name equal to w-detail-fund-asset', () => {
		expect(wp.vm.$options.name).toBe('w-detail-fund-asset');
	});

	/* CD-3049 */
	it('shows the liquidation value with six digits', () => {
		expect(
			wp
				.find('[title="Liquidativo"]')
				.attributes('description')
				.replace(/\s/g, ' ')
		).toBe('123,456942 €');
	});

	it('should open a modal after click on cost effectiveness', async () => {
		await wp.find('[data-testid="profitability"]').trigger('click');

		expect(open).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ name: 'm-fund-profitability' })
		);
	});
});
