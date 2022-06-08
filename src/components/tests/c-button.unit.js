import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-button';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-button.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, { localVue, slots: { default: 'Aceptar' } });
	});

	it('has a name equal to c-button', () => {
		expect(wp.vm.$options.name).toBe('c-button');
	});

	it('should render as raised', async () => {
		await wp.setProps({ raised: true });

		expect(wp).toMatchSnapshot();
	});

	it('should render as unelevated', async () => {
		await wp.setProps({ unelevated: true });

		expect(wp).toMatchSnapshot();
	});

	it('should render as outlined', async () => {
		await wp.setProps({ outlined: true });

		expect(wp).toMatchSnapshot();
	});

	it('should render as dense', async () => {
		await wp.setProps({ dense: true });

		expect(wp).toMatchSnapshot();
	});

	it('should render as anchor', async () => {
		expect(wp.element.tagName).toEqual('BUTTON');

		await wp.setProps({ href: '/' });

		expect(wp.element.tagName).toEqual('A');
		expect(wp).toMatchSnapshot();
	});

	it('should render with the text-fixed-m-medium class', () => {
		expect(wp).toMatchSnapshot();
		expect(wp.classes()).toContain('text-fixed-m-medium');
	});
});
