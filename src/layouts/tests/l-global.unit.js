import { shallowMount } from '@vue/test-utils';
import Component from '@layouts/l-global.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('l-global.vue', () => {
	let wp;
	let store;

	const CSheet = {
		render: () => '<c-sheet></c-sheet>',
		methods: { liftCardboard: jest.fn(), dropCardboard: jest.fn() },
	};

	beforeEach(() => {
		const { shallowStore } = newInstance;
		store = shallowStore;

		store.registerModule('app', { namespaced: true, state: { companyId: 'BC' } });

		wp = shallowMount(Component, { localVue, store, stubs: { CSheet } });
	});

	it('has a name equal to l-global', () => {
		expect(wp.vm.$options.name).toBe('l-global');
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
			store,
			stubs: {
				'l-global': Component,
			},
		});

		expect(wrapper.element.ownerDocument.activeElement).toBeFalsy();
		await wrapper.vm.$nextTick();
		const h1 = wrapper.find('h1').element;
		expect(wrapper.element.ownerDocument.activeElement).toBe(h1);
	});

	it('should drop the cardboard on reset sheet', async () => {
		// When the user clicks on the chart icon button
		// we receive resetSheet prop only if the sheet is lifted
		const sheet = wp.findComponent({ ref: 'sheet' });
		const dropCardboard = jest.spyOn(sheet.vm, 'dropCardboard');

		await sheet.vm.$emit('beforeLift');
		expect(sheet.emitted().beforeLift).toBeTruthy();

		await wp.setProps({ resetSheet: true });

		expect(wp.vm.sheetLifted).toBeTruthy();
		expect(dropCardboard).toHaveBeenCalled();
	});

	it('should emit a sheet-lifted event after the sheet is lifted', async () => {
		const sheet = wp.findComponent({ ref: 'sheet' });

		await sheet.vm.$emit('beforeLift');

		expect(sheet.emitted().beforeLift).toBeTruthy();
		expect(wp.emitted()['sheet-lifted'][0][0]).toBe(true);
	});
});
