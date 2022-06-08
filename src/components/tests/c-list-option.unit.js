import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-list-option';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-list-option.vue', () => {
	it('should render default slots as list items', () => {
		const Wrapper = {
			template: `
				<div>
					<c-list-option>
						<button class="opt-1" />
						<button class="opt-2" />
						<button class="opt-3" />
					</c-list-option>
				</div>`,
			components: { CListOption: Component },
		};

		const wp = shallowMount(Wrapper, {
			localVue,
			sync: false,
			stubs: {
				'c-list-option': Component,
			},
		});

		expect(wp.findAll('li').length).toBe(3);
	});
});
