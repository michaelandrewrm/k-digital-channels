import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-transfer-scheduled.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-transfer-scheduled.vue', () => {
	let wp;

	const fixturePeriodic = {
		id: '1234',
		amount: { currency: { id: 'EUR' }, amount: 420.25 },
		reason: 'proximamente',
		nextExecutionDate: new Date('2020-8-17').toISOString(),
		beneficiary: { description: 'Anastasio' },
		periodicity: { frequency: '0.5' },
	};

	const fixtureScheduled = {
		id: '3132',
		amount: { currency: { id: 'EUR' }, amount: 500 },
		reason: 'proximamente',
		nextExecutionDate: new Date('2030-1-1').toISOString(),
		beneficiary: { description: 'Yo del futuro' },
	};

	beforeEach(() => {
		wp = shallowMount(Component, {
			localVue,
			propsData: {
				source: fixturePeriodic,
				type: 'scheduled',
			},
		});
	});

	it('has a name equal to w-transfer-scheduled', () => {
		expect(wp.vm.$options.name).toBe('w-transfer-scheduled');
	});

	it('renders correctly', async () => {
		expect(wp.element).toMatchSnapshot();

		await wp.setProps({ source: fixtureScheduled });

		expect(wp.element).toMatchSnapshot();
	});
});
