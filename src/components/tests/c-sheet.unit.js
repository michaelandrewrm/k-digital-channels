import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-sheet';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-icon.vue', () => {
	let shallowWrapper;

	beforeEach(() => {
		shallowWrapper = shallowMount(Component, {
			localVue,
			sync: false,
		});
	});

	it("has a name equal 'c-sheet'", () => {
		expect(shallowWrapper.vm.$options.name).toBe('c-sheet');
	});

	it('emit lift and drop events when lift and drop the cardboard', async () => {
		shallowWrapper.vm.liftCardboard();

		expect(shallowWrapper.emitted()).toEqual({ beforeLift: [[]], lift: [[]] });

		shallowWrapper.vm.dropCardboard();

		await shallowWrapper.trigger('transitionend');

		expect(shallowWrapper.emitted()).toEqual({
			beforeLift: [[]],
			lift: [[]],
			beforeDrop: [[]],
			drop: [[]],
		});
	});

	it('moves to the right position on lifting cardboard', async () => {
		Element.prototype.getBoundingClientRect = jest.fn(() => ({
			width: 120,
			height: 120,
			top: 250,
		}));

		shallowWrapper.setProps({ shiftTo: 200 });

		expect(shallowWrapper.vm.styles.height).toBe('100%');
		expect(shallowWrapper.vm.styles.transform).toBe('');

		shallowWrapper.vm.liftCardboard();

		expect(shallowWrapper.vm.styles.height).toBe('calc(100% - 200px)');

		shallowWrapper.vm.dropCardboard();

		expect(shallowWrapper.vm.styles.transform).toBe('translateY(50px)');

		await shallowWrapper.trigger('transitionend');

		expect(shallowWrapper.vm.styles.height).toBe('100%');
		expect(shallowWrapper.vm.styles.transform).toBe('');

		Element.prototype.getBoundingClientRect.mockRestore();
	});
});
