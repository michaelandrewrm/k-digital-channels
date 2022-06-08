import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Component from '@views/v-personal-details.vue';

const newInstance = createPristineVue();
const { localVue } = newInstance;

describe('v-personal-details.vue', () => {
	it('has a name equal to v-personal-details', () => {
		const { localStore } = newInstance;
		const store = localStore;
		const wp = shallowMount(Component, {
			localVue,
			store,
			sync: false,
		});

		expect(wp.vm.$options.name).toBe('v-personal-details');
	});

	it('shows the user personal details', async () => {
		const { localStore } = newInstance;
		const store = localStore;

		jest.useFakeTimers();

		store.unregisterModule('user');
		store.registerModule('user', {
			namespaced: true,
			actions: {
				getPersonalDetails: jest.fn().mockResolvedValue({
					data: {
						name: 'Albus',
						surname1: 'Wulfric',
						surname2: 'Dumbledore',
						birthdate: '01/10/1930',
						phone: '123456789',
						email: 'albuswulfric@email.com',
					},
				}),
			},
		});

		const wp = shallowMount(Component, {
			localVue,
			store,
			stubs: {
				'c-list-icon-item': {
					template: `
						<div class="c-list-icon-item">{{ description }}</div>
					`,
					props: ['title', 'description'],
				},
			},
			sync: false,
		});

		jest.runAllTimers();
		await flushPromises();

		expect(wp.find('[data-testid="detail-title"]').text()).toBe('Mis datos personales');
		expect(wp.find('[data-testid="full-name"]').text()).toBe('Albus Wulfric Dumbledore');
		expect(wp.find('[data-testid="birthdate"]').text()).toBe('01/10/1930');
		expect(wp.find('[data-testid="email"]').text()).toBe('albuswulfric@email.com');
		expect(wp.find('[data-testid="phone"]').text()).toBe('123456789');
	});

	it('catches an error on showing the user personal details', async () => {
		const { localStore } = newInstance;
		const store = localStore;

		jest.useFakeTimers();

		store.unregisterModule('user');
		store.registerModule('user', {
			namespaced: true,
			actions: {
				getPersonalDetails: jest.fn().mockRejectedValue(),
			},
		});

		const wp = shallowMount(Component, {
			localVue,
			store,
			sync: false,
		});

		jest.runAllTimers();
		await flushPromises();

		expect(wp.vm.error).toBeTruthy();
	});

	it('should action router back after receive an empty data', async () => {
		const { localStore, localRouter } = newInstance;
		const store = localStore;
		const router = localRouter;
		const back = jest.spyOn(router, 'back');

		jest.useFakeTimers();

		store.unregisterModule('user');
		store.registerModule('user', {
			namespaced: true,
			actions: {
				getPersonalDetails: jest.fn().mockResolvedValue({}),
			},
		});

		const wp = shallowMount(Component, {
			localVue,
			store,
			router,
			sync: false,
		});

		jest.runAllTimers();
		await flushPromises();

		expect(back).toHaveBeenCalled();
		expect(wp.vm.detail).toBeNull();
	});
});
