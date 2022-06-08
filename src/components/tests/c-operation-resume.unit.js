import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-operation-resume';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-operation-resume.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue });
	});

	it('has a name equal to c-operation-resume', () => {
		expect(wp.vm.$options.name).toBe('c-operation-resume');
	});

	it('renders correctly', async () => {
		await wp.setProps({
			resume: [
				{
					name: 'origin',
					disabled: true,
					label: 'Origen',
					value: 'AABB44',
					additionalInfo: 'AABB44',
				},
				{
					name: 'destination',
					disabled: false,
					label: 'Destino',
					value: 'MMPP00',
					additionalInfo: 'MMPP00',
				},
			],
		});

		expect(wp.find('[data-testid="section-origin"]').exists()).toBeTruthy();
		expect(wp.find('[data-testid="section-destination"]').exists()).toBeTruthy();

		expect(wp.find('[data-testid="edit-origin"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="edit-destination"]').exists()).toBeTruthy();

		await wp.find('[data-testid="edit-destination"]').trigger('click');

		expect(wp.emitted('edit')).toBeTruthy();
		expect(wp.emitted().edit[0][0]).toBe('destination');
	});
});
