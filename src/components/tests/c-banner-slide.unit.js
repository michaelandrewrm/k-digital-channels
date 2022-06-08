import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-banner-slide';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-banner-slide.vue', () => {
	it("has a name equal 'c-banner-slide'", () => {
		const wp = shallowMount(Component, { localVue, propsData: { data: {} } });

		expect(wp.vm.$options.name).toBe('c-banner-slide');
	});

	it('should render correctly', () => {
		const wp = shallowMount(Component, {
			localVue,
			propsData: {
				enableFeedback: true,
				data: {
					imageURL: 'image.jpg',
					title: 'Anything',
					body: 'Lorem ipsom dolor...',
					feedback: 1,
				},
			},
		});

		expect(wp).toMatchSnapshot();
	});
});
