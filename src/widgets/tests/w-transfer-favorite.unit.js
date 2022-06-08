import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-favorite.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-favorite.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				id: '1234',
				source: {
					alias: 'Pago curso',
					amount: {
						currency: { id: 'EUR' },
						amount: 420.25,
					},
				},
				type: 'favorite',
			},
		});
	});

	it('has a name equal to w-transfer-favorite', () => {
		expect(wp.vm.$options.name).toBe('w-transfer-favorite');
	});

	it('renders correctly', () => {
		expect(wp.element).toMatchSnapshot();
	});
});
