import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/account/w-movement-sheet-account.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-sheet-account.vue', () => {
	let wp;

	const movement = {
		id: 'movement-1',
		amount: { amount: -766.2, currency: { id: 'EUR' } },
		balance: { amount: 123.45, currency: { id: 'EUR' } },
		reason: 'Compra en Carrefour',
	};

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			sync: false,
			propsData: {
				movement,
			},
		});
	});

	it('has a name equal to w-movement-sheet-account', () => {
		expect(wp.vm.$options.name).toBe('w-movement-sheet-account');
	});

	it('should render correctly', () => {
		expect(wp).toMatchSnapshot();
	});

	it('should show an account name and account balance', async () => {
		await wp.setProps({
			movement: {
				...movement,
				accountName: 'Current account',
			},
		});

		expect(wp).toMatchSnapshot();
		expect(
			wp
				.find('[data-testid="account-detail"]')
				.text()
				.replace(/\s/g, ' ')
		).toBe('Current account:  123,45 €');
	});
});
