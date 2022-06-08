import { shallowMount } from '@vue/test-utils';
import component from '@components/c-profile-item';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-profile-item', () => {
	let wp;

	const fixture = { id: 'profile-1', name: 'profile', isDefault: false };

	beforeEach(() => {
		wp = shallowMount(component, { localVue, propsData: { profile: fixture, editable: true } });
	});

	it('has a name equal to c-profile-item', () => {
		expect(wp.vm.$options.name).toBe('c-profile-item');
	});

	it('should render correctly', () => {
		expect(wp).toMatchSnapshot();
	});

	it('should emit a select-item', async () => {
		await wp.find('[data-testid="icon"]').trigger('click');
		expect(wp.emitted('select-item')).toBeTruthy();
	});

	it('should emit a delete-item', async () => {
		await wp.find('[data-testid="delete"]').trigger('click');
		expect(wp.emitted('delete-item')).toBeTruthy();
	});

	it('should emit a edit-item', async () => {
		await wp.find('[data-testid="edit"]').trigger('click');
		expect(wp.emitted('edit-item')).toBeTruthy();
	});

	it('should emit a set-item', async () => {
		await wp.find('[data-testid="set"]').trigger('click');
		expect(wp.emitted('set-item')).toBeTruthy();
	});

	it('should not show the options when is not editable', () => {
		wp = shallowMount(component, { localVue, propsData: { profile: fixture, editable: false } });
		expect(wp.find('[data-testid="option-button"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="options"]').exists()).toBeFalsy();
	});
});
