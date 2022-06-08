import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-contracts';
import CButton from '@tests/stubs/c-button.stub';
import LModal from '@tests/stubs/l-modal.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-contracts.vue', () => {
	let wp;
	let store;

	const fixture = {
		connectedContract: null,
		contracts: [
			{
				id: 'user-1',
				description: 'user-desc-1',
				type: 'user',
			},
			{
				id: 'owner-1',
				description: 'owner-desc-1',
				type: 'owner',
			},
			{
				id: 'user-2',
				description: 'user-desc-2',
				type: 'user',
			},
			{
				id: 'owner-2',
				description: 'owner-desc-2',
				type: 'owner',
			},
		],
	};

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { username: 'User', contracts: fixture, modal: false },
			stubs: { LModal, CButton },
		});
	});

	it('has a name equal to m-contracts', () => {
		expect(wp.vm.$options.name).toBe('m-contracts');
	});

	it('should greet an user', () => {
		expect(wp.vm.username).toBeTruthy();
		expect(wp.find('[data-testid="username"]').text()).toBe('Hola User');
	});

	it('should show the owner contracts as the first items', () => {
		const contracts = wp.findAll('[data-testid="contract"]');

		expect(
			contracts
				.at(0)
				.text()
				.replace(/\s+/g, ' ')
		).toBe('owner-desc-1 Titular');

		expect(
			contracts
				.at(1)
				.text()
				.replace(/\s+/g, ' ')
		).toBe('owner-desc-2 Titular');
	});

	it('should show an active contract', () => {
		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: {
				username: 'User',
				contracts: fixture,
				modal: false,
				connectedContract: { id: 'owner-1' },
			},
			stubs: { LModal, CButton },
		});

		const contract = wp.findAll('[data-testid="contract"]').at(0);
		contract.trigger('click');

		expect(contract.attributes('class')).toContain('--active');
		expect(wp.emitted('close')).toBeTruthy();
	});
});
