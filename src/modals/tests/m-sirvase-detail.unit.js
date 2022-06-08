import { shallowMount } from '@vue/test-utils';
import Component from '@modals/m-sirvase-detail';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('m-sirvase-detail.vue', () => {
	let wp;
	let store;

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		wp = shallowMount(Component, {
			localVue,
			store,
			propsData: {
				source: {
					id: '1',
					type: {
						id: '01',
						name_es: 'Transferencias y traspasos',
						name_en: 'Transfers',
					},
					requestDate: '14-04-2022 23:00:00',
					status: {
						id: '01',
						name_es: 'Solicitada',
						name_en: 'Requested',
					},
					description: 'Test mocks server!!!',
				},
			},
		});
	});

	it('has a name equal to m-sirvase-detail', () => {
		expect(wp.vm.$options.name).toBe('m-sirvase-detail');
	});

	it('should close when clicked button', () => {
		const button = wp.find('[data-testid="close"]');

		button.trigger('click');

		expect(wp.emitted('close'));
	});

	it('should show different color for status', async () => {
		const selected = wp.find('[data-testid="selected"]');

		expect(selected.attributes().class).toContain('color-accent-icon');

		await wp.setData({
			status: {
				id: '02',
				name_es: 'Realizada',
				name_en: 'Done',
			},
		});

		expect(selected.attributes().class).toContain('color-accent-success');

		await wp.setData({
			status: {
				id: '03',
				name_es: 'Expirada',
				name_en: 'Expired',
			},
		});

		expect(selected.attributes().class).toContain('color-accent-error');
	});

	it('should save new status', async () => {
		const button = wp.find('[data-testid="save"]');

		await wp.setProps({
			source: {
				id: '1',
				type: {
					id: '01',
					name_es: 'Transferencias y traspasos',
					name_en: 'Transfers',
				},
				requestDate: '14-04-2022 23:00:00',
				status: {
					id: '01',
					name_es: 'Solicitada',
					name_en: 'Requested',
				},
				description: 'Test mocks server!!!',
			},
		});

		wp.vm.$data.status.id = '02';

		button.trigger('click');

		expect(wp.emitted('close'));
	});
});
