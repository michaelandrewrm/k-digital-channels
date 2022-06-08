import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-correos-cash-download.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-correos-cash-download.vue', () => {
	let wp;
	const canvas = document.createElement('canvas');

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: { title: 'Importe código 2.490,00 €', canvas },
		});
	});

	it('has a name equal to w-correos-cash-download', () => {
		expect(wp.vm.$options.name).toBe('w-correos-cash-download');
	});

	it('should render correctly', () => {
		expect(wp.text().replace(/\s+/g, ' ')).toBe('Importe código 2.490,00 € Descargar');
	});

	it('should dispatch a custom event after click on download', async () => {
		const toDataURL = jest.spyOn(canvas, 'toDataURL');
		const dispatchEvent = jest.spyOn(window, 'dispatchEvent');

		await wp.setData({ isHybrid: true });
		await wp.find('[data-testid="button"]').trigger('click');

		expect(toDataURL).toHaveBeenCalledWith('image/png', 1.0);
		expect(dispatchEvent).toHaveBeenCalledWith(new CustomEvent('bridge-save-file'));
	});
});
