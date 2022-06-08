import { shallowMount } from '@vue/test-utils';
import Component from '@layouts/l-details.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('l-details.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			sync: false,
			stubs: {
				'c-sheet': {
					render() {
						return '<c-sheet></c-sheet>';
					},
					methods: {
						liftCardboard: () => {},
						dropCardboard: () => {},
					},
				},
			},
		});
	});

	it('has a name equal to l-details', () => {
		expect(wp.vm.$options.name).toBe('l-details');
	});

	it('lift the cardboard on wheel up (scroll down)', async () => {
		const bg = wp.findComponent({ ref: 'bg' });
		const sheet = wp.findComponent({ ref: 'sheet' });
		const liftCardboard = jest.spyOn(sheet.vm, 'liftCardboard');

		await bg.trigger('wheel', { deltaY: 10 });

		expect(liftCardboard).toHaveBeenCalled();
	});

	it('drop the cardboard on wheel down (scroll up)', async () => {
		const bg = wp.findComponent({ ref: 'bg' });
		const sheet = wp.findComponent({ ref: 'sheet' });
		const dropCardboard = jest.spyOn(sheet.vm, 'dropCardboard');

		await bg.trigger('wheel', { deltaY: -10 });

		expect(dropCardboard).toHaveBeenCalled();
	});

	it("doesn't lift the cardboard on wheel up (scroll down) if the content is fully visible", async () => {
		const bg = wp.findComponent({ ref: 'bg' });
		const sheet = wp.findComponent({ ref: 'sheet' });
		const liftCardboard = jest.spyOn(sheet.vm, 'liftCardboard');

		wp.setData({ bottomIsVisible: true });

		await bg.trigger('wheel', { deltaY: -10 });

		expect(liftCardboard).not.toHaveBeenCalled();
	});

	it('should focus the header', async () => {
		const VPersonalArea = {
			template: `
				<l-global>
					<h1 slot="header" tabindex="-1">Global Position</h1>
				</l-global>
			`,
		};
		const wrapper = shallowMount(VPersonalArea, {
			localVue,
			attachTo: document.body,
			stubs: {
				'l-global': Component,
			},
			sync: false,
		});

		expect(wrapper.element.ownerDocument.activeElement).toBeFalsy();
		await wrapper.vm.$nextTick();
		const h1 = wrapper.find('h1').element;
		expect(wrapper.element.ownerDocument.activeElement).toBe(h1);
	});
});
