import { shallowMount } from '@vue/test-utils';
import Component from '@components/c-calendar';
import flushPromises from 'flush-promises';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('c-calendar', () => {
	let wp;

	const VCalendar = {
		template: `
			<div
				id="calendar"
				v-bind="$attrs"
				v-on="$listeners"
				@click="$emit('dayclick', { id, isDisabled })"
				@keydown.enter="$emit('daykeydown', { id, isDisabled, event: { keyCode: 13 } })"
				@keydown.space="$emit('daykeydown', { id, isDisabled, event: { keyCode: 32 } })"
			>
				<span id="date" class="date">{{ id }}</span>
			</div>`,
		props: {
			attributes: { type: null },
		},
		data() {
			const [date] = new Date().toISOString().split('T');
			return {
				isDisabled: false,
				id: date,
			};
		},
		methods: {
			move(value) {
				return new Promise((resolve) => {
					[this.id] = new Date(value).toISOString().split('T');
					resolve();
				});
			},
		},
		watch: {
			attributes([{ dates }]) {
				if (dates) {
					[this.id] = new Date(dates).toISOString().split('T');
				}
			},
		},
	};

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			stubs: { VCalendar },
		});
	});

	it('has a name equal to c-calendar', async () => {
		expect(wp.vm.$options.name).toBe('c-calendar');
	});

	it('should set the selected date on click', async () => {
		const [date] = new Date().toISOString().split('T');

		await wp.find('#calendar').trigger('click');
		expect(wp.emitted()['update:value'][0][0]).toBe(date);
		expect(wp.emitted()['selected-date']).toBeTruthy();
		expect(wp.emitted().close).toBeTruthy();
	});

	it('should set the date after press ENTER', async () => {
		expect(wp.emitted()['update:value']).toBeFalsy();
		expect(wp.emitted()['selected-date']).toBeFalsy();
		expect(wp.emitted().close).toBeFalsy();
		await wp.find('#calendar').trigger('keydown.enter');
		expect(wp.emitted()['update:value']).toBeTruthy();
		expect(wp.emitted()['selected-date']).toBeTruthy();
		expect(wp.emitted().close).toBeTruthy();
	});

	it('should set the date after press SPACE', async () => {
		expect(wp.emitted()['update:value']).toBeFalsy();
		expect(wp.emitted()['selected-date']).toBeFalsy();
		expect(wp.emitted().close).toBeFalsy();
		await wp.find('#calendar').trigger('keydown.space');
		expect(wp.emitted()['update:value']).toBeTruthy();
		expect(wp.emitted()['selected-date']).toBeTruthy();
		expect(wp.emitted().close).toBeTruthy();
	});

	it('should render the component with a selected date', async () => {
		wp = shallowMount(Component, {
			localVue,
			stubs: { VCalendar },
			propsData: { value: '2020-02-01' },
		});

		await flushPromises();

		expect(wp.find('#date').text()).toBe('2020-02-01');
	});
});
