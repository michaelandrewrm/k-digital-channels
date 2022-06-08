import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-toolbar';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-toolbar.vue', () => {
	let wp;
	let store;
	const fixture = [
		{ id: 'item-1', iconActive: {}, title: 'item-1' },
		{ id: 'item-2', icon: {}, title: 'item-2' },
		{ id: 'item-3', icon: {}, title: 'item-3', disabled: true },
		{ id: 'item-4', icon: {}, title: 'item-4', highlight: true },
	];

	const activeLogout = jest.fn();

	beforeEach(() => {
		const { shallowStore } = newInstance;

		store = shallowStore;

		store.mockModule('authn', { activeLogout });

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: { items: fixture, selected: '', horizontal: false },
		});
	});

	it('has a name equal to c-toolbar', () => {
		expect(wp.vm.$options.name).toBe('c-toolbar');
	});

	it('should emit an item selected event after pressing enter or space', async () => {
		await wp
			.findAll('[data-testid="item"] label')
			.at(0)
			.trigger('keypress.enter');

		expect(wp.emitted('item-selected')[0][0]).toBe('item-1');

		await wp
			.findAll('[data-testid="item"] label')
			.at(1)
			.trigger('keypress.space');

		expect(wp.emitted('item-selected')[1][0]).toBe('item-2');

		await wp
			.findAll('[data-testid="item"] input')
			.at(0)
			.setChecked();

		expect(wp.emitted('item-selected')[2][0]).toBe('item-1');
	});

	it('should not emit an item selected event on disabled items', async () => {
		await wp
			.findAll('[data-testid="item"] input')
			.at(2)
			.setChecked();

		expect(wp.emitted('item-selected')).toBeFalsy();
	});

	it('should emit a toggle menu event after pressing enter or space', async () => {
		await wp.setProps({ horizontal: true });
		await wp.find('[data-testid="more-button"] label').trigger('keypress.enter');

		expect(wp.emitted('toggle-menu')).toHaveLength(1);

		await wp.findAll('[data-testid="more-button"] label').trigger('keypress.space');

		expect(wp.emitted('toggle-menu')).toHaveLength(2);
	});

	it('should logout', async () => {
		await wp.find('[data-testid="logout-button"]').trigger('click');

		expect(activeLogout).toHaveBeenCalled();
	});
});
