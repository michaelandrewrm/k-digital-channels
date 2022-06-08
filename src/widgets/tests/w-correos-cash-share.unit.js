import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-correos-cash-share.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-correos-cash-share.vue', () => {
	let wp;
	const canvas = document.createElement('canvas');

	beforeEach(() => {
		canvas.toBlob = jest.fn();
		wp = shallowMount(Component, {
			localVue,
			propsData: { title: 'Importe código 2.490,00 €', canvas },
		});
	});

	it('has a name equal to w-correos-cash-share', () => {
		expect(wp.vm.$options.name).toBe('w-correos-cash-share');
	});

	it('should render correctly', () => {
		expect(wp.text().replace(/\s+/g, ' ')).toBe('Importe código 2.490,00 € Compartir');
	});

	it('should dispatch a custom event after click on share', async () => {
		const toDataURL = jest.spyOn(canvas, 'toDataURL');
		const dispatchEvent = jest.spyOn(window, 'dispatchEvent');

		await wp.setData({ isHybrid: true });
		await wp.find('[data-testid="share-button"]').trigger('click');

		expect(toDataURL).toHaveBeenCalledWith('image/png', 1.0);
		expect(dispatchEvent).toHaveBeenCalledWith(new CustomEvent('bridge-share-file'));
	});

	it('should share when it is supported', async () => {
		window.navigator.share = jest.fn();
		window.navigator.canShare = jest.fn(() => true);

		await wp.find('[data-testid="share-button"]').trigger('click');

		expect(window.navigator.canShare).toHaveBeenCalled();
	});
});
