import { shallowMount } from '@vue/test-utils';
import Component from '@widgets/w-message-item.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('w-message-item.vue', () => {
	let router;

	const fixtureAlert = {
		id: '2a8520a5-381c-401d-9266-d111f5a23bc2',
		hasAttachment: false,
		text: 'Et sint dolor illum voluptas sapiente atque sint eum ad.',
		description: 'Voluptas omnis maiores quae.',
		expirationDate: '2021-09-30T06:04:19.401Z',
		reviewDate: '2020-07-26T01:57:28.491Z',
		creationDate: '2020-11-07T15:42:59.571Z',
		type: { id: 1, name: 'alerta' },
	};

	beforeEach(() => {
		const { localRouter } = newInstance;

		router = localRouter;
	});

	it('has a name equal to w-message-item', () => {
		const wp = shallowMount(Component, {
			localVue,
			router,
			propsData: { type: 'alert', source: fixtureAlert },
		});
		expect(wp.vm.$options.name).toBe('w-message-item');
	});

	it('renders an alert correctly', () => {
		const wp = shallowMount(Component, {
			localVue,
			router,
			propsData: { type: 'alert', source: fixtureAlert },
		});
		expect(wp.element).toMatchSnapshot();
	});

	it('should set the router destination to view detail', async () => {
		const wp = shallowMount(Component, {
			localVue,
			router,
			propsData: { type: 'alert', source: fixtureAlert },
		});

		expect(wp.vm.to).toMatchObject({
			name: 'communication-detail',
			params: { messageId: fixtureAlert.id },
		});
	});
});
