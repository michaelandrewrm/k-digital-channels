import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/products/fund-asset/w-movement-sheet-fund-asset';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-movement-sheet-fund-asset.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				movement: {
					amount: {
						amount: 123.45,
						currency: { id: 'EUR', code: '978' },
					},
					name: '',
					operationDate: new Date(),
					reason: '',
					unityQuantity: 123.45,
				},
			},
		});
	});

	it('has a name equal to w-movement-sheet-fund-asset', () => {
		expect(wp.vm.$options.name).toBe('w-movement-sheet-fund-asset');
	});
});
