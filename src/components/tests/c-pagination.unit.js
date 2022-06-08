import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-pagination';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-pagination.vue', () => {
	let wp;

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				pageNumber: 0,
				totalPages: 100,
				loading: false,
			},
			sync: false,
		});
	});

	it('has a name equal to c-pagination', () => {
		expect(wp.vm.$options.name).toBe('c-pagination');
	});

	it('should not show the previous and next buttons on single page', async () => {
		await wp.setProps({ totalPages: 1 });
		expect(wp.find('[data-testid="previous-btn"]').exists()).toBeFalsy();
		expect(wp.find('[data-testid="next-btn"]').exists()).toBeFalsy();
	});

	it('should show only the first 5 numbers and the last one for long list of pages', () => {
		const pageList = wp.findAll('li');
		expect(pageList.at(0).text()).toBe('1');
		expect(pageList.at(1).text()).toBe('2');
		expect(pageList.at(2).text()).toBe('3');
		expect(pageList.at(3).text()).toBe('4');
		expect(pageList.at(4).text()).toBe('5');
		expect(pageList.at(5).text()).toMatch('…');
		expect(pageList.at(6).text()).toBe('100');
	});

	it('should add the active attr for a selected item', async () => {
		const pageList = wp.findAll('li');
		expect(pageList.at(0).attributes()).toHaveProperty('active');

		await wp.setProps({ pageNumber: 2 });

		expect(pageList.at(2).attributes()).toHaveProperty('active');
	});

	it('should update the active page on click', async () => {
		expect(wp.vm.pageNumber).toBe(0);

		const pageList = wp.findAll('li');
		await pageList.at(2).trigger('click');

		expect(wp.emitted('update:pageNumber')[0][0]).toBe(2);

		await pageList.at(6).trigger('click');

		expect(wp.emitted('update:pageNumber')[1][0]).toBe(99);
	});

	it('should replace the second item by ellipsis when the fifth is selected', async () => {
		const pageList = wp.findAll('li');
		expect(pageList.at(1).text()).toBe('2');

		await wp.setProps({ pageNumber: 4 });

		expect(
			wp
				.findAll('li')
				.at(1)
				.text()
		).toMatch('…');
	});
});
