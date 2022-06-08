import { shallowMount } from '@vue/test-utils';
import component from '@components/c-profile-product';
import CCheckbox from '@tests/stubs/generic-checkbox.stub';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-profile-product', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(component, {
			localVue,
			propsData: {
				value: false,
				title: 'Cuenta corriente',
				subtitle: '**** **** **** **** **** 8290',
				info: '123.45 €',
				subinfo: 'Titular',
			},
			stubs: { CCheckbox },
		});
	});

	it('has a name equal to c-profile-product', () => {
		expect(wp.vm.$options.name).toBe('c-profile-product');
	});

	it('should render correctly', () => {
		expect(wp.text().replace(/\s+/g, ' ')).toBe(
			'Cuenta corriente **** **** **** **** **** 8290 123.45 € Titular'
		);
	});

	it('should toggle value on click', async () => {
		const wrapper = {
			template: '<c-profile-product v-model="isCheck" />',
			component: { CProfileProduct: component },
			data() {
				return { isCheck: false };
			},
		};

		wp = shallowMount(wrapper, { localVue, stubs: { CProfileProduct: component } });

		expect(wp.vm.isCheck).toBeFalsy();
		await wp.trigger('click');
		expect(wp.vm.isCheck).toBeTruthy();
	});
});
